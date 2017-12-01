/**
 * Created by strawmanbobi
 * 2015-01-23.
 */

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var SingleDeviceValidationResponse = require('../response/single_device_validation_response.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var deviceValidationLogic = require('../work_unit/device_validation_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Create device validation
 * parameter :  pdsn
 *              password
 * return :     SingleDeviceValidationResponse
 */
exports.createDeviceValidation = function (req, res) {
    var pdsn = req.query.pdsn;

    if(pdsn) {
        pdsn = pdsn.toUpperCase();
    }
    var singleDeviceValidationResponse = new SingleDeviceValidationResponse();
    deviceValidationLogic.createDeviceValidationWorkUnit(pdsn,
        function (createDeviceValidationErr, createdDeviceValidation) {
        singleDeviceValidationResponse.status = createDeviceValidationErr;
        singleDeviceValidationResponse.entity = createdDeviceValidation;
        res.send(singleDeviceValidationResponse);
        res.end();
    });
};