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
var Enums = require('../configuration/enums');
var enums = new Enums();

var RemoteIndexII = dbOrm.define('remote_index_ii',
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
        banned_device_version: String,
        kk_remote_number: String,
        category_name_tw: String,
        brand_name_tw: String,
        city_name_tw: String,
        operator_name_tw: String,
        binary_md5: String,
        ble_remote_index: String,
        input_source: String,
        protector: String
    },
    {
        cache: false
    }
);

RemoteIndexII.createRemoteIndex = function(remoteIndexII, callback) {
    var newRemoteIndex = new RemoteIndexII({
        name: remoteIndexII.name,
        category_id: remoteIndexII.category_id,
        category_name: remoteIndexII.category_name,
        brand_id: remoteIndexII.brand_id,
        brand_name: remoteIndexII.brand_name,
        city_code: remoteIndexII.city_code,
        city_name: remoteIndexII.city_name,
        operator_id: remoteIndexII.operator_id,
        operator_name: remoteIndexII.operator_name,
        // TODO: To form remoteMap sequence according to category and brand selected
        protocol: remoteIndexII.protocol,
        remote: remoteIndexII.remote,
        remote_map: remoteIndexII.remote_map,
        status: enums.ITEM_VALID,
        radio_type: remoteIndexII.radio_type,
        ble_mode: remoteIndexII.ble_mode,
        sub_cate: remoteIndexII.sub_cate,
        priority: remoteIndexII.priority,
        applied_remote_version: remoteIndexII.applied_remote_version,
        applied_device_version: remoteIndexII.applied_device_version,
        banned_remote_version: remoteIndexII.banned_remote_version,
        banned_device_version: remoteIndexII.banned_device_version,
        kk_remote_number: remoteIndexII.kk_remote_number,
        category_name_tw: remoteIndexII.category_name_tw,
        brand_name_tw: remoteIndexII.brand_name_tw,
        city_name_tw: remoteIndexII.city_name_tw,
        operator_name_tw: remoteIndexII.operator_name_tw,
        binary_md5: remoteIndexII.binary_md5,
        ble_remote_index: remoteIndexII.ble_remote_index,
        input_source: remoteIndexII.input_source,
        protector: remoteIndexII.protector
    });
    newRemoteIndex.save(function(error, createdRemoteIndex) {
        if(error) {
            logger.error('failed to create remoteIndexII : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create remoteIndexII');
            callback(errorCode.SUCCESS, createdRemoteIndex);
        }
    });
};

