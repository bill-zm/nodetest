/**
 * Created by strawmanbobi
 * 2016-04-01
 */

// global inclusion
require('../../../Infrastructure/BackEnd/configuration/constants');

var VirtualBleRemoteIndex = require('../model/virtual_ble_remote_index_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var enums = new Enums();
var errorCode = new ErrorCode();

exports.createBleRemoteIndexWorkUnit = function(newBleRemoteIndex, callback) {
    var conditions = {
        remote_index_id: newBleRemoteIndex.remote_index_id,
        status: enums.ITEM_VALID
    };
    VirtualBleRemoteIndex.prototype.findBleRemoteIndexesByCondition(conditions,
        function(findBleRemoteIndexErr, bleRemoteIndexes) {
            if (errorCode.SUCCESS.code == findBleRemoteIndexErr.code &&
                null != bleRemoteIndexes && bleRemoteIndexes.length > 0) {
                logger.info("successfully found ble_remote_indexes, update it");
                var bleRemoteIndex = bleRemoteIndexes[0];
                VirtualBleRemoteIndex.prototype.updateBleRemoteIndexByID(bleRemoteIndex._id, newBleRemoteIndex,
                    function(updateBleRemoteIndexErr, updatedBleRemoteIndex) {
                        callback(updateBleRemoteIndexErr, updatedBleRemoteIndex);
                    });
            } else {
                logger.info("failed to find ble_remote_indexes, create it");
                VirtualBleRemoteIndex.prototype.createBleRemoteIndex(newBleRemoteIndex,
                    function(createBleRemoteIndexErr, createdBleRemoteIndex) {
                        callback(createBleRemoteIndexErr, createdBleRemoteIndex);
                    });
            }
        });
};

exports.getBleRemoteIndexWorkUnit = function(remoteIndexID, callback) {
    var conditions = {
        remote_index_id: remoteIndexID,
        status: enums.ITEM_VALID
    };
    VirtualBleRemoteIndex.prototype.findBleRemoteIndexesByCondition(conditions,
        function(getBleRemoteIndexErr, bleRemoteIndexes) {
            if (errorCode.SUCCESS.code == getBleRemoteIndexErr.code &&
                null != bleRemoteIndexes && bleRemoteIndexes.length > 0) {
                callback(errorCode.SUCCESS, bleRemoteIndexes[0]);
            } else {
                callback(errorCode.FAILED, null);
            }
        });
};

// this is a virtual API since BLE remote index item could only be created inside of model layer
exports.publishBleRemoteIndexesWorkUnit = function (bleRemoteIndex, callback) {
    VirtualBleRemoteIndex.prototype.createBleRemoteIndex(bleRemoteIndex,
        function(createBleRemoteIndexErr, createdBleRemoteIndex) {
        callback(createBleRemoteIndexErr, createdBleRemoteIndex);
    });
};
