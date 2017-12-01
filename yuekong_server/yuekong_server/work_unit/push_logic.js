/**
 * Created by strawmanbobi
 * 2015-01-23
 */

// global inclusion
require('../../../Infrastructure/BackEnd/configuration/constants');
var PushClient = require('../../../Infrastructure/BackEnd/msg_service/notification_helper.js');
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');

// local inclusion
var PushMessage = require('../model/push_message_dao.js');
var Mobile = require('../model/mobile_dao.js');
var Notification = require('../model/notification_dao.js');
var Subscription = require('../model/subscription_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var enums = new Enums();
var errorCode = new ErrorCode();

var async = require('async');

exports.createPushMessageWorkUnit = function (pushMessage, callback) {
    PushMessage.createPushMessage(pushMessage, function(createPushMessageErr, createdPushMessage) {
        callback(createPushMessageErr, createdPushMessage);
    });
};

exports.notifyUpdateWorkUnit = function (pushMessage, callback) {
    var conditions = {
        mobile_id: pushMessage.to_peer
    };
    Mobile.findMobilesByConditions(conditions, function(findMobilesErr, mobiles) {
        if (errorCode.SUCCESS.code == findMobilesErr.code &&
            null != mobiles &&
            mobiles.length > 0) {
            // get the first mobile as the destination
            var mobile = mobiles[0];
            var conversationID = mobile.conversation_id;

            if (undefined != conversationID && null != conversationID) {
                // try getting notification for specific message ID
                var notificationConditions = {
                    message_id: pushMessage.message
                };

                Notification.findNotificationsByConditions(notificationConditions,
                    function(findNotificationsErr, notifications) {
                        if (errorCode.SUCCESS.code == findNotificationsErr.code &&
                            null != notifications &&
                            notifications.length > 0) {
                            // push notification to peer
                            var notification = notifications[0];
                            var message = notification.message_content;
                            var sound = notification.sound;
                            var badge = notification.badge;
                            var silent = (1 == parseInt(notification.silent)) ? true : false;
                            var title = notification.title;
                            var custom = JSON.parse(notification.custom);

                            var pushClient = new PushClient(PUSH_APP_KEY, PUSH_APP_SECRET);
                            pushClient.pushMessageViaJPush(conversationID,
                                enums.JPUSH_DEST_TYPE_PEER,
                                enums.JPUSH_PUSH_TYPE_NOTIFICATION,
                                enums.JPUSH_DEVICE_TYPE_BOTH,
                                message,
                                sound,
                                badge,
                                silent,
                                title,
                                custom,
                                function(pushErr) {
                                    if (errorCode.SUCCESS.code == pushErr) {
                                        // logger.info("push succeeded, continue recording push message");
                                        var newPushMessage = {
                                            from_peer: pushMessage.from_peer,
                                            to_peer: pushMessage.to_peer,
                                            to_group: null,
                                            dest_type: enums.JPUSH_DEST_TYPE_PEER,
                                            push_type: enums.JPUSH_PUSH_TYPE_NOTIFICATION,
                                            message: notification.message_content
                                        };
                                        PushMessage.createPushMessage(newPushMessage,
                                            function(createPushMessageErr, createdPushMessage) {
                                                callback(createPushMessageErr);
                                            });
                                    } else {
                                        logger.info("failed to push to peer");
                                        callback(errorCode.FAILED);
                                    }
                                });
                        } else {
                            logger.info("find notification error : " + notifications.length);
                            callback(findNotificationsErr);
                        }
                    });
            } else {
                // the version of this APP is old, return success directly
                callback(errorCode.SUCCESS);
            }
        } else {
            logger.error("no mobiles are found");
            callback(errorCode.FAILED);
        }
    });
};

exports.notifySubscriptionWorkUnit = function (pushMessage, callback) {
    var idsStr = pushMessage.ids;
    var idsArray = [];
    var mobileIDArray = [];
    if (null != idsStr) {
        idsArray = idsStr.split(",");
    }
    if (idsArray.length > 0) {
        mobileIDArray.length = 0;
        async.eachSeries(idsArray, function (subscriptionID, innerCallback) {
            // get mobile IDs from subscription according to subscription ID
            Subscription.getSubscriptionByID(subscriptionID, function(getSubscriptionErr, subscription) {
                if (errorCode.SUCCESS.code == getSubscriptionErr.code && null != subscription) {
                    var mobileID = subscription.mobile_id;
                    if (false == targetInTemplate(mobileID, mobileIDArray)) {
                        logger.info("add mobileID to distinct list : " + mobileID);
                        mobileIDArray.push(mobileID);
                    } else {
                        logger.warn("mobile ID is already in distinct list : " + mobileID);
                    }
                    innerCallback();
                } else {
                    logger.error("get subscription failed");
                    innerCallback();
                }
            });
        }, function(err) {
            async.eachSeries(mobileIDArray, function(mobileID, pushCallback) {
                var conditions = {
                    mobile_id: mobileID
                };
                Mobile.findMobilesByConditions(conditions, function(findMobilesErr, mobiles) {
                    if (errorCode.SUCCESS.code == findMobilesErr.code &&
                        null != mobiles &&
                        mobiles.length > 0) {
                        // get the first mobile as the destination
                        var mobile = mobiles[0];
                        var conversationID = mobile.conversation_id;

                        if (undefined != conversationID && null != conversationID) {
                            // try getting notification for specific message ID
                            var notificationConditions = {
                                message_id: pushMessage.message
                            };

                            Notification.findNotificationsByConditions(notificationConditions,
                                function(findNotificationsErr, notifications) {
                                    if (errorCode.SUCCESS.code == findNotificationsErr.code &&
                                        null != notifications &&
                                        notifications.length > 0) {
                                        // push notification to peer
                                        var notification = notifications[0];
                                        var message = notification.message_content;
                                        var sound = notification.sound;
                                        var badge = notification.badge;
                                        var silent = (1 == parseInt(notification.silent)) ? true : false;
                                        var title = notification.title;
                                        var custom = JSON.parse(notification.custom);

                                        var pushClient = new PushClient(PUSH_APP_KEY, PUSH_APP_SECRET);
                                        pushClient.pushMessageViaJPush(conversationID,
                                            enums.JPUSH_DEST_TYPE_PEER,
                                            enums.JPUSH_PUSH_TYPE_NOTIFICATION,
                                            enums.JPUSH_DEVICE_TYPE_BOTH,
                                            message,
                                            sound,
                                            badge,
                                            silent,
                                            title,
                                            custom,
                                            function(pushErr) {
                                                if (errorCode.SUCCESS.code == pushErr) {
                                                    // logger.info("push succeeded, continue recording push message");
                                                    var newPushMessage = {
                                                        from_peer: pushMessage.from_peer,
                                                        to_peer: mobileID,
                                                        to_group: null,
                                                        dest_type: enums.JPUSH_DEST_TYPE_PEER,
                                                        push_type: enums.JPUSH_PUSH_TYPE_NOTIFICATION,
                                                        message: notification.message_content
                                                    };
                                                    PushMessage.createPushMessage(newPushMessage,
                                                        function(createPushMessageErr, createdPushMessage) {
                                                            pushCallback();
                                                        });
                                                } else {
                                                    logger.info("failed to push to peer");
                                                    pushCallback();
                                                }
                                            });
                                    } else {
                                        logger.info("find notification error : " + notifications.length);
                                        pushCallback();
                                    }
                                });
                        } else {
                            // the version of this APP is old, continue processing
                            pushCallback();
                        }
                    } else {
                        logger.error("no mobiles are found");
                        pushCallback();
                    }
                });
            }, function(innerErr) {
                // push requests are all handled, return
                logger.info("done processing all push requests by subscription");
                callback(errorCode.SUCCESS);
            });
        });
    } else {
        logger.warn("no subscription id is received");
        callback(errorCode.SUCCESS);
    }
};

exports.listPushMessageWorkUnit = function (pushType, destType, fromPeer, toPeer, month, callback) {
    var conditions = {
        status: enums.ITEM_VALID,
        update_time: orm.like(month + "%")
    };
    if ("undefined" != fromPeer && null != fromPeer) {
        conditions.from_peer = fromPeer;
    }
    if ("undefined" != toPeer && null != toPeer) {
        conditions.to_peer = toPeer;
    }
    if ("undefined" != destType && null != destType) {
        conditions.dest_type = destType;
    }
    if ("undefined" != pushType && null != pushType) {
        conditions.push_type = pushType;
    }
    PushMessage.listPushMessages(conditions, "id", function(listPushMessageErr, pushMessages) {
        callback(listPushMessageErr, pushMessages);
    });
};

exports.createPushMessageWorkUnit = function (pushMessage, callback) {
    PushMessage.createPushMessage(pushMessage, function(createPushMessageErr, createdPushMessage) {
        callback(createPushMessageErr, createdPushMessage);
    });
};

/**
 * Check if some target is in certain template
 * @param target : ID key of remote
 * @param template Array : Array of ID template
 */
function targetInTemplate(target, template) {
    for (var i = 0; i < template.length; i++) {
        // logger.info("** " + target + " ** " + template[i]);
        if (target == template[i]) {
            return true;
        }
    }
    return false;
}