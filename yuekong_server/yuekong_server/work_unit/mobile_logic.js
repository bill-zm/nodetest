/**
 * Created by strawmanbobi
 * 2015-01-23
 */

require('../../../Infrastructure/BackEnd/configuration/constants');

var Mobile = require('../model/mobile_dao.js');
var DeviceValidation = require('../model/device_validation_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var enums = new Enums();
var errorCode = new ErrorCode();

exports.updateMobileWorkUnit = function (newMobile, callback) {
    var conditions = {
        mobile_id: newMobile.mobile_id
    };

    Mobile.findMobilesByConditions(conditions, function(findMobileByMobileIDErr, mobiles) {
        if(errorCode.SUCCESS.code == findMobileByMobileIDErr.code &&
            null != mobiles &&
            mobiles.length > 0) {
            logger.info("mobile has been found by mobileID, update it");
            if(mobiles.length > 1) {
                logger.warn("more than 1 mobile has been found by mobileID (in register) please check");
            }
            var mobile = mobiles[0];
            Mobile.updateMobileByID(mobile.id, newMobile, function(updateMobileErr, updatedMobile) {
                callback(updateMobileErr, updatedMobile);
            });
        } else {
            logger.info("a new mobile, create new mobile : " + newMobile.mobile_id);
            Mobile.createMobile(newMobile, function (createMobileErr, createdMobile) {
                callback(createMobileErr, createdMobile);
            });
        }
    });
};

exports.listMobilesWorkUnit = function (from, count, callback) {
    var conditions = {
        status: enums.ITEM_VALID
    };
    Mobile.listMobiles(conditions, from, count, "id", function(getMobileByIDErr, mobiles) {
        callback(getMobileByIDErr, mobiles);
    });
};

exports.getMobileByIDWorkUnit = function (mobileID, callback) {
    Mobile.getMobileByID(mobileID, function(getMobileByIDErr, mobile) {
        if(errorCode.SUCCESS.code == getMobileByIDErr.code &&
            mobile &&
            enums.ITEM_VALID == mobile.status) {
            callback(getMobileByIDErr, mobile);
        } else {
            callback(errorCode.MOBILE_NOT_FOUND, null);
        }
    });
};

exports.getMobileByMobileIDWorkUnit = function (mobileID, callback) {
    var conditions = {
        status: enums.ITEM_VALID,
        mobile_id: mobileID
    };
    Mobile.findMobilesByConditions(conditions, function(getMobileByMobileIDErr, mobiles) {
        callback(getMobileByMobileIDErr, mobiles);
    });
};