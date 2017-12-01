/**
 * Created by strawmanbobi
 * 2015-05-10
 */

// global inclusion
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
var dbOrm = require('../../../Infrastructure/BackEnd/db/mysql/mysql_connection').mysqlDB;
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;
var dateUtils = require('../../../Infrastructure/BackEnd/utils/date_utils.js');

// local inclusion
var ErrorCode = require('../configuration/error_code');
var Enums = require('../configuration/enums');

var errorCode = new ErrorCode();
var enums = new Enums();

var DeviceInstance = dbOrm.define('device_instance',
    {
        id: Number,
        name: String,
        pdsn: String,
        status: Number,
        create_time: String,
        ip_address: String,
        version: String,
        com_version: String,
        mobile_id: String,
        user_open_id: String,
        user_name: String
    },
    {
        cache: false
    }
);

DeviceInstance.createDeviceInstance = function(deviceInstance, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var newDeviceInstance = new DeviceInstance({
        name: deviceInstance.name,
        pdsn: deviceInstance.pdsn,
        status: enums.ITEM_UPDATED,
        create_time: date,
        ip_address: deviceInstance.ip_address,
        version: deviceInstance.version,
        com_version: deviceInstance.com_version,
        mobile_id: deviceInstance.mobile_id,
        user_open_id: deviceInstance.user_open_id,
        user_name: deviceInstance.user_name
    });
    newDeviceInstance.save(function(error, createdDeviceInstance) {
        if(error) {
            logger.error('failed to create device instance : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create device instance');
            callback(errorCode.SUCCESS, createdDeviceInstance);
        }
    });
};

DeviceInstance.findDevicesInstancesByConditions = function(conditions, callback) {
    DeviceInstance.find(conditions)
        .run(function (error, deviceInstances) {
            if (error) {
                logger.error("find device instances error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find device instances successfully, length of device instances = "
                + deviceInstances.length);
                callback(errorCode.SUCCESS, deviceInstances);
            }
        });
};

DeviceInstance.listDeviceInstances = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.lt(from);
        DeviceInstance.find(conditions).limit(parseInt(count)).orderRaw("?? DESC", [sortField])
            .run(function (listDevicesInstanceErr, deviceInstances) {
                if (listDevicesInstanceErr) {
                    logger.error("list device instances error : " + listDevicesInstanceErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list device instances successfully");
                    callback(errorCode.SUCCESS, deviceInstances);
                }
            });
    } else {
        DeviceInstance.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? DESC", [sortField])
            .run(function (listDeviceInstancesErr, deviceInstances) {
                if (listDeviceInstancesErr) {
                    logger.error("list device instances error : " + listDeviceInstancesErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list device instances successfully");
                    callback(errorCode.SUCCESS, deviceInstances);
                }
            });
    }
};

DeviceInstance.countDeviceInstances = function(conditions, callback) {
    DeviceInstance.count(conditions, function(error, deviceInstanceCount) {
        if(error) {
            logger.error("count device instance error : " + error);
            callback(errorCode.FAILED, 0);
        } else {
            logger.info("count device instance successfully, device count = " + deviceInstanceCount);
            callback(errorCode.SUCCESS, deviceInstanceCount);
        }
    });
};

DeviceInstance.getDeviceInstanceByID = function(deviceInstanceID, callback) {
    DeviceInstance.get(deviceInstanceID, function(error, deviceInstance) {
        if (error) {
            logger.error("get device instance by ID error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get device instance by ID successfully");
            callback(errorCode.SUCCESS, deviceInstance);
        }
    });
};

