/**
 * Created by strawmanbobi
 * 2016-04-18.
 */

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var UpdateRecordResponse = require('../response/update_record_response.js');
var SingleUpdateRecordResponse = require('../response/single_update_record_response.js');

var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var updateRecordLogic = require('../work_unit/update_record_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Create update records
 * parameter :  UpdateRecord
 * return :     SingleUpdateRecordResponse
 */
exports.createUpdateRecord = function (req, res) {
    var updateUpdateRecord = req.body;

    var singleUpdateRecordResponse = new SingleUpdateRecordResponse();
    updateRecordLogic.createUpdateRecordWorkUnit(updateUpdateRecord,
        function (updateUpdateRecordErr, updatedUpdateRecords) {
            singleUpdateRecordResponse.status = updateUpdateRecordErr;
            singleUpdateRecordResponse.entity = updatedUpdateRecords;
            res.send(singleUpdateRecordResponse);
            res.end();
        });
};

/*
 * function :   Create update records
 * parameter :  UpdateRecord
 * return :     SingleUpdateRecordResponse
 */
exports.updateUpdateRecord = function (req, res) {
    var updateUpdateRecord = req.body;

    var singleUpdateRecordResponse = new SingleUpdateRecordResponse();
    updateRecordLogic.updateUpdateRecordWorkUnit(updateUpdateRecord,
        function (updateUpdateRecordErr, updatedUpdateRecords) {
            singleUpdateRecordResponse.status = updateUpdateRecordErr;
            singleUpdateRecordResponse.entity = updatedUpdateRecords;
            res.send(singleUpdateRecordResponse);
            res.end();
        });
};

/*
 * function :   List update records
 * parameter :  N/A
 * return :     UpdateRecordResponse
 */
exports.listUpdateRecord = function (req, res) {
    var updaterID = req.query.updater_id;
    var from = req.query.from;
    var count = req.query.count;

    var UA = req.headers['user-agent'];

    var updateRecordResponse = new UpdateRecordResponse();
    updateRecordLogic.listUpdateRecordWorkUnit(updaterID, from, count, function (listUpdateRecordsErr, updateRecords) {
        updateRecordResponse.status = listUpdateRecordsErr;
        updateRecordResponse.entity = updateRecords;
        res.send(updateRecordResponse);
        res.end();
    });
};