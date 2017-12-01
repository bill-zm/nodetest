/**
 * Created by strawmanbobi
 * 2016-01-21
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

var Switch = dbOrm.define('switch',
    {
        id: Number,
        uda_switch: Number,
        oad_switch: Number,
        target_device: Number
    },
    {
        cache: false
    }
);

Switch.updateSwitch = function(updateSwitch, callback) {
    Switch.find().run(function (findSwitchErr, switches) {
        if (findSwitchErr) {
            logger.error("find switch error in update switch : " + findSwitchErr);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("find switch successfully in update switch, continue update it");
            if (switches.length > 0) {
                var currentSwitch = switches[0];
                for (var p in updateSwitch) {
                    if (null != p) {
                        currentSwitch[p] = updateSwitch[p];
                    }
                }
                currentSwitch.save(function(saveSwitchErr, savedSwitch) {
                    if (saveSwitchErr) {
                        logger.error("save switch failed in update switch : " + saveSwitchErr);
                        callback(errorCode.FAILED, null);
                    } else {
                        logger.info("save switch successfully");
                        callback(errorCode.SUCCESS, savedSwitch);
                    }
                });
            } else {
                var newSwitch = new Switch({
                    uda_switch : updateSwitch.uda_switch,
                    oad_switch : updateSwitch.oad_switch
                });
                newSwitch.save(function(saveSwitchErr, savedSwitch) {
                    if (saveSwitchErr) {
                        logger.error("save switch failed in update switch : " + saveSwitchErr);
                        callback(errorCode.FAILED, null);
                    } else {
                        logger.info("save switch successfully");
                        callback(errorCode.SUCCESS, savedSwitch);
                    }
                });
            }
        }
    });
};

Switch.findSwitchesByConditions = function(conditions, callback) {
    Switch.find(conditions)
        .run(function (error, switches) {
            if (error) {
                logger.error("find switches error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find switches successfully, length of switches = " + switches.length);
                callback(errorCode.SUCCESS, switches);
            }
        });
};

module.exports = Switch;