DeviceInstance.updateDeviceInstanceByID = function(deviceInstanceID, newDeviceInstance, callback) {
    // printCallstack();
    logger.info("conditions = " + JSON.stringify(deviceInstanceID));
    logger.info("newDeviceInstance = " + JSON.stringify(newDeviceInstance));

    DeviceInstance.get(deviceInstanceID, function(error, deviceInstance) {
        if (error || null == deviceInstance) {
            logger.error("get device instance by ID error in update by ID : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get device instance by ID successfully in update by ID");
            if(newDeviceInstance.name) {
                deviceInstance.name = newDeviceInstance.name;
            }
            if(newDeviceInstance.ip_address) {
                deviceInstance.ip_address = newDeviceInstance.ip_address;
            }
            if(newDeviceInstance.version) {
                deviceInstance.version = newDeviceInstance.version;
            }
            if(newDeviceInstance.com_version) {
                deviceInstance.com_version = newDeviceInstance.com_version;
            }
            if(newDeviceInstance.status) {
                deviceInstance.status = newDeviceInstance.status;
            }
            if(newDeviceInstance.user_open_id) {
                deviceInstance.user_open_id = newDeviceInstance.user_open_id;
            }
            if(newDeviceInstance.user_name) {
                deviceInstance.user_name = newDeviceInstance.user_name;
            }
            deviceInstance.save(function (error) {
                if(error) {
                    logger.error("save device instance error in update by ID : " + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("save device successfully in update by ID");
                    callback(errorCode.SUCCESS, deviceInstance);
                }
            });
        }
    });
};

DeviceInstance.updateDeviceInstanceByConditions = function(conditions, newDeviceInstance, callback) {
    DeviceInstance.find(conditions)
        .run(function (error, deviceInstances) {
        if (error || null == deviceInstances || 0 == deviceInstances.length) {
            logger.error("find device instance by conditions error in update by conditions : " + error);
            callback(errorCode.FAILED, null);
        } else {
            //TODO : to use promise mode, otherwise it only support updating by PDSN spec.
            logger.info("find device by conditions successfully in update by conditions");
            var deviceInstance = deviceInstances[0];
            if(newDeviceInstance.name) {
                deviceInstance.name = newDeviceInstance.name;
            }
            if(newDeviceInstance.ip_address) {
                deviceInstance.ip_address = newDeviceInstance.ip_address;
            }
            if(newDeviceInstance.version) {
                deviceInstance.version = newDeviceInstance.version;
            }
            if(newDeviceInstance.com_version) {
                deviceInstance.com_version = newDeviceInstance.com_version;
            }
            if(newDeviceInstance.status) {
                deviceInstance.status = newDeviceInstance.status;
            }
            if(newDeviceInstance.user_open_id) {
                deviceInstance.user_open_id = newDeviceInstance.user_open_id;
            }
            if(newDeviceInstance.user_name) {
                deviceInstance.user_name = newDeviceInstance.user_name;
            }
            deviceInstance.save(function (error) {
                if(error) {
                    logger.error("save device instance error in update by conditions : " + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("save device instance successfully in update by conditions");
                    callback(errorCode.SUCCESS, deviceInstance);
                }
            });
        }
    });
};

DeviceInstance.deleteDeviceInstanceByID = function(deviceInstanceID, callback) {
    DeviceInstance.get(deviceInstanceID, function(error, deviceInstance) {
        if (error || null == deviceInstance) {
            logger.error("get device instance by ID error in delete by ID : " + error);
            callback(errorCode.SUCCESS, null);
        } else {
            logger.info("get device instance by ID successfully in delete by ID");
            deviceInstance.status = enums.ITEM_INVALID;
            deviceInstance.save(function (error) {
                if(error) {
                    logger.error("save device instance error in delete by ID : " + error);
                    callback(errorCode.FAILED);
                } else {
                    logger.info("save device successfully in delete by ID");
                    callback(errorCode.SUCCESS);
                }
            });
        }
    });
};

// statistics functions
DeviceInstance.statDeviceInstances = function(beginDate, endDate, callback) {
    var rawSQL = "SELECT create_time, COUNT(id) AS item_count FROM device_instance WHERE create_time IS NOT NULL AND " +
        "create_time > '" + beginDate + "' AND create_time < '" + endDate + "' GROUP BY SUBSTRING(create_time, 1, 10);";
    dbOrm.driver.execQuery(rawSQL, function(error, results) {
        if (error) {
            logger.error("stat device instances error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("stat device instances successfully, size = " + results.length);
            callback(errorCode.SUCCESS, results);
        }
    });
};

function printCallstack() {
    var stack = new Error().stack;
    console.log("PRINTING CALL STACK");
    console.log( stack );
}

module.exports = DeviceInstance;