RemoteIndexII.findRemoteIndexByCondition = function(conditions, callback) {
    RemoteIndexII.find(conditions)
    .run(function (error, remoteIndexes) {
        if (error) {
            logger.error("find remoteIndexII error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("find remoteIndexII successfully, length of remoteIndexes = " + remoteIndexes.length);
            callback(errorCode.SUCCESS, remoteIndexes);
        }
    });
};

RemoteIndexII.listRemoteIndexes = function(conditions, from, count, sortField, callback) {
    // var order = (null == isTest || undefined == isTest) ? "?? DESC" : "?? ASC";
    if("id" == sortField && 0 != from) {
        conditions.id = orm.lt(from);
        RemoteIndexII.find(conditions).limit(parseInt(count)).orderRaw("?? DESC", [sortField])
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
        RemoteIndexII.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? ASC", [sortField])
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

RemoteIndexII.getRemoteIndexByID = function(remoteIndexID, callback) {
    RemoteIndexII.get(remoteIndexID, function(error, remoteIndexII) {
        if (error) {
            logger.error("get remoteIndexII by ID error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get remoteIndexII by ID successfully");
            callback(errorCode.SUCCESS, remoteIndexII);
        }
    });
};

RemoteIndexII.countRemoteIndexesByConditions = function(conditions, callback) {
    RemoteIndexII.count(conditions, function(error, remoteIndexesCount) {
        if(error) {
            logger.error("count remote indexes error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("count remote indexes successfully, indexes count = " + remoteIndexesCount);
            callback(errorCode.SUCCESS, remoteIndexesCount);
        }
    });
};

RemoteIndexII.updateRemoteIndexByID = function(remoteIndexID, newRemoteIndex, callback) {
    RemoteIndexII.get(remoteIndexID, function(error, remoteIndex) {
        if (error || null == remoteIndex) {
            logger.error("get remote index by ID error in update remote index : " + error);
            callback(errorCode.FAILED, null);
        } else {
            // this is dangerous since id field would be changed accordingly
            if (undefined != newRemoteIndex.id && null != newRemoteIndex.id) {
                remoteIndex.id = newRemoteIndex.id;
            }
            remoteIndex.category_id = newRemoteIndex.category_id;
            remoteIndex.category_name = newRemoteIndex.category_name;
            remoteIndex.brand_id = newRemoteIndex.brand_id;
            remoteIndex.brand_name = newRemoteIndex.brand_name;
            remoteIndex.city_code = newRemoteIndex.city_code;
            remoteIndex.city_name = newRemoteIndex.city_name;
            remoteIndex.operator_id = newRemoteIndex.operator_id;
            remoteIndex.operator_name = newRemoteIndex.operator_name;
            remoteIndex.protocol = newRemoteIndex.protocol;
            remoteIndex.remote = newRemoteIndex.remote;
            remoteIndex.remote_map = newRemoteIndex.remote_map;
            remoteIndex.radio_type = newRemoteIndex.radio_type;
            remoteIndex.ble_mode = newRemoteIndex.ble_mode;

            remoteIndex.status = newRemoteIndex.status;

            remoteIndex.sub_cate = newRemoteIndex.sub_cate;
            remoteIndex.priority = newRemoteIndex.priority;
            remoteIndex.applied_remote_version = newRemoteIndex.applied_remote_version;
            remoteIndex.applied_device_version = newRemoteIndex.applied_device_version;
            remoteIndex.banned_remote_version = newRemoteIndex.banned_remote_version;
            remoteIndex.banned_device_version = newRemoteIndex.banned_device_version;
            remoteIndex.kk_remote_number = newRemoteIndex.kk_remote_number;

            remoteIndex.category_name_tw = newRemoteIndex.category_name_tw;
            remoteIndex.brand_name_tw = newRemoteIndex.brand_name_tw;
            remoteIndex.city_name_tw = newRemoteIndex.city_name_tw;
            remoteIndex.operator_name_tw = newRemoteIndex.operator_name_tw;

            // newRemoteIndex may not contain any md5 binary information
            remoteIndex.binary_md5 = newRemoteIndex.binary_md5;

            remoteIndex.ble_remote_index = newRemoteIndex.ble_remote_index;
            remoteIndex.input_source = newRemoteIndex.input_source;

            remoteIndex.protector = newRemoteIndex.protector;

            remoteIndex.save(function(error, updatedRemoteIndex) {
                if(error) {
                    logger.error('failed to create remote index in update remote index : ' + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info('succeeded to update remote index');
                    callback(errorCode.SUCCESS, updatedRemoteIndex);
                }
            });
        }
    });
};

RemoteIndexII.deleteRemoteIndexByConditions = function(conditions, callback) {
    RemoteIndexII.find(conditions, function(error, remoteIndexes) {
        if (error) {
            logger.error("get remote index by ID error in delete remote index : " + error);
            callback(errorCode.FAILED, null);
        } else {
            if (null != remoteIndexes && remoteIndexes.length > 0) {
                var remoteIndex = remoteIndexes[0];
                remoteIndex.status = enums.ITEM_INVALID;
                remoteIndex.save(function(error, deletedRemoteIndex) {
                    if(error) {
                        logger.error('failed to create remote index in delete remote index : ' + error);
                        callback(errorCode.FAILED, null);
                    } else {
                        logger.info('succeeded to delete remote index');
                        callback(errorCode.SUCCESS, deletedRemoteIndex);
                    }
                });
            } else {
                logger.info("this remote index does not exist");
                callback(errorCode.SUCCESS, null);
            }
        }
    });
};

module.exports = RemoteIndexII;