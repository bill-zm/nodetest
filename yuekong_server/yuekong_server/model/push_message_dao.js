/**
 * Created by strawmanbobi
 * 2016-04-27 (for UCON G1 and SIRIUS)
 */

// global inclusion
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
var dbOrm = require('../../../Infrastructure/BackEnd/db/mysql/mysql_connection').mysqlDB;
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;
var dateUtils = require('../../../Infrastructure/BackEnd/utils/date_utils.js');

// local inclusion
var ErrorCode = require('../configuration/error_code.js');
var Enums = require('../configuration/enums.js');

var errorCode = new ErrorCode();
var enums = new Enums();

var PushMessage = dbOrm.define('push_message',
    {
        id: Number,
        from_peer: String,
        to_peer: String,
        to_group: String,
        push_type: Number,
        dest_type: Number,
        message: String,
        status: Number,
        update_time: String
    },
    {
        cache: false
    }
);

PushMessage.createPushMessage = function(pushMessage, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var newPushMessage = new PushMessage({
        from_peer: pushMessage.from_peer,
        to_peer: pushMessage.to_peer,
        to_group: pushMessage.to_group,
        push_type: pushMessage.push_type,
        dest_type: pushMessage.dest_type,
        message: pushMessage.message,
        status: enums.ITEM_VALID,
        update_time: date
    });
    newPushMessage.save(function(error, createdPushMessage) {
        if(error) {
            logger.error('failed to create push message : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create push message');
            callback(errorCode.SUCCESS, createdPushMessage);
        }
    });
};

PushMessage.listPushMessages = function(conditions, sortField, callback) {
    logger.info("conditions = " + JSON.stringify(conditions));
    PushMessage.find(conditions).orderRaw("?? DESC", [sortField])
        .run(function (error, pushMessages) {
            if (error) {
                logger.error("list push messages error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("list push messages successfully");
                callback(errorCode.SUCCESS, pushMessages);
            }
        });
};

module.exports = PushMessage;