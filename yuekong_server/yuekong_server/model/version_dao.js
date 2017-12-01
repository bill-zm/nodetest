/**
 * Created by strawmanbobi
 * 2015-07-17
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

var Version = dbOrm.define('version',
    {
        id: Number,
        version_type: Number,
        dev_wlan_ver: String,
        dev_ble_ver: String,
        rem_ble_ver: String,
        dev_wlan_hash: String,
        dev_ble_hash: String,
        rem_ble_hash: String,
        update_time: String,
        uploader: String,
        comment: String,
        purpose: Number,
        sub_type: Number,
        status: Number,
        remote_type: Number
    },
    {
        cache: false
    }
);

Version.createVersion = function(version, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var newVersion = new Version({
        version_type: version.version_type,
        dev_wlan_ver: version.dev_wlan_ver,
        dev_ble_ver: version.dev_ble_ver,
        rem_ble_ver: version.rem_ble_ver,
        dev_wlan_hash: version.dev_wlan_hash,
        dev_ble_hash: version.dev_ble_hash,
        rem_ble_hash: version.rem_ble_hash,
        update_time: date,
        uploader: version.uploader,
        comment: version.comment,
        purpose: version.purpose,
        sub_type: version.sub_type,
        status: enums.ITEM_VALID,
        remote_type: version.remote_type
    });
    newVersion.save(function(error, createdVersion) {
        if(error) {
            logger.error('failed to create version : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create version');
            callback(errorCode.SUCCESS, createdVersion);
        }
    });
};

Version.listVersions = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.gt(from);
        Version.find(conditions).limit(parseInt(count)).orderRaw("?? DESC", [sortField])
            .run(function (listVersionErr, versions) {
                if (listVersionErr) {
                    logger.error("list versions error : " + listVersionErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list versions successfully");
                    callback(errorCode.SUCCESS, versions);
                }
            });
    } else {
        Version.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? DESC", [sortField])
            .run(function (listVersionErr, versions) {
                if (listVersionErr) {
                    logger.error("list versions error : " + listVersionErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list versions successfully");
                    callback(errorCode.SUCCESS, versions);
                }
            });
    }
};

Version.getVersion = function(id, callback) {
    Version.get(id, function(error, version) {
        if (error || null == version) {
            logger.error("get version error");
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get version successfully");
            callback(errorCode.SUCCESS, version);
        }
    })
};

Version.deleteVersion = function(conditions, callback) {
    Version.find(conditions, function(error, versions) {
        if (error) {
            logger.error("failed to find version in delete version");
            callback(errorCode.FAILED);
        } else {
            var i = 0;
            for (i = 0; i < versions.length; i++) {
                var version = versions[i];
                version.status = enums.ITEM_INVALID;
                version.save(function(error, createdVersion) {
                    logger.info("soft delete version successfully : " + version.id);
                });
            }
            callback(errorCode.SUCCESS);
        }
    });
};

module.exports = Version;