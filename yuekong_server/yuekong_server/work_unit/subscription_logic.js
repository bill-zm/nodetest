/**
 * Created by strawmanbobi on
 * 2015-02-28
 */

// system inclusion
var async = require('async');

require('../../../Infrastructure/BackEnd/configuration/constants');
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');

var Subscription = require('../model/subscription_dao.js');
var Remote = require('../model/remote_dao.js');
var DeviceAuth = require('../authority/device_auth.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;
var dateUtils = require('../../../Infrastructure/BackEnd/utils/date_utils.js');

var enums = new Enums();
var errorCode = new ErrorCode();
var deviceAuth = new DeviceAuth(MEMCACHED_HOST, MEMCACHED_PORT, MEMCACHED_SASL_USER, MEMCACHED_SASL_PASSWORD);

var BASIC_TIME_DIFF = 10;

exports.createSubscriptionWorkUnit = function (pdsn, token, subscription, callback) {
    var key = "device_" + pdsn;
    var conditions = null;
    /*
    deviceAuth.validateAuthInfo(key, token, function(validateDeviceAuthErr) {
        if(errorCode.SUCCESS.code == validateDeviceAuthErr.code) {
    */
    // in current version, just subscribe "POWER" key by default
    Subscription.createSubscription(subscription, "0,POWER",
        function(createSubscriptionErr, createdSubscription) {
            callback(createSubscriptionErr, createdSubscription);
        });
    /*
        } else {
            callback(validateDeviceAuthErr, null);
        }
    });
    */
};

exports.updateSubscriptionWorkUnit = function (id, subscription, callback) {
    Subscription.updateSubscriptionByID(id, subscription,
        function(updateSubscriptionErr, updatedSubscription) {
            callback(updateSubscriptionErr, updatedSubscription);
        });
};

exports.getSubscriptionWorkUnit = function (pdsn, from, count, binary_version, UA, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var deviceVersion = "V1.0.0";
    var retSubscriptions = [];

    if (undefined != UA && null != UA && UA.indexOf("device_yk") >= 0) {
        deviceVersion = "V" + UA.substring(10);
    }

    logger.info("found version of device = " + deviceVersion);

    if (null == binary_version || undefined == binary_version) {
        binary_version = '1';
    } else {
        if ("V1.0.0" == deviceVersion) {
            deviceVersion = "V1.4.0";
        }
    }
    var conditions = {
        sub_time: orm.lt(date),
        device_pdsn: pdsn,
        status: enums.ITEM_VALID,
        binary_version: binary_version
    };
    Subscription.findSubscriptionsByConditions(conditions, from, count, "id",
    function(findSubscriptionErr, subscriptions) {
        if(errorCode.SUCCESS.code == findSubscriptionErr.code &&
            null != subscriptions && subscriptions.length > 0) {
            // update the status fetched subscriptions to INVALID
            retSubscriptions.length = 0;
            async.eachSeries(subscriptions, function (subscription, innerCallback) {
                logger.info("process subscription ID = " + subscription.id);
                subscription.status = enums.ITEM_INVALID;
                Subscription.updateSubscriptionByID(subscription.id, subscription,
                    function (updateSubscriptionErr, updatedSubscription) {
                        // filt-out those version do not match
                        var remoteID = subscription.remote_no;
                        if (0 != remoteID) {
                            Remote.getRemoteIndexInfo(remoteID, function(getRemoteErr, remoteIndexInfos) {
                                if (errorCode.SUCCESS.code == getRemoteErr.code && null != remoteIndexInfos &&
                                    remoteIndexInfos.length > 0) {
                                    var remoteIndexInfo = remoteIndexInfos[0];
                                    if (deviceVersion >= remoteIndexInfo.applied_device_version &&
                                        deviceVersion < remoteIndexInfo.banned_device_version) {
                                        if (null == subscription.radio_type) {
                                            subscription.radio_type = 0;
                                        }

                                        // compatible with latest APP supporting hexdecimal decoding
                                        if (null == subscription.sub_cate) {
                                            subscription.sub_cate = 1;
                                        }

                                        // issue fix : exclude subscriptions whose subscription time is out of
                                        // 10 minutes from current time
                                        var diff = dateUtils.getDateDiffer(subscription.sub_time, date, "minute");
                                        logger.info("time diff between " + subscription.sub_time + " and " + date +
                                            " in minutes = " + diff);
                                        if (diff < BASIC_TIME_DIFF) {
                                            retSubscriptions.push(subscription);
                                        }

                                        logger.info("device version is correct, push subscription into return list");
                                    } else {
                                        logger.info("applied device version = " +
                                            remoteIndexInfo.applied_device_version);
                                        logger.info("banned device version = " +
                                            remoteIndexInfo.banned_device_version);
                                        logger.info("device version = " + deviceVersion);
                                    }
                                    innerCallback();
                                } else {
                                    logger.info("no remote index info found");
                                    // do not add subscription to return list
                                    innerCallback();
                                }
                            });
                        } else {
                            logger.error("suppose remote ID of subscription is not 0");
                            // do not add subscription to return list
                            innerCallback();
                        }
                    });
            }, function (err) {
                if(undefined != retSubscriptions && null != retSubscriptions) {
                    for (var i = 0; i < retSubscriptions.length; i++) {
                        retSubscriptions[i].sub_time = null;
                        retSubscriptions[i].device_pdsn = null;
                        retSubscriptions[i].remote_name = null;
                        retSubscriptions[i].binary_version = null;
                        retSubscriptions[i].mobile_id = null;
                    }
                }
                logger.info("return subscription value to client : " + JSON.stringify(retSubscriptions));
                callback(findSubscriptionErr, retSubscriptions);
            });
        } else {
            logger.info("no subscription listed, return success with empty value");
            callback(errorCode.SUCCESS, null);
        }
    });
};

exports.listSubscriptionWorkUnit = function (mobileID, from, count, callback) {
    var conditions = {
        mobile_id: mobileID,
        status: enums.ITEM_VALID
    };
    var retSubscriptions = [];
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    Subscription.findSubscriptionsByConditions(conditions, from, count, "sub_time",
        function(listSubscriptionsErr, subscriptions) {
        if (errorCode.SUCCESS.code != listSubscriptionsErr.code) {
            logger.err("list subscription error");
            callback(listSubscriptionsErr, null);
        } else {
            // remove those time-out subscriptions from list
            async.eachSeries(subscriptions, function (subscription, innerCallback) {
                var diff = dateUtils.getDateDiffer(subscription.sub_time, date, "minute");
                logger.info("list subscriptions, time diff between " + subscription.sub_time + " and " + date +
                    " in minutes = " + diff);
                if (diff < BASIC_TIME_DIFF) {
                    retSubscriptions.push(subscription);
                    innerCallback();
                } else {
                    // remove from db
                    Subscription.deleteSubscriptionByID(subscription.id, function(deleteSubscriptionErr) {
                        if (errorCode.SUCCESS != deleteSubscriptionErr) {
                            logger.warn("delete time-out subscription error : " + subscription.id);
                        }
                        innerCallback();
                    });
                }
            }, function (err) {
                callback(listSubscriptionsErr, retSubscriptions);
            });
        }
    });
};

exports.deleteSubscriptionWorkUnit = function (subscriptionID, callback) {
    Subscription.deleteSubscriptionByID(subscriptionID, function(deleteSubscriptionErr) {
        callback(deleteSubscriptionErr);
    })
};