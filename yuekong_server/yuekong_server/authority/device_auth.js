/**
 * Created by strawmanbobi
 * 2015-01-24
 */

require('../../../Infrastructure/BackEnd/configuration/constants');
var Cache = require('../../../Infrastructure/BackEnd/cache/memcached.js');
var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var DeviceAuth = function(_cacheHost, _cachePort, _cacheDevice, _cachePassword) {
    this.cache = new Cache(_cacheHost, _cachePort, _cacheDevice, _cachePassword);
};

DeviceAuth.prototype.setAuthInfo = function(id, token, ttl, callback) {
    this.cache.set(id, token, ttl, function(setDeviceAuthErr, data) {
        var error = errorCode.SUCCESS;
        if(setDeviceAuthErr != errorCode.SUCCESS.code) {
            error = errorCode.FAILED;
        }
        callback(error, data);
    });
};

DeviceAuth.prototype.validateAuthInfo = function(id, token, callback) {
    var error = errorCode.SUCCESS;
    this.cache.get(id, function(getDeviceAuthErr, result) {
        if(errorCode.SUCCESS.code != getDeviceAuthErr || !result || token != result) {
            logger.error("get values is not true: " + result);
            error = errorCode.AUTHENTICATION_FAILURE;
        }
        callback(error);
    });
};

DeviceAuth.prototype.deleteAuthInfo = function(id, callback) {
    var error = errorCode.SUCCESS;
    this.cache.delete(id, function(deleteDeviceAuthErr) {
        if(deleteDeviceAuthErr != errorCode.SUCCESS.code) {
            error = errorCode.FAILED;
        }
        callback(error);
    });
};

module.exports = DeviceAuth;