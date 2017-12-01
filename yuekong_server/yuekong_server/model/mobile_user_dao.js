/**
 * Created by strawmanbobi
 * 2015-05-05
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

var MobileUser = dbOrm.define('mobile_user',
    {
        id: Number,
        mobile_id: String,
        weixin_id: String,
        sns_type: Number,
        status: Number,
        update_time: String
    },
    {
        cache: false
    }
);

MobileUser.createMobileUser = function(mobileUser, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var newMobileUser = new MobileUser({
        mobile_id: mobileUser.mobile_id,
        weixin_id: mobileUser.weixin_id,
        sns_type: mobileUser.sns_type,
        status: enums.ITEM_VALID,
        update_time: date
    });
    newMobileUser.save(function(error, createdMobileUser) {
        if(error) {
            logger.error('failed to create mobile user : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create mobile user');
            callback(errorCode.SUCCESS, createdMobileUser);
        }
    });
};

MobileUser.updateMobileUserByID = function(id, newMobileUser, callback) {
    MobileUser.get(id, function(error, mobileUser) {
        if (error || null == mobileUser || enums.ITEM_INVALID == mobileUser.status) {
            logger.error("failed to get mobile user in update mobile user by conditions : " + error);
            callback(errorCode.FAILED, null);
        } else {
            for(var p in mobileUser) {
                if(null != newMobileUser[p]) {
                    mobileUser[p] = newMobileUser[p];
                }
            }
            mobileUser.save(function(error, updatedMobileUser) {
                if(error) {
                    logger.error('failed to update mobile user : ' + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info('succeeded to update mobile user');
                    callback(errorCode.SUCCESS, updatedMobileUser);
                }
            });
        }
    });
};

MobileUser.findMobileUsersByConditions = function(conditions, callback) {
    MobileUser.find(conditions)
        .run(function (error, mobileUsers) {
            if (error) {
                logger.error("find mobile user error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find mobile user successfully, length of mobileUsers = " + mobileUsers.length);
                callback(errorCode.SUCCESS, mobileUsers);
            }
        });
};

module.exports = MobileUser;