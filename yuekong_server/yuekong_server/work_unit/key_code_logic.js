/**
 * Created by strawmanbobi
 * 2015-05-25
 */

require('../../../Infrastructure/BackEnd/configuration/constants');

var KeyCode = require('../model/key_code_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var enums = new Enums();
var errorCode = new ErrorCode();
var keyCode = new KeyCode(null, null, null, null);

exports.getKeyCodeWorkUnit = function (protocol, remote, callback) {
    keyCode.getKeyCodes(protocol, remote, function(getKeyCodeErr, value) {
        callback(getKeyCodeErr, value);
    });
};

exports.createKeyCodeWorkUnit = function (code, callback) {
    keyCode.createKeyCode(code, function(createKeyCodeErr) {
        callback(createKeyCodeErr);
    });
};