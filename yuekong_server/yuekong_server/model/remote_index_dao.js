/**
 * Created by strawmanbobi
 * 2015-02-04
 */

// global inclusion
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
var dbOrm = require('../../../Infrastructure/BackEnd/db/mysql/mysql_connection').mysqlDB;
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

// local inclusion
var ErrorCode = require('../configuration/error_code');
var errorCode = new ErrorCode();

var RemoteIndex = dbOrm.define('remote_index',
    {
        id: Number,
        category_id: Number,
        category_name: String,
        brand_id: Number,
        brand_name: String,
        city_code: String,
        city_name: String,
        operator_id: String,
        operator_name: String,
        protocol: String,
        remote: String,
        remote_map: String,
        status: Number,
        radio_type: Number,
        ble_mode: Number,
        sub_cate: Number,
        priority: Number,
        applied_remote_version: String,
        applied_device_version: String,
        banned_remote_version: String,
        banned_device_version: String
    },
    {
        cache: false
    }
);

RemoteIndex.createRemoteIndex = function(remoteIndex, callback) {
    var newRemoteIndex = new RemoteIndex({
        name: remoteIndex.name,
        category_id: remoteIndex.category_id,
        category_name: remoteIndex.category_name,
        brand_id: remoteIndex.brand_id,
        brand_name: remoteIndex.brand_name,
        city_code: remoteIndex.city_code,
        city_name: remoteIndex.city_name,
        operator_id: remoteIndex.operator_id,
        operator_name: remoteIndex.operator_name,
        // TODO: To form remoteMap sequence according to category and brand selected
        protocol: remoteIndex.protocol,
        remote: remoteIndex.remote,
        remote_map: remoteIndex.remote_map,
        status: 1,
        radio_type: remoteIndex.radio_type,
        ble_mode: remoteIndex.ble_mode,
        sub_cate: remoteIndex.sub_cate,
        priority: remoteIndex.priority,
        applied_remote_version: remoteIndex.applied_remote_version,
        applied_device_version: remoteIndex.applied_device_version,
        banned_remote_version: remoteIndex.banned_remote_version,
        banned_device_version: remoteIndex.banned_device_version
    });
    newRemoteIndex.save(function(error, createdRemoteIndex) {
        if(error) {
            logger.error('failed to create remoteIndex : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create remoteIndex');
            callback(errorCode.SUCCESS, createdRemoteIndex);
        }
    });
};

RemoteIndex.findRemoteIndexByCondition = function(conditions, callback) {
    RemoteIndex.find(conditions)
    .run(function (error, remoteIndexes) {
        if (error) {
            logger.error("find remoteIndex error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("find remoteIndex successfully, length of remoteIndexes = " + remoteIndexes.length);
            callback(errorCode.SUCCESS, remoteIndexes);
        }
    });
};

RemoteIndex.listRemoteIndexes = function(conditions, from, count, sortField, callback) {
    // var order = (null == isTest || undefined == isTest) ? "?? DESC" : "?? ASC";
    if("id" == sortField && 0 != from) {
        conditions.id = orm.lt(from);
        RemoteIndex.find(conditions).limit(parseInt(count)).orderRaw("?? DESC", [sortField])
        .run(function (listRemoteIndexesErr, remoteIndexes) {
            if (listRemoteIndexesErr) {
                logger.error("list remoteIndexes error : " + listRemoteIndexesErr);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("list remoteIndexes successfully");
                callback(errorCode.SUCCESS, remoteIndexes);
            }
        });
    } else {
        RemoteIndex.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? ASC", [sortField])
        .run(function (listRemoteIndexesErr, remoteIndexes) {
            if (listRemoteIndexesErr) {
                logger.error("list remoteIndexes error : " + listRemoteIndexesErr);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("list remoteIndexes successfully");
                callback(errorCode.SUCCESS, remoteIndexes);
            }
        });
    }
};

RemoteIndex.getRemoteIndexByID = function(remoteIndexID, callback) {
    RemoteIndex.get(remoteIndexID, function(error, remoteIndex) {
        if (error) {
            logger.error("get remoteIndex by ID error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get remoteIndex by ID successfully");
            callback(errorCode.SUCCESS, remoteIndex);
        }
    });
};

module.exports = RemoteIndex;