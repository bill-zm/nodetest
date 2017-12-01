/**
 * Created by Strawmanbobi
 * 16-04-18
 */

// global inclusion
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
var dbOrm = require('../../../Infrastructure/BackEnd/db/mysql/mysql_connection').mysqlDB;
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;
var dateUtils = require('../../../Infrastructure/BackEnd/utils/date_utils.js');

// local inclusion
var ErrorCode = require('../configuration/error_code');
var errorCode = new ErrorCode();

var Enums = require('../configuration/enums');
var enums = new Enums();

var UpdateRecord = dbOrm.define('update_record',
    {
        id: Number,
        src_remote_version: String,
        dest_remote_version: String,
        remote_update_status: Number,
        src_device_version: String,
        dest_device_version: String,
        device_update_status: Number,
        updater_id: String,
        updater_type: Number,
        target_identifier: String,
        update_time: String
    },
    {
        cache: false
    }
);

UpdateRecord.createUpdateRecord = function(newUpdateRecord, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var updateRecord = new UpdateRecord({
        src_remote_version : newUpdateRecord.src_remote_version,
        dest_remote_version : newUpdateRecord.dest_remote_version,
        remote_update_status : newUpdateRecord.remote_update_status,
        src_device_version : newUpdateRecord.src_device_version,
        dest_device_version : newUpdateRecord.dest_device_version,
        device_update_status : newUpdateRecord.device_update_status,
        updater_id : newUpdateRecord.updater_id,
        updater_type : newUpdateRecord.updater_type,
        target_identifier : newUpdateRecord.target_identifier,
        update_time : date
    });
    updateRecord.save(function(error, savedUpdateRecord) {
        if (error) {
            logger.error("save updateRecord failed in create updateRecord : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("create updateRecord successfully");
            callback(errorCode.SUCCESS, savedUpdateRecord);
        }
    });
};

UpdateRecord.updateUpdateRecord = function(updateRecordID, updateUpdateRecord, callback) {
    UpdateRecord.get(updateRecordID, function(error, updateRecord) {
        if (error || null == updateRecord) {
            logger.error("failed to get update record in update update record : " + error);
            callback(errorCode.FAILED, null);
        } else {
            var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
            updateRecord.src_remote_version = updateUpdateRecord.src_remote_version;
            updateRecord.dest_remote_version = updateUpdateRecord.dest_remote_version;
            updateRecord.remote_update_status = updateUpdateRecord.remote_update_status;
            updateRecord.src_device_version = updateUpdateRecord.src_device_version;
            updateRecord.dest_device_version = updateUpdateRecord.dest_device_version;
            updateRecord.device_update_status = updateUpdateRecord.device_update_status;
            updateRecord.updater_id = updateUpdateRecord.updater_id;
            updateRecord.updater_type = updateUpdateRecord.updater_type;
            updateRecord.target_identifier = updateUpdateRecord.target_identifier;
            updateRecord.update_time = date;
            updateRecord.save(function(error, savedUpdateRecord) {
                if (error) {
                    logger.error("save updateRecord failed in update updateRecord : " + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("update updateRecord successfully");
                    callback(errorCode.SUCCESS, savedUpdateRecord);
                }
            });
        }
    });
};

UpdateRecord.listUpdateRecords = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.gt(from);
        UpdateRecord.find(conditions)
            .run(function (error, updateRecords) {
                if (error) {
                    logger.error("find updateRecords error : " + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("find updateRecords successfully, length of updateRecords = " + updateRecords.length);
                    callback(errorCode.SUCCESS, updateRecords);
                }
            });
    } else {
        UpdateRecord.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? ASC", [sortField])
            .run(function (error, updateRecords) {
                if (error) {
                    logger.error("find updateRecords error : " + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("find updateRecords successfully, length of updateRecords = " + updateRecords.length);
                    callback(errorCode.SUCCESS, updateRecords);
                }
            });
    }
};

UpdateRecord.findUpdateRecord = function(conditions, from, count, callback) {
    UpdateRecord.find(conditions).limit(parseInt(count)).offset(parseInt(from))
        .run(function (error, updateRecords) {
            if (error) {
                logger.error("find updateRecords error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find updateRecords successfully, length of updateRecords = " + updateRecords.length);
                callback(errorCode.SUCCESS, updateRecords);
            }
        });
};

module.exports = UpdateRecord;