/**
 * Created by strawmanbobi
 * 2016-04-18
 */

var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
require('../../../Infrastructure/BackEnd/configuration/constants');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var UpdateRecord = require('../model/update_record_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');

var enums = new Enums();
var errorCode = new ErrorCode();

exports.createUpdateRecordWorkUnit = function(updateUpdateRecord, callback) {
    UpdateRecord.createUpdateRecord(updateUpdateRecord,
        function(createUpdateRecordErr, createdUpdateRecord) {
            callback(createUpdateRecordErr, createdUpdateRecord);
        });
};

exports.listUpdateRecordsWorkUnit = function (month, updaterID, from, count, callback) {
    var conditions = {
        update_time: orm.like(month + "%")
    };

    if (null != updaterID) {
        conditions.updater_id = updaterID;
    }

    UpdateRecord.listUpdateRecords(conditions, from, count, "id", function(findUpdateRecordErr, updateRecords) {
        callback(findUpdateRecordErr, updateRecords);
    });
};

exports.updateUpdateRecordWorkUnit = function (newUpdateRecord, callback) {
    var conditions = {
        target_identifier : newUpdateRecord.target_identifier,
        updater_id: newUpdateRecord.updater_id
    };

    UpdateRecord.findUpdateRecord(conditions, 0, 1, function(findUpdateRecordErr, updateRecords) {
        if (errorCode.SUCCESS.code == findUpdateRecordErr.code && null != updateRecords && updateRecords.length > 0) {
            logger.info("find update records successfully in update update records, update it");
            var updateUpdateRecord = updateRecords[0];
            UpdateRecord.updateUpdateRecord(updateUpdateRecord.id, newUpdateRecord,
                function(updateUpdateRecordErr, updatedUpdateRecord) {
                    callback(updateUpdateRecordErr, updatedUpdateRecord);
                });
        } else {
            logger.info("find update records failed in update update records, create it");
            UpdateRecord.createUpdateRecord(newUpdateRecord, function(createUpdateRecordErr, createdUpdateRecord) {
                callback(createUpdateRecordErr, createdUpdateRecord);
            });
        }
    });
};