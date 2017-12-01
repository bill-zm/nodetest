/**
 * Created by strawmanbobi
 * 2015-07-17
 */
// system inclusion
fs = require('fs');
var crypto = require('crypto');

require('../../../Infrastructure/BackEnd/configuration/constants');
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');

var Version = require('../model/version_dao.js');

var OSS = require('../../../Infrastructure/BackEnd/data_set/ali_oss.js');
var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var enums = new Enums();
var errorCode = new ErrorCode();

var async = require('async');

var PUBLISHED_RELEASE_BUCKET_NAME = "yuekong-release-published";

exports.getLatestVersionWorkUnit = function (type, subType, remoteType, UA, comeFrom, callback) {
    var conditions;
    var undownloadedFile;
    var ossFilePath = "UCON/";
    var FILE_TEMP_PATH = __dirname + "/../web/update";
    var downloadOssFilePath = "";
    var localFilePath = "";
    var undownloadedFileArray = [];
    var getVersionSuccess = 1;

    if (null != UA) {
        if (UA.indexOf("device_yk") >= 0) {
            comeFrom = enums.COME_FROM_DEVICE;
        } else if (UA.indexOf("Android") >= 0) {
            comeFrom = enums.COME_FROM_APP_ANDROID;
        } else if (UA.indexOf('YueKong/') > -1) {
            comeFrom = enums.COME_FROM_APP_IOS;
        } else if (UA.indexOf("update_board") >= 0) {
            comeFrom = enums.COME_FROM_UPDATE_BOARD;
        } else {
            // do not change come from value
            comeFrom = enums.COME_FROM_PC_SUITE;
        }
    }

    // default value
    if (undefined == comeFrom || null == comeFrom) {
        comeFrom = enums.COME_FROM_DEVICE;
    }

    if (undefined == subType || null == subType) {
        subType = enums.VERSION_ST_REM;
    }

    if (enums.VERSION_TYPE_DEVICE == parseInt(type)) {
        // if device version is required
        conditions = {
            version_type: type,
            status: enums.ITEM_VALID,
            purpose: 0
        };
    } else if (enums.VERSION_TYPE_REMOTE == parseInt(type)) {
        // if remote version is required
        if (null == remoteType) {
            // compatible with legacy device behavior
            logger.info("make legacy remote version fetch compatible");
            conditions = {
                version_type: type,
                status: enums.ITEM_VALID,
                purpose: enums.VERSION_PURPOSE_OAD,
                sub_type: subType,
                remote_type: enums.VERSION_RT_0
            };
        } else {
            // for future use, warning: UCON center could not request version of single remote UCON
            conditions = {
                version_type: type,
                status: enums.ITEM_VALID,
                purpose: enums.VERSION_PURPOSE_OAD,
                sub_type: subType,
                remote_type: remoteType
            };
        }
    } else if (enums.VERSION_TYPE_IOS == parseInt(type) ||
        enums.VERSION_TYPE_ANDROID == parseInt(type)) {
        conditions = {
            version_type: type,
            status: enums.ITEM_VALID,
            purpose: 0
        };
    }

    Version.listVersions(conditions, 0, 1, "id", function(getLatestVersionErr, versions) {
        if(errorCode.SUCCESS.code == getLatestVersionErr.code && versions.length > 0) {
            // the version is valid, download image file from OSS
            var version = versions[0];
            logger.info("get version : " + JSON.stringify(version));

            if ("0" == version.version_type) {
                // version group of UCON Kits
                undownloadedFile = {
                    path: "dev_wlan_" + version.dev_wlan_ver + ".bin",
                    hash: version.dev_wlan_hash
                };
                undownloadedFileArray.push(undownloadedFile);

                if("0" == version.purpose || "1" == version.purpose) {
                    undownloadedFile = {
                        path: "dev_ble_" + version.dev_ble_ver + ".bin",
                        hash: version.dev_ble_hash
                    };
                } else if ("2" == version.purpose) {
                    undownloadedFile = {
                        path: "dev_ble_" + version.dev_ble_ver + ".hex",
                        hash: version.dev_ble_hash
                    };
                } else {
                    logger.error("purpose of version error");
                    callback (errorCode.FAILED);
                }

                undownloadedFileArray.push(undownloadedFile);
            } else if ("1" == version.version_type) {
                // version group of UCON remote
                var prefix,
                    suffix;
                if ("0" == version.sub_type) {
                    prefix = "ucon_ble_";
                } else if ("1" == version.sub_type) {
                    prefix = "rem_ble_";
                } else {
                    logger.error("sub type of version error");
                    callback (errorCode.FAILED);
                }

                if("0" == version.purpose || "1" == version.purpose) {
                    suffix = ".bin";
                } else if ("2" == version.purpose) {
                    suffix = ".hex";
                } else {
                    logger.error("purpose of version error");
                    callback (errorCode.FAILED);
                }

                undownloadedFile = {
                    path: prefix + version.rem_ble_ver + suffix,
                    hash: version.rem_ble_hash
                };
                undownloadedFileArray.push(undownloadedFile);
            } else if ("2" == version.version_type ||
                        "3" == version.version_type) {
                // do not download binary file, return version list directly
                var retVersion = new Object();
                retVersion.id = version.id;
                retVersion.version_type = version.version_type;
                retVersion.dev_wlan_ver = version.dev_wlan_ver;
                retVersion.dev_ble_ver = version.dev_ble_ver;
                retVersion.rem_ble_ver = version.rem_ble_ver;
                if(enums.COME_FROM_DEVICE != comeFrom &&
                    enums.COME_FROM_UPDATE_BOARD != comeFrom) {
                    retVersion.comment = version.comment;
                    retVersion.update_time = version.update_time;
                    retVersion.dev_wlan_hash = version.dev_wlan_hash;
                    retVersion.dev_ble_hash = version.dev_ble_hash;
                    retVersion.rem_ble_hash = version.rem_ble_hash;
                }
                callback(getLatestVersionErr, retVersion);
                return;
            } else {
                logger.error("invalid version type");
                callback(errorCode.FAILED);
            }
            var aliOss = new OSS(OSS_HOST, OSS_PORT, OSS_APP_ID, OSS_APP_SECRET);

            // walk into async loop
            async.eachSeries(undownloadedFileArray, function (fileToDownload, innerCallback) {
                var downloadFile = fileToDownload.path;
                downloadOssFilePath = ossFilePath + downloadFile;
                localFilePath = FILE_TEMP_PATH + "/" + downloadFile;
                var find = '\\\\';
                var re = new RegExp(find, 'g');
                var unixFilePath = localFilePath.replace(re, '/');
                logger.info("local file path = " + unixFilePath);

                fs.readFile(unixFilePath, function(readFileErr, fileData) {
                    if (readFileErr) {
                        logger.warn("read file error, file doesn't exist or other error :  " + readFileErr);
                        aliOss.serveObjectByID(downloadOssFilePath, PUBLISHED_RELEASE_BUCKET_NAME, unixFilePath,
                            function (serveObjectErr, response) {
                                if (errorCode.SUCCESS.code == serveObjectErr) {
                                    logger.info("serve file from ali OSS successfully");
                                    fs.readFile(unixFilePath, function(readDownloadErr, downloadFileData) {
                                        if (readDownloadErr) {
                                            logger.error("could not read downloaded file");
                                            getVersionSuccess = 0;
                                        } else {
                                            var downloadHash = checksum(downloadFileData);
                                            if (downloadHash == fileToDownload.hash) {
                                                logger.info("file hash is verified");
                                            } else {
                                                logger.error("wrong file hash");
                                                getVersionSuccess = 0;
                                            }
                                        }
                                        innerCallback();
                                    });
                                } else {
                                    logger.info("serve file from ali OSS failed");
                                    getVersionSuccess = 0;
                                    innerCallback();
                                }
                            });
                    } else {
                        // calculate MD5 checksum
                        var hash = checksum(fileData);
                        logger.info("original hash = " + fileToDownload.hash + ", actual hash = " + hash);
                        if (hash == fileToDownload.hash) {
                            logger.info("file hash is verified");
                            innerCallback();
                        } else {
                            logger.error("wrong file hash, try to fetch the image again");
                            aliOss.serveObjectByID(downloadOssFilePath, PUBLISHED_RELEASE_BUCKET_NAME, unixFilePath,
                                function (serveObjectErr, response) {
                                    if (errorCode.SUCCESS.code == serveObjectErr) {
                                        logger.info("serve file from ali OSS successfully");
                                        fs.readFile(unixFilePath, function(readDownloadErr, downloadFileData) {
                                            if (readDownloadErr) {
                                                logger.error("could not read downloaded file");
                                                getVersionSuccess = 0;
                                            } else {
                                                var downloadHash = checksum(downloadFileData);
                                                if (downloadHash == fileToDownload.hash) {
                                                    logger.info("file hash is verified");
                                                } else {
                                                    logger.error("wrong file hash");
                                                    getVersionSuccess = 0;
                                                }
                                            }
                                            innerCallback();
                                        });
                                    } else {
                                        logger.info("serve file from ali OSS failed");
                                        getVersionSuccess = 0;
                                        innerCallback();
                                    }
                                });
                        }
                    }
                });
            }, function (err) {
                if (getVersionSuccess == 1) {
                    var retVersion = new Object();
                    retVersion.id = version.id;
                    retVersion.version_type = version.version_type;
                    retVersion.dev_wlan_ver = version.dev_wlan_ver;
                    retVersion.dev_ble_ver = version.dev_ble_ver;
                    retVersion.rem_ble_ver = version.rem_ble_ver;
                    if(enums.COME_FROM_DEVICE != comeFrom &&
                        enums.COME_FROM_UPDATE_BOARD != comeFrom) {
                        retVersion.comment = version.comment;
                        retVersion.update_time = version.update_time;
                        retVersion.dev_wlan_hash = version.dev_wlan_hash;
                        retVersion.dev_ble_hash = version.dev_ble_hash;
                        retVersion.rem_ble_hash = version.rem_ble_hash;
                    }
                    callback(getLatestVersionErr, retVersion);
                } else {
                    logger.error("error occurred while getting latest version and image");
                    callback(errorCode.FAILED, null);
                }
            });
        } else {
            logger.info("no version valid");
            callback(getLatestVersionErr, null);
        }
    });
};

exports.getVersionByIDWorkUnit = function (id, callback) {
    Version.getVersion(id, function(getVersionErr, version) {
        callback(getVersionErr, version);
    })
};

exports.publishVersionWorkUnit = function (version, callback) {
    var conditions;
    Version.createVersion(version, function(createVersionErr, createdVersion) {
        if (errorCode.SUCCESS.code == createVersionErr.code && null != createdVersion) {
            logger.info("remove all same version and use the latest instead");
            conditions = {
                version_type: version.version_type,
                dev_wlan_ver: version.dev_wlan_ver,
                dev_ble_ver: version.dev_ble_ver,
                sub_type: version.sub_type,
                purpose: version.purpose,
                remote_type: version.remote_type,
                id: orm.ne(createdVersion.id)
            };
            Version.deleteVersion(conditions, function(deleteVersionErr) {
                callback(deleteVersionErr);
            })
        } else {
            callback(createVersionErr);
        }
    })
};

// Ultilities
function checksum(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}