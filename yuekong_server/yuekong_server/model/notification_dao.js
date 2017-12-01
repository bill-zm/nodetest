/**
 * Created by strawmanbobi
 * 2016-05-03
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

var Notification = dbOrm.define('notification',
    {
        id: Number,
        message_id: Number,
        message_content: String,
        badge: Number,
        silent: Number,
        sound: String,
        title: String,
        custom: String
    },
    {
        cache: false
    }
);

Notification.findNotificationsByConditions = function(conditions, callback) {
    Notification.find(conditions).run(function (error, notifications) {
        if (error) {
            logger.error("find notifications error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("find notifications successfully");
            callback(errorCode.SUCCESS, notifications);
        }
    });
};

module.exports = Notification;