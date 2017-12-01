/**
 * Created by strawmanbobi
 * 2016-01-21
 */

var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
require('../../../Infrastructure/BackEnd/configuration/constants');

var Switch = require('../model/switch_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');

var enums = new Enums();
var errorCode = new ErrorCode();

exports.getSwitchWorkUnit = function (UA, targetDevice, callback) {
    var conditions = {
        target_device: targetDevice
    };

    Switch.findSwitchesByConditions(conditions, function (findSwitchErr, switches) {
        if(errorCode.SUCCESS.code == findSwitchErr.code &&
            switches.length > 0) {
            var retSwitch = switches[0];

            if (-1 != UA.indexOf("device_yk") && UA < "device_yk_2.0.2") {
                retSwitch.uda_switch = 0;
            }

            if (UA.indexOf('YueKong/') > -1 && UA < 'YueKong/2.0.0') {
                retSwitch.oad_switch = 0;
            }

            callback(findSwitchErr, retSwitch);
        } else {
            callback(errorCode.FAILED, null);
        }
    });
};