/**
 * Created by strawmanbobi
 * 2015-02-27
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

var Remote = dbOrm.define('remote',
    {
        id: Number,
        device_pdsn: String,
        remote_pdsn: String,
        rsn: String,
        name: String,
        category_id: Number,
        category_name: String,
        brand_id: Number,
        brand_name: String,
        city_code: String,
        operator_id: String,
        remote_index_id: Number,
        remote_index_name: String,
        create_type: Number,
        status: Number,
        remote_code: String,
        remote_instance_id: Number,
        mac_address: String,
        remote_number: Number,
        identifier: String,
        update_time: String,
        binary_version: String,
        radio_type: Number,
        ble_tag104: Number,
        ble_target_mac: String,
        ble_target_name: String,
        sub_cate: Number,
        room_id: Number,
        room_name: String,
        sirius_id: String,
        protocol: String,
        remote: String,
        remote_map: String
    },
    {
        cache: false
    }
);

Remote.createRemote = function(remote, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var newRemote = new Remote({
        device_pdsn: remote.device_pdsn,
        remote_pdsn: remote.remote_pdsn,
        rsn: remote.rsn,
        name: remote.name,
        category_id: remote.category_id,
        category_name: remote.category_name,
        brand_id: remote.brand_id,
        brand_name: remote.brand_name,
        city_code: remote.city_code,
        operator_id: remote.operator_id,
        remote_index_id: remote.remote_index_id,
        remote_index_name: remote.remote_index_name,
        create_type: remote.create_type,
        status: enums.ITEM_VALID,
        remote_code: remote.remote_code,
        remote_instance_id: remote.remote_instance_id,
        mac_address: remote.mac_address,
        remote_number: remote.remote_number,
        identifier: remote.identifier,
        update_time: date,
        binary_version: remote.binary_version,
        radio_type: remote.radio_type,
        ble_tag104 : remote.ble_tag104,
        ble_target_mac : remote.ble_target_mac,
        ble_target_name : remote.ble_target_name,
        sub_cate : remote.sub_cate,
        room_id : remote.room_id,
        room_name : remote.room_name,
        sirius_id : remote.sirius_id,
        protocol: remote.protocol,
        remote: remote.remote,
        remote_map: remote.remote_map
    });

    // compatibility consideration
    if(null == newRemote.binary_version || undefined == newRemote.binary_version) {
        newRemote.binary_version = '1';
    }

    newRemote.save(function(error, createdRemote) {
        if(error) {
            logger.error('failed to create remote : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create remote');
            callback(errorCode.SUCCESS, createdRemote);
        }
    });
};

Remote.findRemotesByConditions = function(conditions, callback) {
    Remote.find(conditions).run(function (error, remotes) {
        if (error) {
            logger.error("find remotes error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("find remotes successfully, length of remotes = " + remotes.length);
            callback(errorCode.SUCCESS, remotes);
        }
    });
};

Remote.countRemotesByConditions = function(conditions, callback) {
    Remote.count(conditions, function(error, count) {
        if (error) {
            logger.error("count remotes error : " + error);
            callback(errorCode.FAILED, 0);
        } else {
            logger.info("count remotes successfully, count of remotes = " + count);
            callback(errorCode.SUCCESS, count);
        }
    });
};

Remote.listRemotesByInstance = function(remoteInstanceID, from, count, sortField, callback) {
    var rawSQL = "SELECT * FROM remote WHERE remote_instance_id = '" + remoteInstanceID + "' AND remote.status = 1 " +
        "ORDER BY remote_number LIMIT " + count + ";";
    dbOrm.driver.execQuery(rawSQL, function(error, remotes) {
        if (error) {
            logger.error("list remotes error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("list remotes successfully, size = " + remotes.length);
            callback(errorCode.SUCCESS, remotes);
        }
    });
};

Remote.listRemotes = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.gt(from);
        Remote.find(conditions).limit(parseInt(count)).orderRaw("?? ASC", [sortField])
            .run(function (error, remotes) {
                if (error) {
                    logger.error("list remotes error : " + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list remotes successfully, remotes found = " + remotes.length);
                    callback(errorCode.SUCCESS, remotes);
                }
            });
    } else {
        Remote.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? ASC", [sortField])
            .run(function (error, remotes) {
                if (error) {
                    logger.error("list remotes error : " + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list remotes successfully, size = " + remotes.length);
                    callback(errorCode.SUCCESS, remotes);
                }
            });
    }
};

Remote.listRemotesRaw = function(whereClause, orderByClause, limitClause, callback) {
    var rawSQL = "SELECT * FROM remote WHERE " + whereClause + " ORDER BY " + orderByClause + " LIMIT " + limitClause + ";";
    logger.info("raw SQL in list remotes raw = " + rawSQL);
    dbOrm.driver.execQuery(rawSQL, function(error, results) {
        if (error) {
            logger.error("list remotes raw error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("list remotes successfully, size = " + results.length);
            callback(errorCode.SUCCESS, results);
        }
    });
};

Remote.getRemoteByID = function(remoteID, callback) {
    Remote.get(remoteID, function(error, remote) {
        if (error) {
            logger.error("get remote by ID error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get remote by ID successfully");
            callback(errorCode.SUCCESS, remote);
        }
    });
};

Remote.updateRemoteByID = function(remoteID, newRemote, callback) {
    Remote.get(remoteID, function(error, remote) {
        if (error || null == remote) {
            logger.error("update remote by ID error in get remote : " + error);
            callback(errorCode.FAILED, null);
        } else {
            for(var p in remote) {
                if(null != newRemote[p] && "binary_version" != p) {
                    remote[p] = newRemote[p];
                }
            }
            remote.save(function(error, updatedRemote) {
                if(error) {
                    logger.error('failed to update remote : ' + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info('succeeded to update remote');
                    callback(errorCode.SUCCESS, updatedRemote);
                }
            });
        }
    });
};

Remote.deleteRemoteByID = function(remoteID, callback) {
    Remote.get(remoteID, function(error, remote) {
        if (error || null == remote) {
            logger.error("delete remote by ID error in get remote : " + error);
            callback(errorCode.FAILED, null);
        } else {
            remote.status = enums.ITEM_INVALID;
            remote.save(function(error, updatedRemote) {
                if(error) {
                    logger.error('failed to delete remote : ' + error);
                    callback(errorCode.FAILED);
                } else {
                    logger.info('succeeded to delete remote');
                    callback(errorCode.SUCCESS);
                }
            });
        }
    });
};

Remote.deleteRemoteByCondition = function(conditions, callback) {
    Remote.find(conditions).remove(function (err) {
        if(err) {
            callback(errorCode.FAILED);
        } else {
            callback(errorCode.SUCCESS);
        }
    });
};

Remote.getRemoteIndexInfo = function(remoteID, callback) {
    dbOrm.driver.execQuery("SELECT applied_device_version, banned_device_version FROM remote, remote_index_ii WHERE " +
        "remote.remote_index_id = remote_index_ii.id AND remote.id = " + remoteID,
        function (err, remoteIndexInfos) {
            if (err) {
                logger.error("failed to get remote index info = " + err);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("successfully got remote index info : " + JSON.stringify(remoteIndexInfos));
                callback(errorCode.SUCCESS, remoteIndexInfos);
            }
        });
};

// statistics functions
Remote.countRemotes = function(conditions, callback) {
    Remote.count(conditions, function(error, remoteCount) {
        if(error) {
            logger.error("count remotes error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("count remotes successfully, remote count = " + remoteCount);
            callback(errorCode.SUCCESS, remoteCount);
        }
    });
};

Remote.statRemotes = function(beginDate, endDate, callback) {
    var rawSQL = "SELECT update_time, COUNT(id) AS item_count FROM remote WHERE update_time IS NOT NULL AND " +
        "update_time > '" + beginDate + "' AND update_time < '" + endDate + "' GROUP BY SUBSTRING(update_time, 1, 10);";
    dbOrm.driver.execQuery(rawSQL, function(error, results) {
        if (error) {
            logger.error("stat remotes error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("stat remotes successfully, size = " + results.length);
            callback(errorCode.SUCCESS, results);
        }
    });
};

module.exports = Remote;