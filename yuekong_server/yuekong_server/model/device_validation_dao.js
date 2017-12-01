/**
 * Created by strawmanbobi
 * 2015-01-31
 */

// global inclusion
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
var dbOrm = require('../../../Infrastructure/BackEnd/db/mysql/mysql_connection').mysqlDB;
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

// local inclusion
var ErrorCode = require('../configuration/error_code');
var errorCode = new ErrorCode();

var DeviceValidation = dbOrm.define('device_validation',
    {
        id: Number,
        pdsn: String,
        password: String
    },
    {
        cache: false
    }
);

DeviceValidation.createDeviceValidation = function(deviceValidation, callback) {
    var newDeviceValidation = new DeviceValidation({
        pdsn: deviceValidation.pdsn,
        password: deviceValidation.password
    });
    newDeviceValidation.save(function(error, createdDeviceValidation) {
        if(error) {
            logger.error('failed to create device validation : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create device validation');
            callback(errorCode.SUCCESS, createdDeviceValidation);
        }
    });
};

DeviceValidation.findDeviceValidationByConditions = function(conditions, callback) {
    DeviceValidation.find(conditions)
        .run(function (error, deviceValidations) {
            if (error || null == deviceValidations || 0 == deviceValidations.length) {
                logger.error("find device validation error : " + error);
                callback(errorCode.DEVICE_VALIDATING_FAILED, null);
            } else {
                callback(errorCode.SUCCESS, deviceValidations);
            }
        });
};

module.exports = DeviceValidation;