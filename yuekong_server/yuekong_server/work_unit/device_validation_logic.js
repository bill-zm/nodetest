/**
 * Created by strawmanbobi
 * 2015-01-23
 */

require('../../../Infrastructure/BackEnd/configuration/constants');
var DeviceValidation = require('../model/device_validation_dao.js');
var MD5 = require('../../../Infrastructure/BackEnd/security/md5.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var enums = new Enums();
var errorCode = new ErrorCode();

exports.createDeviceValidationWorkUnit = function (pdsn, callback) {
    var conditions = {
        pdsn : pdsn
    };
    DeviceValidation.findDeviceValidationByConditions(conditions,
        function(findDeviceValidationByConditionsErr, deviceValidations) {
            if(errorCode.SUCCESS.code == findDeviceValidationByConditionsErr.code &&
                null != deviceValidations && deviceValidations.length > 0) {
                callback(findDeviceValidationByConditionsErr, deviceValidations[0]);
            } else {
                var timeStamp = new Date().getTime();
                var password = MD5.MD5(pdsn  + timeStamp);
                var newDeviceValidation = {
                    pdsn: pdsn,
                    password: password
                };
                DeviceValidation.createDeviceValidation(newDeviceValidation,
                    function (createDeviceValidationErr, createdDeviceValidation) {
                    callback(createDeviceValidationErr, createdDeviceValidation);
                });
            }
        });
};