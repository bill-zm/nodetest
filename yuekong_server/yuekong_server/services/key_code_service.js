/**
 * Created by strawmanbobi
 * 2015-01-23.
 */

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var KeyCodeResponse = require('../response/key_code_response.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var keyCodeLogic = require('../work_unit/key_code_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Get Key Code
 * parameter :  protocol - remote protocol name
 *              remote - remote name
 * return :     KeyCodeResponse
 */
exports.getKeyCodes = function (req, res) {
    var protocol = req.query.protocol;
    var remote = req.query.remote;

    var keyCodeResponse = new KeyCodeResponse();
    keyCodeLogic.getKeyCodeWorkUnit(protocol, remote, function (getKeyCodeErr, keyCodes) {
        keyCodeResponse.status = getKeyCodeErr;
        keyCodeResponse.entity = keyCodes;
        res.send(keyCodeResponse);
        res.end();
    });
};

/*
 * function :   Create Key Code
 * parameter :  Body param - Key code of certain protocol-remote-key in JSON
 * return :     KeyCodeResponse
 */
// this function should be separated to keep the stability and performance of main server
exports.createKeyCode = function (req, res) {
    var keyCode = req.body;

    var serviceResponse = new ServiceResponse();
    keyCodeLogic.createKeyCodeWorkUnit(keyCode, function (createKeyCodeErr) {
        serviceResponse.status = createKeyCodeErr;
        res.send(serviceResponse);
        res.end();
    });
};