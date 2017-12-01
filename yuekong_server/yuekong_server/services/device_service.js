/**
 * Created by strawmanbobi
 * 2015-01-23.
 */

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var IntegerResponse = require('../response/integer_response.js');
var DeviceResponse = require('../response/device_response.js');
var SingleDeviceResponse = require('../response/single_device_response.js');
var DeviceInstanceResponse = require('../response/device_instance_response.js');
var SingleDeviceInstanceResponse = require('../response/single_device_instance_response.js');
var VersionResponse = require('../response/version_response.js');

var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var deviceLogic = require('../work_unit/device_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Create device
 * parameter :  HTTP body of device
 * return :     SingleDeviceResponse
 */
exports.registerDevice = function (req, res) {
    var opFlag = req.query.op_flag;
    var password = req.query.password;
    var mobileID = req.query.mobile_id;
    var newDevice = req.body;

    var singleDeviceResponse = new SingleDeviceResponse();
    if ('00000000000000000000000000000000' == mobileID) {
        logger.info("mobile ID is empty, skip register");
        singleDeviceResponse.status = errorCode.SUCCESS;
        singleDeviceResponse.entity = null;
        res.send(singleDeviceResponse);
        res.end();
    } else {
        logger.info("mobile ID is valid, continue to register device");
        deviceLogic.createDeviceWorkUnit(password, mobileID, newDevice, opFlag,
                function (createDeviceErr, createdDevice) {
            singleDeviceResponse.status = createDeviceErr;
            singleDeviceResponse.entity = createdDevice;
            res.send(singleDeviceResponse);
            res.end();
        });
    }
};

/*
 * function :   List Devices
 * parameter :  from
 *              count
 * return :     DeviceResponse
 */
exports.listDevices = function (req, res) {
    var from = req.query.from;
    var count = req.query.count;

    var deviceResponse = new DeviceResponse();
    deviceLogic.listDevicesWorkUnit(from, count, function (listDevicesErr, devices) {
        deviceResponse.status = listDevicesErr;
        deviceResponse.entity = devices;
        res.send(deviceResponse);
        res.end();
    });
};

/*
 * function :   Get device by ID
 * parameter :  device_id
 * return :     DeviceResponse
 */
exports.getDeviceByID = function (req, res) {
    var deviceID = req.query.device_id;

    var singleDeviceResponse = new SingleDeviceResponse();
    deviceLogic.getDeviceByIDWorkUnit(deviceID, function (getDeviceByIDErr, device) {
        singleDeviceResponse.status = getDeviceByIDErr;
        singleDeviceResponse.entity = device;
        res.send(singleDeviceResponse);
        res.end();
    });
};

/*
 * function :   Get device by PDSN
 * parameter :  PDSN of family equipment
 * return :     DeviceResponse
 */
exports.getDeviceByPDSN = function (req, res) {
    var pdsn = req.query.pdsn;

    if(pdsn) {
        pdsn = pdsn.toUpperCase();
    }
    var singleDeviceResponse = new SingleDeviceResponse();
    deviceLogic.getDeviceByPDSNWorkUnit(pdsn, function (getDeviceByPDSNErr, device) {
        singleDeviceResponse.status = getDeviceByPDSNErr;
        singleDeviceResponse.entity = device;
        res.send(singleDeviceResponse);
        res.end();
    });
};

/*
 * function :   update device by ID
 * parameter :  ID of device
 *              PDSN of device
 *              auth token
 *              new device object
 * return :     DeviceResponse
 */
exports.updateDeviceByID = function (req, res) {
    var deviceID = req.query.id;
    var pdsn = req.query.pdsn;
    var token = req.query.token;
    var newDevice = req.body;

    if(pdsn) {
        pdsn = pdsn.toUpperCase();
    }
    var singleDeviceResponse = new DeviceResponse();
    deviceLogic.updateDeviceByIDWorkUnit(deviceID, pdsn, token, newDevice, function (updateDeviceByPDSNErr, devices) {
        singleDeviceResponse.status = updateDeviceByPDSNErr;
        singleDeviceResponse.entity = devices;
        res.send(singleDeviceResponse);
        res.end();
    });
};

/*
 * function :   Update Device by PDSN
 * parameter :  PDSN of device
 *              auth token
 *              new device object
 * return :     DeviceResponse
 */
exports.updateDeviceByPDSN = function (req, res) {
    var pdsn = req.query.pdsn;
    var token = req.query.token;
    var newDevice = req.body;

    if(pdsn) {
        pdsn = pdsn.toUpperCase();
    }
    var deviceResponse = new DeviceResponse();
    deviceLogic.updateDeviceByPDSNWorkUnit(pdsn, token, newDevice,
        function (updateDeviceByPDSNErr, updatedDevice) {
            deviceResponse.status = updateDeviceByPDSNErr;
            deviceResponse.entity = updatedDevice;
            res.send(deviceResponse);
            res.end();
        });
};

/*
 * function :   Create Device Instance
 * parameter :  PDSN of device
 *              auth token
 *              new device instance object
 * return :     DeviceInstanceResponse
 */
exports.createDeviceInstance = function (req, res) {
    var newDeviceInstance = req.body;

    var singleDeviceInstanceResponse = new SingleDeviceInstanceResponse();
    deviceLogic.createDeviceInstanceWorkUnit(newDeviceInstance,
        function (createDeviceInstanceErr, createdDeviceInstance) {
            singleDeviceInstanceResponse.status = createDeviceInstanceErr;
            singleDeviceInstanceResponse.entity = createdDeviceInstance;
            res.send(singleDeviceInstanceResponse);
            res.end();
        });
};

/*
 * function :   Update Device Instance
 * parameter :  PDSN of device
 *              auth token
 *              new device instance object
 * return :     DeviceInstanceResponse
 */
exports.updateDeviceInstance = function (req, res) {
    var pdsn = req.query.pdsn;
    var token = req.query.token;
    var mobileID = req.query.mobile_id;
    var newDeviceInstance = req.body;

    var singleDeviceInstanceResponse = new SingleDeviceInstanceResponse();
    deviceLogic.updateDeviceInstanceWorkUnit(pdsn, mobileID, token, newDeviceInstance,
        function (updateDeviceInstanceErr, updatedDeviceInstance) {
            singleDeviceInstanceResponse.status = updateDeviceInstanceErr;
            singleDeviceInstanceResponse.entity = updatedDeviceInstance;
            res.send(singleDeviceInstanceResponse);
            res.end();
        });
};

/*
 * function :   Delete Device Instance
 * parameter :  id of device
 * return :     ServiceResponse
 */
exports.deleteDeviceInstance = function (req, res) {
    var id = req.query.id;

    var serviceResponse = new ServiceResponse();
    deviceLogic.deleteDeviceInstanceWorkUnit(id,
        function (deleteDeviceInstanceErr) {
            serviceResponse.status = deleteDeviceInstanceErr;
            res.send(serviceResponse);
            res.end();
        });
};

/*
 * function :   List Device Instances
 * parameter :  from
 *              count
 * return :     DeviceInstanceResponse
 */
exports.listDeviceInstances = function (req, res) {
    var mobileID = req.query.mobile_id;
    var from = req.query.from;
    var count = req.query.count;

    var UA = req.headers['user-agent'];

    var deviceInstanceResponse = new DeviceInstanceResponse();
    deviceLogic.listDeviceInstancesWorkUnit(UA, mobileID, from, count,
            function (listDeviceInstancesErr, deviceInstances) {
        deviceInstanceResponse.status = listDeviceInstancesErr;
        deviceInstanceResponse.entity = deviceInstances;
        res.send(deviceInstanceResponse);
        res.end();
    });
};

/*
 * function :   Get Device Instances
 * parameter :  mobile ID
 *              Device PDSN
 * return :     Integer Response
 */
exports.getDeviceInstance = function (req, res) {
    var mobileID = req.query.mobile_id;
    var pdsn = req.query.pdsn;

    var UA = req.headers['user-agent'];

    var deviceInstanceResponse = new DeviceInstanceResponse();
    deviceLogic.getDeviceInstanceWorkUnit(UA, mobileID, pdsn, function (getDeviceInstanceErr, deviceInstance) {
        deviceInstanceResponse.status = getDeviceInstanceErr;
        deviceInstanceResponse.entity = deviceInstance;
        res.send(deviceInstanceResponse);
        res.end();
    });
};

/*
 * function :   Count Device Instances
 * parameter :  mobile ID
 * return :     Integer Response
 */
exports.countDeviceInstances = function (req, res) {
    var mobileID = req.query.mobile_id;

    var integerResponse = new IntegerResponse();
    deviceLogic.countDeviceInstancesWorkUnit(mobileID, function (countDeviceInstancesErr, deviceInstanceCount) {
        integerResponse.status = countDeviceInstancesErr;
        integerResponse.entity = deviceInstanceCount;
        res.send(integerResponse);
        res.end();
    });
};