/**
 * Created by Strawmanbobi
 * 16-03-31
 */

// global inclusion
var kvConn = require('../../../Infrastructure/BackEnd/db/mongodb/mongodb_connection');
var orm = require('../../../Infrastructure/BackEnd/node_modules/mongoose');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;
var dateUtils = require('../../../Infrastructure/BackEnd/utils/date_utils');

// local inclusion
var ErrorCode = require('../configuration/error_code');
var errorCode = new ErrorCode();

var Enums = require('../configuration/enums');
var enums = new Enums();

// schema definition
var BleCommand = new orm.Schema({
    service_uuid: String,
    char_uuid: String,
    command: String
});

var BleCommands = new orm.Schema({
    segment_count: Number,
    // this indicates there would be multiple segments (for command pieces) in a single command of a specific key
    commands: [BleCommand],
    key_map: Number
});

var VirtualBleRemoteIndex = kvConn.define('virtual_ble_remote_index', {
    remote_index_id: String,
    remote_map: String,
    mac_or_name : Number,
    name: String,
    // this indicates there would be multiple commands (for different keys) in a single remote index
    commands: [BleCommands],
    status: Number
});

VirtualBleRemoteIndex.prototype.createBleRemoteIndex = function(bleRemoteIndex, callback) {
    var newBleRemoteIndex = new VirtualBleRemoteIndex({
        remote_index_id: bleRemoteIndex.remote_index_id,
        remote_map: bleRemoteIndex.remote_map,
        mac_or_name : bleRemoteIndex.mac_or_name,
        name : bleRemoteIndex.name,
        commands : bleRemoteIndex.commands,
        status: enums.ITEM_VALID
    });
    newBleRemoteIndex.save(function(error, createdBleRemoteIndex, numberAffected) {
        if(error) {
            logger.error("failed to create ble_remote_index : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("succeeded to create ble_remote_index");
            callback(errorCode.SUCCESS, createdBleRemoteIndex);
        }
    });
};

VirtualBleRemoteIndex.prototype.findBleRemoteIndexesByCondition = function(conditions, callback) {
    VirtualBleRemoteIndex.find(conditions, function(error, bleRemoteIndexes) {
        if (error) {
            logger.error("failed to find ble_remote_index : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.error("find ble_remote_index successfully");
            callback(errorCode.SUCCESS, bleRemoteIndexes);
        }
    });
};

VirtualBleRemoteIndex.prototype.updateBleRemoteIndexByID = function(id, newBleRemoteIndex, callback) {
    VirtualBleRemoteIndex.findByIdAndUpdate(id, newBleRemoteIndex, function(error, updatedRemoteIndex) {
        if (error) {
            logger.error("failed to update ble_remote_index : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.error("update ble_remote_index successfully");
            callback(errorCode.SUCCESS, updatedRemoteIndex);
        }
    });
};

module.exports = VirtualBleRemoteIndex;