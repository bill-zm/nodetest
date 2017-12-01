/**
 * Created by strawmanbobi
 * 2015-01-23
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

var Mobile = dbOrm.define('mobile',
    {
        id: Number,
        mobile_id: String,
        app_type: Number,
        app_version: String,
        push_type: Number,
        conversation_id: String,
        status: Number,
        update_time: String,
        longitude: Number,
        latitude: Number
    },
    {
        cache: false
    }
);

Mobile.createMobile = function(mobile, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var newMobile = new Mobile({
        mobile_id: mobile.mobile_id,
        app_type: mobile.app_type,
        app_version: mobile.app_version,
        push_type: mobile.push_type,
        conversation_id: mobile.conversation_id,
        status: enums.ITEM_VALID,
        update_time: date,
        longitude: mobile.longitude,
        latitude: mobile.latitude
    });
    newMobile.save(function(error, createdMobile) {
        if(error) {
            logger.error('failed to create mobile : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create mobile');
            callback(errorCode.SUCCESS, createdMobile);
        }
    });
};

Mobile.updateMobileByID = function(id, newMobile, callback) {
    Mobile.get(id, function(error, mobile) {
        if (error || null == mobile || enums.ITEM_INVALID == mobile.status) {
            logger.error("failed to get mobile in update mobile by conditions : " + error);
            callback(errorCode.FAILED, null);
        } else {
            for(var p in mobile) {
                if(null != newMobile[p]) {
                    mobile[p] = newMobile[p];
                }
            }
            mobile.save(function(error, updatedMobile) {
                if(error) {
                    logger.error('failed to update mobile : ' + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info('succeeded to update mobile');
                    callback(errorCode.SUCCESS, updatedMobile);
                }
            });
        }
    });
};

Mobile.findMobilesByConditions = function(conditions, callback) {
    Mobile.find(conditions)
        .run(function (error, mobiles) {
            if (error) {
                logger.error("find mobile error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find mobile successfully, length of mobiles = " + mobiles.length);
                callback(errorCode.SUCCESS, mobiles);
            }
        });
};

Mobile.listMobiles = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.lt(from);
        Mobile.find(conditions).limit(parseInt(count)).orderRaw("?? DESC", [sortField])
            .run(function (listMobilesErr, mobiles) {
                if (listMobilesErr) {
                    logger.error("list mobiles error : " + listMobilesErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list mobiles successfully");
                    callback(errorCode.SUCCESS, mobiles);
                }
            });
    } else {
        Mobile.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? DESC", [sortField])
            .run(function (listMobilesErr, mobiles) {
                if (listMobilesErr) {
                    logger.error("list mobiles error : " + listMobilesErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list mobiles successfully");
                    callback(errorCode.SUCCESS, mobiles);
                }
            });
    }
};

Mobile.getMobileByID = function(id, callback) {
    Mobile.get(id, function(error, mobile) {
        if (error) {
            logger.error("get mobile by ID error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get mobile by ID successfully");
            callback(errorCode.SUCCESS, mobile);
        }
    });
};

module.exports = Mobile;