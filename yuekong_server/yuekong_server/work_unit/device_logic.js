/**
 * Created by strawmanbobi
 * 2015-01-23
 */

require('../../../Infrastructure/BackEnd/configuration/constants');
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');

var Device = require('../model/device_dao.js');
var DeviceInstance = require('../model/device_instance_dao.js');
var DeviceAuth = require('../authority/device_auth.js');
var MD5 = require('../../../Infrastructure/BackEnd/security/md5.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var async = require('async');

var enums = new Enums();
var errorCode = new ErrorCode();
var deviceAuth = new DeviceAuth(MEMCACHED_HOST, MEMCACHED_PORT, MEMCACHED_SASL_USER, MEMCACHED_SASL_PASSWORD);

exports.createDeviceWorkUnit = function (password, mobileID, newDevice, opFlag, callback) {
    var conditions = {
        pdsn: newDevice.pdsn
    };
    var innerConditions;

    var pdsn,
        token,
        key,
        ttl = 24 * 60 * 60 * 14,
        timeStamp;

    Device.findDevicesByConditions(conditions, function (getDeviceByPDSNErr, devices) {
        if (errorCode.SUCCESS.code == getDeviceByPDSNErr.code &&
            devices &&
            devices.length > 0) {
            // update device immediately after device registration is called
            logger.info("device has been found by PDSN, no need to register again, but change it");
            if (devices.length > 1) {
                logger.warn("more than 1 device has been found by PDSN (in register) please check");
            }
            var device = devices[0];

            Device.updateDeviceByID(device.id, newDevice, function (updateDeviceErr, updatedDevice) {
                if (errorCode.SUCCESS.code == updateDeviceErr.code) {
                    device = updatedDevice;
                    timeStamp = new Date().getTime();
                    pdsn = device.pdsn.toString();
                    token = MD5.MD5(pdsn + timeStamp);
                    key = "device_" + pdsn;
                    deviceAuth.setAuthInfo(key, token, ttl, function (setDeviceAuthErr) {
                        device.token = token;
                        callback(setDeviceAuthErr, device);
                    });
                    if (undefined != mobileID && null != mobileID) {
                        // despite the result of device cache register, change device instance accordingly
                        var updateDeviceInstance = {
                            ip_address: newDevice.ip_address,
                            version: newDevice.version,
                            com_version: newDevice.com_version
                        };
                        conditions = {
                            pdsn: newDevice.pdsn
                        };
                        // should not update multiple device instances as single item
                        DeviceInstance.findDevicesInstancesByConditions(conditions,
                            function (findDeviceInstanceErr, deviceInstances) {
                                if (errorCode.SUCCESS.code == findDeviceInstanceErr.code && null != deviceInstances) {
                                    async.eachSeries(deviceInstances, function (deviceInstance, innerCallback) {
                                        var id = deviceInstance.id;
                                        if (enums.ITEM_INVALID != deviceInstance.status) {
                                            DeviceInstance.updateDeviceInstanceByID(id, updateDeviceInstance,
                                                function (updateDeviceInstanceErr) {
                                                    if (errorCode.FAILED.code == updateDeviceInstanceErr.code) {
                                                        logger.error("update device instance failed");
                                                    }
                                                    innerCallback();
                                                });
                                        } else {
                                            innerCallback();
                                        }
                                    }, function (err) {
                                        // continue procedures
                                        innerConditions = {
                                            pdsn: newDevice.pdsn,
                                            mobile_id: mobileID
                                        };
                                        DeviceInstance.findDevicesInstancesByConditions(innerConditions,
                                            function (findDeviceInstanceErr, deviceInstances) {
                                                if (errorCode.SUCCESS.code == findDeviceInstanceErr.code &&
                                                    null != deviceInstances &&
                                                    deviceInstances.length > 0) {
                                                    logger.info("device instance already found with pdsn : " +
                                                        newDevice.pdsn + ", mobile_id : " + mobileID);
                                                    var updateDeviceInstanceSingle = {
                                                        status: enums.ITEM_UPDATED
                                                    };
                                                    DeviceInstance.updateDeviceInstanceByConditions(innerConditions,
                                                        updateDeviceInstanceSingle,
                                                        function (updateDeviceInstanceErr, updatedDeviceInstances) {
                                                            if (errorCode.SUCCESS.code == updateDeviceInstanceErr.code) {
                                                                logger.info("update single device instance successfully");
                                                            }
                                                        });
                                                } else {
                                                    logger.info("device instance not found, create a new one with status updated");
                                                    var newDeviceInstanceSingle = {
                                                        pdsn: newDevice.pdsn,
                                                        name: newDevice.name,
                                                        status: enums.ITEM_UPDATED,
                                                        ip_address: newDevice.ip_address,
                                                        version: newDevice.version,
                                                        com_version: newDevice.com_version,
                                                        mobile_id: mobileID
                                                    };
                                                    DeviceInstance.createDeviceInstance(newDeviceInstanceSingle,
                                                        function (createDeviceInstanceErr, createdDeviceInstance) {
                                                            logger.info("create single device instance successfully");
                                                        });
                                                }
                                            });
                                    });
                                } else {
                                    // continue procedures
                                    innerConditions = {
                                        pdsn: newDevice.pdsn,
                                        mobile_id: mobileID
                                    };
                                    DeviceInstance.findDevicesInstancesByConditions(innerConditions,
                                        function (findDeviceInstanceErr, deviceInstances) {
                                            if (errorCode.SUCCESS.code == findDeviceInstanceErr.code &&
                                                null != deviceInstances &&
                                                deviceInstances.length > 0) {
                                                logger.info("device instance already found with pdsn : " +
                                                    newDevice.pdsn + ", mobile_id : " + mobileID);
                                                var updateDeviceInstanceSingle = {
                                                    status: enums.ITEM_UPDATED
                                                };
                                                DeviceInstance.updateDeviceInstanceByConditions(innerConditions,
                                                    updateDeviceInstanceSingle,
                                                    function (updateDeviceInstanceErr, updatedDeviceInstances) {
                                                        if (errorCode.SUCCESS.code == updateDeviceInstanceErr.code) {
                                                            logger.info("update single device instance successfully");
                                                        }
                                                    });
                                            } else {
                                                logger.info("device instance not found, create a new one with status updated");
                                                var newDeviceInstanceSingle = {
                                                    pdsn: newDevice.pdsn,
                                                    name: newDevice.name,
                                                    status: enums.ITEM_UPDATED,
                                                    ip_address: newDevice.ip_address,
                                                    version: newDevice.version,
                                                    com_version: newDevice.com_version,
                                                    mobile_id: mobileID
                                                };
                                                DeviceInstance.createDeviceInstance(newDeviceInstanceSingle,
                                                    function (createDeviceInstanceErr, createdDeviceInstance) {
                                                        logger.info("create single device instance successfully");
                                                    });
                                            }
                                        });
                                }
                            });
                    }
                } else {
                    callback(updateDeviceErr, null);
                }
            });
        } else {
            logger.info("this device is completely a new one, create it in db");
            Device.createDevice(newDevice, function (createDeviceErr, createdDevice) {
                if (errorCode.SUCCESS.code == createDeviceErr.code) {
                    var device = createdDevice;
                    timeStamp = new Date().getTime();
                    pdsn = device.pdsn.toString();
                    token = MD5.MD5(pdsn + timeStamp);
                    key = "device_" + pdsn;
                    deviceAuth.setAuthInfo(key, token, ttl, function (setDeviceAuthErr) {
                        device.token = token;
                        callback(setDeviceAuthErr, device);
                    });

                    if (null != mobileID && undefined != mobileID) {
                        // despite the result of device cache register, change device instance accordingly
                        var updateDeviceInstance = {
                            ip_address: newDevice.ip_address,
                            version: newDevice.version,
                            com_version: newDevice.com_version
                        };
                        conditions = {
                            pdsn: newDevice.pdsn
                        };
                        // should not update multiple device instances as single item
                        DeviceInstance.findDevicesInstancesByConditions(conditions,
                            function (findDeviceInstanceErr, deviceInstances) {
                                if (errorCode.SUCCESS.code == findDeviceInstanceErr.code && null != deviceInstances) {
                                    async.eachSeries(deviceInstances, function (deviceInstance, innerCallback) {
                                        var id = deviceInstance.id;
                                        if (enums.ITEM_INVALID != deviceInstance.status) {
                                            DeviceInstance.updateDeviceInstanceByID(id, updateDeviceInstance,
                                                function (updateDeviceInstanceErr) {
                                                    if (errorCode.FAILED.code == updateDeviceInstanceErr.code) {
                                                        logger.error("update device instance failed");
                                                    }
                                                    innerCallback();
                                                });
                                        } else {
                                            innerCallback();
                                        }
                                    }, function (err) {
                                        // continue procedures
                                        innerConditions = {
                                            pdsn: newDevice.pdsn,
                                            mobile_id: mobileID
                                        };
                                        DeviceInstance.findDevicesInstancesByConditions(innerConditions,
                                            function (findDeviceInstanceErr, deviceInstances) {
                                                if (errorCode.SUCCESS.code == findDeviceInstanceErr.code &&
                                                    null != deviceInstances &&
                                                    deviceInstances.length > 0) {
                                                    logger.info("device instance already found with pdsn : " +
                                                        newDevice.pdsn + ", mobile_id : " + mobileID);
                                                    var updateDeviceInstanceSingle = {
                                                        status: enums.ITEM_UPDATED
                                                    };
                                                    DeviceInstance.updateDeviceInstanceByConditions(innerConditions,
                                                        updateDeviceInstanceSingle,
                                                        function (updateDeviceInstanceErr, updatedDeviceInstances) {
                                                            if (errorCode.SUCCESS.code == updateDeviceInstanceErr.code) {
                                                                logger.info("update single device instance successfully");
                                                            }
                                                        });
                                                } else {
                                                    logger.info("device instance not found, create a new one with status updated");
                                                    var newDeviceInstanceSingle = {
                                                        pdsn: newDevice.pdsn,
                                                        name: newDevice.name,
                                                        status: enums.ITEM_UPDATED,
                                                        ip_address: newDevice.ip_address,
                                                        version: newDevice.version,
                                                        com_version: newDevice.com_version,
                                                        mobile_id: mobileID
                                                    };
                                                    DeviceInstance.createDeviceInstance(newDeviceInstanceSingle,
                                                        function (createDeviceInstanceErr, createdDeviceInstance) {
                                                            logger.info("create single device instance successfully");
                                                        });
                                                }
                                            });
                                    });
                                } else {
                                    // continue procedures
                                    innerConditions = {
                                        pdsn: newDevice.pdsn,
                                        mobile_id: mobileID
                                    };
                                    DeviceInstance.findDevicesInstancesByConditions(innerConditions,
                                        function (findDeviceInstanceErr, deviceInstances) {
                                            if (errorCode.SUCCESS.code == findDeviceInstanceErr.code &&
                                                null != deviceInstances &&
                                                deviceInstances.length > 0) {
                                                logger.info("device instance already found with pdsn : " +
                                                    newDevice.pdsn + ", mobile_id : " + mobileID);
                                                var updateDeviceInstanceSingle = {
                                                    status: enums.ITEM_UPDATED
                                                };
                                                DeviceInstance.updateDeviceInstanceByConditions(innerConditions,
                                                    updateDeviceInstanceSingle,
                                                    function (updateDeviceInstanceErr, updatedDeviceInstances) {
                                                        if (errorCode.SUCCESS.code == updateDeviceInstanceErr.code) {
                                                            logger.info("update single device instance successfully");
                                                        }
                                                    });
                                            } else {
                                                logger.info("device instance not found, create a new one with status updated");
                                                var newDeviceInstanceSingle = {
                                                    pdsn: newDevice.pdsn,
                                                    name: newDevice.name,
                                                    status: enums.ITEM_UPDATED,
                                                    ip_address: newDevice.ip_address,
                                                    version: newDevice.version,
                                                    com_version: newDevice.com_version,
                                                    mobile_id: mobileID
                                                };
                                                DeviceInstance.createDeviceInstance(newDeviceInstanceSingle,
                                                    function (createDeviceInstanceErr, createdDeviceInstance) {
                                                        logger.info("create single device instance successfully");
                                                    });
                                            }
                                        });
                                }
                            });
                    }
                } else {
                    callback(createDeviceErr, null);
                }
            });
        }
    });
};

exports.listDevicesWorkUnit = function (from, count, callback) {
    var conditions = {
        status: enums.ITEM_VALID
    };
    Device.listDevices(conditions, from, count, "id", function (listDeviceErr, devices) {
        callback(listDeviceErr, devices);
    });
};

exports.getDeviceByIDWorkUnit = function (deviceID, callback) {
    Device.getDeviceByID(deviceID, function (getDeviceByIDErr, device) {
        if (errorCode.SUCCESS.code == getDeviceByIDErr.code &&
            device &&
            enums.ITEM_VALID == device.status) {
            callback(getDeviceByIDErr, device);
        } else {
            callback(errorCode.DEVICE_NOT_FOUND, null);
        }
    });
};

exports.getDeviceByPDSNWorkUnit = function (pdsn, callback) {
    var conditions = {
        pdsn: pdsn,
        status: enums.ITEM_VALID
    };
    Device.findDevicesByConditions(conditions, function (getDeviceByPDSNErr, devices) {
        if (errorCode.SUCCESS.code == getDeviceByPDSNErr.code &&
            null != devices &&
            devices.length > 0) {
            if (devices.length > 1) {
                logger.warn("more than 1 device has been found by PDSN, please check");
            }
            callback(getDeviceByPDSNErr, devices[0]);
        } else {
            callback(errorCode.DEVICE_NOT_FOUND, null);
        }
    });
};

exports.updateDeviceByIDWorkUnit = function (deviceID, pdsn, token, newDevice, callback) {
    // deprecated
    var key = "device_" + pdsn;
    /*
     deviceAuth.validateAuthInfo(key, token, function(validateDeviceAuthErr) {
     if(errorCode.SUCCESS.code == validateDeviceAuthErr.code) {
     */
    Device.updateDeviceByID(deviceID, newDevice, function (updateDeviceByIDErr, device) {
        // TODO: update device IP address in remote instance accordingly, async
        var conditions = {
            pdsn: device.pdsn
        };

        DeviceInstance.findDevicesInstancesByConditions(conditions,
            function (findDeviceInstancesErr, deviceInstances) {
                if (errorCode.SUCCESS.code == findDeviceInstancesErr.code && deviceInstances) {
                    for (var i = 0; i < deviceInstances.length; i++) {
                        var deviceInstance = deviceInstances[i];
                        deviceInstance.ip_address = newDevice.ip_address;
                        deviceInstance.version = newDevice.version;
                        deviceInstance.status = newDevice.status;
                        deviceInstance.name = newDevice.name;

                        DeviceInstance.updateDeviceInstanceByConditions(conditions, deviceInstance,
                            function (updateDeviceInstanceErr, updatedDeviceInstance) {
                                if (updateDeviceInstanceErr.code == errorCode.SUCCESS.code) {
                                    logger.info("update device instance successfully");
                                } else {
                                    logger.info("update device instance failed");
                                }
                            });
                    }
                } else {
                    logger.error("find device instances error");
                    callback(errorCode.FAILED, null);
                }
            });
    });
    /*
     } else {
     callback(validateDeviceAuthErr, null);
     }
     });
     */
};

// this API is always called by UCON Center
exports.updateDeviceByPDSNWorkUnit = function (pdsn, token, newDevice, callback) {
    var key = "device_" + pdsn;
    /*
     // deprecated
     deviceAuth.validateAuthInfo(key, token, function(validateDeviceAuthErr) {
     if(errorCode.SUCCESS.code == validateDeviceAuthErr.code) {
     */
    var conditions = {
        pdsn: pdsn
    };
    Device.updateDeviceByConditions(conditions, newDevice, function (updateDeviceByConditionsErr, device) {
        // TODO: update device IP address in device instance table accordingly
        var innerConditions = null;

        if (null != device && undefined != device) {
            logger.info("update device successfully");
            innerConditions = {
                pdsn: device.pdsn
            };
            DeviceInstance.findDevicesInstancesByConditions(innerConditions,
                function (findDeviceInstancesErr, deviceInstances) {
                    if (errorCode.SUCCESS.code == findDeviceInstancesErr.code && deviceInstances) {
                        for (var i = 0; i < deviceInstances.length; i++) {
                            var deviceInstance = deviceInstances[i];
                            if (enums.ITEM_INVALID != deviceInstance.status) {
                                deviceInstance.ip_address = newDevice.ip_address;
                                deviceInstance.version = newDevice.version;
                                deviceInstance.com_version = newDevice.com_version;
                                DeviceInstance.updateDeviceInstanceByID(deviceInstance.id, deviceInstance,
                                    function (updateDeviceInstanceErr, updatedDeviceInstance) {
                                        if (updateDeviceInstanceErr.code == errorCode.SUCCESS.code) {
                                            logger.info("update device instance successfully");
                                        } else {
                                            logger.info("update device instance failed");
                                        }
                                    });
                            }
                        }
                    } else {
                        logger.error("find device instances error");
                    }
                });
        } else {
            logger.info("device not found");
        }

        // set posix time for device to implement UTC
        var currentDate = new Date();
        if (null != device && undefined != device) {
            device.posix_time = Math.floor(currentDate.getTime() / 1000) + "";
        }
        callback(updateDeviceByConditionsErr, device);
    });
};

exports.createDeviceInstanceWorkUnit = function (newDeviceInstance, callback) {
    var conditions = null;

    if (undefined != newDeviceInstance.user_id && null != newDeviceInstance.user_id) {
        conditions = {
            pdsn: newDeviceInstance.pdsn,
            user_id: newDeviceInstance.user_id
        };
    } else {
        conditions = {
            pdsn: newDeviceInstance.pdsn,
            mobile_id: newDeviceInstance.mobile_id
        };
    }

    DeviceInstance.findDevicesInstancesByConditions(conditions,
        function (getDeviceInstanceByPDSNErr, deviceInstances) {
            if (errorCode.SUCCESS.code == getDeviceInstanceByPDSNErr.code &&
                deviceInstances &&
                deviceInstances.length > 0) {
                logger.info("device instance has been found by PDSN, no need to register again");
                if (deviceInstances.length > 1) {
                    logger.warn("more than 1 device instances has been found by PDSN (in register) please check");
                }
                var deviceInstance = deviceInstances[0];
                newDeviceInstance.status = enums.ITEM_UPDATED;
                DeviceInstance.updateDeviceInstanceByID(deviceInstance.id, newDeviceInstance,
                    function (updateDeviceInstanceErr, updatedDeviceInstance) {
                        callback(updateDeviceInstanceErr, updatedDeviceInstance);
                    });
            } else {
                logger.info("a new device instance, goto create");
                newDeviceInstance.status = enums.ITEM_UPDATED;
                DeviceInstance.createDeviceInstance(newDeviceInstance,
                    function (createDeviceInstanceErr, createdDeviceInstance) {
                        if (errorCode.SUCCESS.code == createDeviceInstanceErr.code) {
                            callback(createDeviceInstanceErr, createdDeviceInstance);
                        } else {
                            callback(createDeviceInstanceErr, null);
                        }
                    });
            }
        });
};

exports.updateDeviceInstanceWorkUnit = function (pdsn, mobileID, token, newDeviceInstance, callback) {
    /*
     // deprecated
     deviceAuth.validateAuthInfo(key, token, function(validateDeviceAuthErr) {
     if(errorCode.SUCCESS.code == validateDeviceAuthErr.code) {
     */
    var conditions;

    if (undefined != mobileID && null != mobileID) {
        conditions = {
            mobile_id: mobileID,
            pdsn: pdsn
        };
    } else {
        conditions = {
            pdsn: pdsn
        };
    }

    logger.info("update device instance by condition : " + JSON.stringify(conditions));

    DeviceInstance.updateDeviceInstanceByConditions(conditions, newDeviceInstance,
        function (updateDeviceInstanceErr, updatedDeviceInstance) {
            callback(updateDeviceInstanceErr, updatedDeviceInstance);
        });

    /*
     } else {
     callback(validateDeviceAuthErr, null);
     }
     });
     */
};

exports.deleteDeviceInstanceWorkUnit = function (id, callback) {
    DeviceInstance.deleteDeviceInstanceByID(id,
        function (deleteDeviceInstanceErr) {
            callback(deleteDeviceInstanceErr);
        });
};

exports.listDeviceInstancesWorkUnit = function (UA, mobileID, from, count, callback) {
    var conditions = {
        status: orm.gt(enums.ITEM_INVALID),
        mobile_id: mobileID
    };
    var i = 0;
    var retDeviceInstances = [];
    DeviceInstance.listDeviceInstances(conditions, from, count, "id",
        function (listDeviceInstanceErr, deviceInstances) {
            if (undefined != deviceInstances && null != deviceInstances) {
                for (i = 0; i < deviceInstances.length; i++) {
                    var di = deviceInstances[i];
                    var retDeviceInstance = new Object();
                    for (var p in di) {
                        if (UA.indexOf('YueKong/') > -1 &&
                            UA < 'YueKong/1.8.5' &&
                            (p == 'user_open_id' || p == 'user_name')) {
                            // do nothing
                        } else {
                            retDeviceInstance[p] = di[p];
                        }
                    }
                    retDeviceInstances.push(retDeviceInstance);
                }
            }
            callback(listDeviceInstanceErr, retDeviceInstances);

            if (undefined != deviceInstances && null != deviceInstances) {
                for (i = 0; i < deviceInstances.length; i++) {
                    var deviceInstance = deviceInstances[i];
                    if (deviceInstance.status != enums.ITEM_INVALID) {
                        deviceInstance.status = enums.ITEM_VALID;
                        DeviceInstance.updateDeviceInstanceByID(deviceInstance.id, deviceInstance,
                            function (updateDeviceInstanceErr, updatedDeviceInstance) {
                                logger.info("device instance " + deviceInstance.id + " updated");
                            });
                    }
                }
            }
        });
};

exports.getDeviceInstanceWorkUnit = function (UA, mobileID, pdsn, callback) {
    logger.info("trying to get device instance by PDSN : " + pdsn + " via mobile : " + mobileID);
    var conditions = {
        mobile_id: mobileID,
        status: enums.ITEM_UPDATED,
        pdsn: pdsn
    };
    DeviceInstance.findDevicesInstancesByConditions(conditions, function (findDeviceInstancesErr, deviceInstances) {
        if (errorCode.SUCCESS.code == findDeviceInstancesErr.code &&
            deviceInstances && deviceInstances.length > 0) {
            logger.info("device instance found with pdsn : " + pdsn);
            var deviceInstance = deviceInstances[0];
            if (deviceInstance.status != enums.ITEM_INVALID) {
                deviceInstance.status = enums.ITEM_VALID;
                logger.info("updated device instance, reset status to item valid");
            }
            DeviceInstance.updateDeviceInstanceByID(deviceInstance.id, deviceInstance,
                function (updateDeviceInstanceErr, updatedDeviceInstance) {
                    // handle user related fields for iOS client
                    var retDeviceInstance = new Object();
                    for (var p in updatedDeviceInstance) {
                        if (UA.indexOf('YueKong/') > -1 &&
                            UA < 'YueKong/1.8.5' &&
                            (p == 'user_open_id' || p == 'user_name')) {
                           // do nothing
                        } else {
                            retDeviceInstance[p] = updatedDeviceInstance[p];
                        }
                    }
                    callback(errorCode.SUCCESS, retDeviceInstance);
                });
        } else {
            logger.error("device instance not found with pdsn : " + pdsn);
            callback(errorCode.FAILED, null);
        }
    });
};

exports.countDeviceInstancesWorkUnit = function (mobileID, callback) {
    var conditions = {
        status: orm.gt(enums.ITEM_INVALID),
        version: orm.gt('V1.0.0'),
        mobile_id: mobileID
    };

    DeviceInstance.countDeviceInstances(conditions, function (countDeviceInstanceErr, deviceInstanceCount) {
        callback(countDeviceInstanceErr, deviceInstanceCount);
    });
};