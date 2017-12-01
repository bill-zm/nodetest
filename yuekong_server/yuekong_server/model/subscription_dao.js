/**
 * Created by strawmanbobi
 * 2015-02-28.
 */

// global inclusion
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
var dbOrm = require('../../../Infrastructure/BackEnd/db/mysql/mysql_connection').mysqlDB;
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

// local inclusion
var ErrorCode = require('../configuration/error_code');
var errorCode = new ErrorCode();
var Enums = require('../configuration/enums');
var enums = new Enums();

var Subscription = dbOrm.define('subscription',
    {
        id: Number,
        sub_time: String,
        device_pdsn: String,
        remote_id: String,
        remote_keys: String,
        status: Number,
        remote_index_type: Number,
        pure_keys: String,
        category_id: Number,
        mobile_id: String,
        user_id: String,
        remote_no: Number,
        remote_name: String,
        remote_instance_id: Number,
        binary_version: String,
        remote_status: Number,
        ble_tag104: Number,
        ble_target_mac: String,
        ble_target_name: String,
        radio_type: Number,
        sub_cate: Number
    },
    {
        cache: false
    }
);

Subscription.createSubscription = function(subscription, remoteKeys, callback) {
    var newSubscription = new Subscription({
        sub_time: subscription.sub_time,
        device_pdsn: subscription.device_pdsn,
        remote_id: subscription.remote_id,
        // subscription kies format : INTERVAL0, KEY0, INTERVAL1, KEY1, INTERVAL2, KEY2... (not more than 4 groups)
        remote_keys: subscription.remote_keys,
        status: enums.ITEM_VALID,
        remote_index_type: subscription.remote_index_type,
        pure_keys: subscription.pure_keys,
        category_id: subscription.category_id,
        mobile_id: subscription.mobile_id,
        user_id: subscription.user_id,
        remote_no: subscription.remote_no,  // this indicates the remote ID of configured remote
        remote_name: subscription.remote_name,
        remote_instance_id: subscription.remote_instance_id,
        binary_version: subscription.binary_version,
        remote_status: subscription.remote_status,
        ble_tag104: subscription.ble_tag104,
        ble_target_mac: subscription.ble_target_mac,
        ble_target_name: subscription.ble_target_name,
        radio_type: subscription.radio_type,
        sub_cate: subscription.sub_cate
    });

    if(null == newSubscription.binary_version || undefined == newSubscription.binary_version) {
        newSubscription.binary_version = '1';
    }

    newSubscription.save(function(error, createdSubscription) {
        if(error) {
            logger.error('failed to create subscription : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create subscription');
            callback(errorCode.SUCCESS, createdSubscription);
        }
    });
};

Subscription.findSubscriptionsByConditions = function(conditions, from, count, sortField, callback) {
    Subscription.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? ASC", [sortField])
        .run(function (error, subscriptions) {
            if (error) {
                logger.error("find subscriptions error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find subscriptions successfully, length of subscriptions = " + subscriptions.length);
                callback(errorCode.SUCCESS, subscriptions);
            }
        });
};

Subscription.getSubscriptionByID = function(subscriptionID, callback) {
    Subscription.get(subscriptionID, function(error, subscription) {
        if (error) {
            logger.error("get subscription error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.error("get subscription successfully");
            callback(errorCode.SUCCESS, subscription);
        }
    });
};

Subscription.updateSubscriptionByID = function(subscriptionID, newSubscription, callback) {
    Subscription.get(subscriptionID, function(error, subscription) {
        if (error || null == subscription) {
            logger.error("update subscription by ID error in get subscription : " + error);
            callback(errorCode.FAILED, null);
        } else {
            if (enums.ITEM_INVALID == subscription.status) {
                logger.error("subscription is already deleted");
                callback(errorCode.FAILED, null);
            } else {
                for(var p in subscription) {
                    if(null != newSubscription[p]) {
                        subscription[p] = newSubscription[p];
                    }
                }
                subscription.save(function(error, updatedSubscription) {
                    if(error) {
                        logger.error('failed to update subscription : ' + error);
                        callback(errorCode.FAILED, null);
                    } else {
                        logger.info('succeeded to update subscription');
                        callback(errorCode.SUCCESS, updatedSubscription);
                    }
                });
            }
        }
    });
};

Subscription.deleteSubscriptionByID = function(subscriptionID, callback) {
    Subscription.get(subscriptionID, function(error, subscription) {
        if (error || null == subscription) {
            logger.error("update subscription by ID error in get subscription : " + error);
            callback(errorCode.SUCCESS);
        } else {
            subscription.status = enums.ITEM_INVALID;
            subscription.save(function(error, updatedSubscription) {
                if (error) {
                    logger.error('failed to update subscription in delete subscription : ' + error);
                    callback(errorCode.FAILED);
                } else {
                    logger.info('successfully to update subscription in delete subscription');
                    callback(errorCode.SUCCESS);
                }
            });
        }
    });
};

module.exports = Subscription;