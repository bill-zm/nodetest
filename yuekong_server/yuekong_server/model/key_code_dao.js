/**
 * Created by strawmanbobi
 * 2015-05-25
 */

require('../../../Infrastructure/BackEnd/configuration/constants');
var Cache = require('../../../Infrastructure/BackEnd/cache/redis.js');
var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var KeyCode = function(_cacheHost, _cachePort, _cacheUser, _cachePassword) {
    this.cache = new Cache(_cacheHost, _cachePort, _cacheUser, _cachePassword);
};

KeyCode.prototype.getKeyCodes = function(protocol, remote, callback) {
    // by the rule of remote indexing
    var key = protocol + "_" + remote;
    this.cache.get(key, false, function(getCacheError, value) {
        if(getCacheError != errorCode.SUCCESS.code) {
            logger.error("get cache error");
            callback(errorCode.FAILED, null);
        } else {
            logger.error("get cache successfully, value = " + value);
            callback(errorCode.SUCCESS, value);
        }
    });
};

KeyCode.prototype.createKeyCode = function(code, callback) {
    var key = code.protocol + "_" + code.remote;
    var value = code.value;
    this.cache.set(key, value, 0, function(setCacheError) {
        if(setCacheError != errorCode.SUCCESS.code) {
            logger.error("set cache error, key = " + key);
            callback(errorCode.FAILED);
        } else {
            logger.error("set cache successfully, key = " + key);
            callback(errorCode.SUCCESS);
        }
    });
};

module.exports = KeyCode;