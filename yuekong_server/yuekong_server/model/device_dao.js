/**
 * Created by strawmanbobi
 * 2015-01-23
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

var Device = dbOrm.define('device',
    {
        id: Number,
        name: String,
        pdsn: String,
        status: Number,
        create_time: String,
        ip_address: String,
        version: String,
        com_version: String,
        ssid: String,
        password: String
    },
    {
        cache: false
    }
);

Device.createDevice = function(device, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var newDevice = new Device({
        name: device.name,
        pdsn: device.pdsn,
        status: enums.ITEM_VALID,
        create_time: date,
        ip_address: device.ip_address,
        version: device.version,
        com_version: device.com_version,
        ssid: device.ssid,
        password: device.password
    });
    newDevice.save(function(error, createdDevice) {
        if(error) {
            logger.error('failed to create device : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create device');
            callback(errorCode.SUCCESS, createdDevice);
        }
    });
};

Device.findDevicesByConditions = function(conditions, callback) {
    Device.find(conditions)
        .run(function (error, devices) {
            if (error) {
                logger.error("find device error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find device successfully, length of devices = " + devices.length);
                callback(errorCode.SUCCESS, devices);
            }
        });
};

Device.listDevices = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.lt(from);
        Device.find(conditions).limit(parseInt(count)).orderRaw("?? DESC", [sortField])
            .run(function (listDevicesErr, devices) {
                if (listDevicesErr) {
                    logger.error("list devices error : " + listDevicesErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list devices successfully");
                    callback(errorCode.SUCCESS, devices);
                }
            });
    } else {
        Device.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? DESC", [sortField])
            .run(function (listDevicesErr, devices) {
                if (listDevicesErr) {
                    logger.error("list devices error : " + listDevicesErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list devices successfully");
                    callback(errorCode.SUCCESS, devices);
                }
            });
    }
};

Device.getDeviceByID = function(deviceID, callback) {
    Device.get(deviceID, function(error, device) {
        if (error) {
            logger.error("get device by ID error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get device by ID successfully");
            callback(errorCode.SUCCESS, device);
        }
    });
};

Device.updateDeviceByID = function(deviceID, newDevice, callback) {
    Device.get(deviceID, function(error, device) {
        if (error || null == device) {
            logger.error("get device by ID error in update by ID : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get device by ID successfully in update by ID");
            if(newDevice.name) {
                device.name = newDevice.name;
            }
            if(newDevice.ip_address) {
                device.ip_address = newDevice.ip_address;
            }
            if(newDevice.version) {
                device.version = newDevice.version;
            }
            if(newDevice.com_version) {
                device.com_version = newDevice.com_version;
            }
            if(newDevice.status) {
                device.status = newDevice.status;
            }
            if(newDevice.ssid) {
                device.ssid = newDevice.ssid;
            }
            if(newDevice.password) {
                device.password = newDevice.password;
            }
            device.save(function (error) {
                if(error) {
                    logger.error("save device error in update by ID : " + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("save device successfully in update by ID");
                    callback(errorCode.SUCCESS, device);
                }
            });
        }
    });
};

Device.updateDeviceByConditions = function(conditions, newDevice, callback) {
    Device.find(conditions)
        .run(function (error, devices) {
        if (error || null == devices || 0 == devices.length) {
            logger.error("find device by conditions error in update by conditions : " + error);
            callback(errorCode.FAILED, null);
        } else {
            //TODO : to use promise mode, otherwise it only support updating by PDSN spec.
            if(newDevice.ip_address) {
                devices[0].ip_address = newDevice.ip_address;
            }
            if(newDevice.version) {
                devices[0].version = newDevice.version;
            }
            if(newDevice.com_version) {
                devices[0].com_version = newDevice.com_version;
            }
            if(newDevice.status) {
                devices[0].status = newDevice.status;
            }
            if(newDevice.ssid) {
                devices[0].ssid = newDevice.ssid;
            }
            if(newDevice.password) {
                devices[0].password = newDevice.password;
            }
            devices[0].save(function (error) {
                if(error) {
                    logger.error("save device error in update by conditions : " + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("save device successfully in update by conditions");
                    callback(errorCode.SUCCESS, devices[0]);
                }
            });
        }
    });
};

module.exports = Device;