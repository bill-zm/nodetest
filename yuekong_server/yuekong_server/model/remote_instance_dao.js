/**
 * Created by strawmanbobi
 * 2015-03-09
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

var RemoteInstance = dbOrm.define('remote_instance',
    {
        id: Number,
        rsn: String,
        name: String,
        device_pdsn: String,
        remote_pdsn: String,
        device_ip: String,
        is_bound: Number,
        mobile_id: String,
        user_open_id: String,
        user_name: String,
        mac_address: String,
        identifier: String,
        status: Number,
        update_time: String,
        remote_instance_type: Number,
        remote_instance_status: Number,
        version: String
    },
    {
        cache: false
    }
);

RemoteInstance.createRemoteInstance = function(remoteInstance, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var newRemoteInstance = new RemoteInstance({
        name: remoteInstance.name,
        rsn: remoteInstance.rsn,
        device_pdsn: remoteInstance.device_pdsn,
        remote_pdsn: remoteInstance.remote_pdsn,
        device_ip: remoteInstance.device_ip,
        is_bound: remoteInstance.is_bound,
        mobile_id: remoteInstance.mobile_id,
        user_open_id: remoteInstance.user_open_id,
        user_name: remoteInstance.user_name,
        mac_address: remoteInstance.mac_address,
        identifier: remoteInstance.identifier,
        status: enums.ITEM_VALID,
        update_time: date,
        remote_instance_type: remoteInstance.remote_instance_type,
        remote_instance_status: enums.REMOTE_INSTANCE_STATUS_B,
        version: remoteInstance.version
    });

    newRemoteInstance.save(function(error, createdRemoteInstance) {
        if(error) {
            logger.error('failed to create remote : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create remote');
            callback(errorCode.SUCCESS, createdRemoteInstance);
        }
    });
};

RemoteInstance.findRemoteInstancesByCondition = function(conditions, callback) {
    RemoteInstance.find(conditions)
        .run(function (error, remoteInstances) {
            if (error) {
                logger.error("find remotes instances error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find remote instances successfully, length of remote instances = " +
                    remoteInstances.length);
                callback(errorCode.SUCCESS, remoteInstances);
            }
        });
};

RemoteInstance.listRemoteInstances = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.lt(from);
        RemoteInstance.find(conditions).limit(parseInt(count)).orderRaw("?? DESC", [sortField])
            .run(function (error, remoteInstances) {
                if (error) {
                    logger.error("list remote instances error : " + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list remote instances successfully");
                    callback(errorCode.SUCCESS, remoteInstances);
                }
            });
    } else {
        RemoteInstances.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? DESC", [sortField])
        .run(function (error, remoteInstances) {
            if (error) {
                logger.error("list remote instances error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("list remote instances successfully");
                callback(errorCode.SUCCESS, remoteInstances);
            }
        });
    }
};

RemoteInstance.getRemoteInstanceByID = function(remoteInstanceID, callback) {
    RemoteInstance.get(remoteInstanceID, function(error, remoteInstance) {
        if (error) {
            logger.error("get remote instance by ID error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get remote instance by ID successfully");
            callback(errorCode.SUCCESS, remoteInstance);
        }
    });
};

RemoteInstance.updateRemoteInstanceByID = function(remoteInstanceID, newRemoteInstance, callback) {
    RemoteInstance.get(remoteInstanceID, function(error, remoteInstance) {
        if (error || null == remoteInstance) {
            logger.error("update remote instance by ID error in get remote instance : " + error);
            callback(errorCode.FAILED, null);
        } else {
            for(var p in remoteInstance) {
                if(null != newRemoteInstance[p]) {
                    remoteInstance[p] = newRemoteInstance[p];
                }
            }
            remoteInstance.save(function(error, updatedRemoteInstance) {
                if(error) {
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info('succeeded to update remote instance');
                    callback(errorCode.SUCCESS, updatedRemoteInstance);
                }
            });
        }
    });
};

RemoteInstance.deleteRemoteInstanceByID = function(remoteInstanceID, callback) {
    RemoteInstance.get(remoteInstanceID, function(error, remoteInstance) {
        if (error || null == remoteInstance) {
            logger.error("delete remote instance by ID error in get remote instance : " + error);
            callback(errorCode.FAILED);
        } else {
            remoteInstance.status = enums.ITEM_INVALID;
            remoteInstance.save(function(error) {
                if(error) {
                    logger.error('failed to delete remote instance : ' + error);
                    callback(errorCode.FAILED);
                } else {
                    logger.info('succeeded to delete remote instance');
                    callback(errorCode.SUCCESS);
                }
            });
        }
    });
};

// this function could be dangerous
RemoteInstance.deleteRemoteInstancesByConditions = function(conditions, callback) {
    RemoteInstance.find(conditions).remove(function (err) {
        if(err) {
            callback(errorCode.FAILED);
        } else {
            callback(errorCode.SUCCESS);
        }
    });
};

// statistics functions
RemoteInstance.countRemoteInstances = function(conditions, callback) {
    RemoteInstance.count(conditions, function(error, remoteInstanceCount) {
        if(error) {
            logger.error("count remote instance error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("count remote instance successfully, remote count = " + remoteInstanceCount);
            callback(errorCode.SUCCESS, remoteInstanceCount);
        }
    });
};

RemoteInstance.statRemoteInstances = function(beginDate, endDate, callback) {
    var rawSQL = "SELECT update_time, COUNT(id) AS item_count FROM remote_instance WHERE update_time IS NOT NULL AND " +
        "update_time > '" + beginDate + "' AND update_time < '" + endDate + "' GROUP BY SUBSTRING(update_time, 1, 10);";
    dbOrm.driver.execQuery(rawSQL, function(error, results) {
        if (error) {
            logger.error("stat remote instances error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("stat remote instances successfully, size = " + results.length);
            callback(errorCode.SUCCESS, results);
        }
    });
};

module.exports = RemoteInstance;