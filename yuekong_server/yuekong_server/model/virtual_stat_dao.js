/**
 * Created by Strawmanbobi
 * 15-12-28
 */

// global inclusion
var kvConn = require('../../../Infrastructure/BackEnd/db/mongodb/mongodb_connection');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;
var dateUtils = require('../../../Infrastructure/BackEnd/utils/date_utils');

// local inclusion
var ErrorCode = require('../configuration/error_code');
var errorCode = new ErrorCode();

var Enums = require('../configuration/enums');
var enums = new Enums();

// schema definition
var VirtualStat = kvConn.define('virtual_stat', {
    stat_type : Number,
    remote_pdsn : String,
    uda : [String],
    uop : [String],
    update_time: String,
    mobile_id: String,
    user_id: String,
    longitude: Number,
    latitude: Number,
    status: Number
});

VirtualStat.prototype.createStat = function(stat, callback) {
    var date = dateUtils.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
    var newVirtualStat = new VirtualStat({
        stat_type : stat.stat_type,
        remote_pdsn : stat.remote_pdsn,
        uda : stat.uda,
        uop : stat.uop,
        update_time : date,
        mobile_id : stat.mobile_id,
        user_id : stat.user_id,
        longitude : stat.longitude,
        latitude : stat.latitude,
        status : enums.ITEM_VALID
    });
    newVirtualStat.save(function(error, createdStat, numberAffected) {
        if(error) {
            logger.error("failed to create virtual stat : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("succeeded to create virtual stat");
            callback(errorCode.SUCCESS, createdStat);
        }
    });
};

module.exports = VirtualStat;