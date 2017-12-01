/**
 * Created by strawmanbobi
 * 2016-01-21.
 */

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var SingleSwitchResponse = require('../response/single_switch_response.js');

var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var switchLogic = require('../work_unit/switch_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Get switch
 * parameter :  N/A
 * return :     SingleSwitchResponse
 */
exports.getSwitch = function (req, res) {
    var targetDevice = req.query.target_device;

    var UA = req.headers['user-agent'];

    var singleSwitchResponse = new SingleSwitchResponse();
    switchLogic.getSwitchWorkUnit(UA, targetDevice, function (getSwitchErr, switchGet) {
        singleSwitchResponse.status = getSwitchErr;
        singleSwitchResponse.entity = switchGet;
        res.send(singleSwitchResponse);
        res.end();
    });
};