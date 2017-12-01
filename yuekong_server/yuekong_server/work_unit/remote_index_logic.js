/**
 * Created by strawmanbobi
 * 2015-02-04
 */

// system inclusion
var fs = require('fs');

// global inclusion
require('../../../Infrastructure/BackEnd/configuration/constants');
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');

var Map = require('../../../Infrastructure/BackEnd/mem/map');
var OSS = require('../../../Infrastructure/BackEnd/data_set/ali_oss.js');
var VirtualRemote = require('../model/virtual_remote_dao.js');
var RemoteIntance = require('../model/remote_instance_dao.js');
var RemoteIndex = require('../model/remote_index_dao.js');
var RemoteIndexII = require('../model/remote_index_ii_dao.js');
var MobileUser = require('../model/mobile_user_dao.js');
var Remote = require('../model/remote_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var enums = new Enums();
var errorCode = new ErrorCode();

var async = require('async');

exports.createRemoteIndexWorkUnit = function (remoteIndex, callback) {
    // this function is depracated
    /*
    RemoteIndex.createRemoteIndex(remoteIndex, function (createRemoteIndexErr, createdRemoteIndex) {
        if(errorCode.SUCCESS.code == createRemoteIndexErr.code) {
            callback(createRemoteIndexErr, createdRemoteIndex);
        } else {
            callback(createRemoteIndexErr, null);
        }
    });
    */
    callback(errorCode.SUCCESS, null);
};

exports.listRemoteIndexesWorkUnit = function (categoryID, brandID, cityCode, from, count, isTest,
                                              version, pdsn, UA, callback) {
    var conditions = null;
    var retIndexes = [];
    var env = null;
    var lang = enums.LANGUAGE_CN;

    // check client language
    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    // distinguish remote index version via polymorphism
    var virtualRemoteIndex = null;

    if(enums.CATEGORY_AC == categoryID || enums.CATEGORY_TV == categoryID || enums.CATEGORY_NW == categoryID ||
        enums.CATEGORY_IPTV == categoryID || enums.CATEGORY_DVD == categoryID || enums.CATEGORY_FAN == categoryID ||
        enums.CATEGORY_PROJECTOR == categoryID || enums.CATEGORY_STEREO == categoryID ||
        enums.CATEGORY_LIGHT_BULB == categoryID || enums.CATEGORY_BSTB == categoryID ||
        enums.CATEGORY_CLEANING_ROBOT == categoryID || enums.CATEGORY_AIR_CLEANER == categoryID || enums.CATEGORY_DYSON == categoryID) {
        if(null == brandID) {
            logger.warn("category other than STB without brandID");
            callback(errorCode.INVALID_PARAMETER, null);
            return;
        }
        conditions = {
            category_id: categoryID,
            brand_id: brandID,
            status: enums.ITEM_VALID
        };
    } else if(enums.CATEGORY_STB == categoryID) {
        if(!cityCode) {
            callback(errorCode.INVALID_PARAMETER, null);
            return;
        }

        // work-around for iOS V2.1.6 category id issue
        if(UA.indexOf('YueKong/') > -1 &&
            UA.indexOf("2.1.6") > -1 &&
            lang == enums.LANGUAGE_TW) {
            conditions = {
                category_id: enums.CATEGORY_BSTB,
                brand_id: cityCode,
                status: enums.ITEM_VALID
            };
        } else {
            conditions = {
                category_id: categoryID,
                city_code: cityCode,
                status: enums.ITEM_VALID
            };
        }
    } else {
        callback(errorCode.INVALID_CATEGORY, null);
        return;
    }

    /**** FOR TEST ONLY ****/
    if(null != isTest && undefined != isTest) {
        conditions.status = enums.ITEM_VERIFY;
        // conditions.priority = orm.ne(999);
    }

    // pre-process remote and device version even if it is missed from input parameter
    if(null == version || undefined == version) {
        version = 'V1.0.0';
    }

    if(version < 'V1.4.0') {
        virtualRemoteIndex = RemoteIndex;
    } else {
        virtualRemoteIndex = RemoteIndexII;
    }

    /*
    // do not limit the applied version upon UCON device
    if(null == deviceVersion || undefined == deviceVersion) {
        deviceVersion = 'V1.3.0';
    }
    */

    conditions.applied_remote_version = orm.lte(version);
    conditions.banned_remote_version = orm.gt(version);

    if(UA.indexOf('Android') > -1) {
        // this request comes from an Android client
        if (UA < 'UCON_Android_V1.4.0') {
            // the reference applied remote version is fixed by server logic since this version is not specified by App,
            // server does not know what the version of the UCON controller is, so, if there are some remote index are not
            // marked as eternal (V99.0.0), ban them all
            conditions.banned_remote_version = 'V99.0.0';
        }

        // this constraints banning ble peripheral devices for old APP version
        if (UA < 'UCON_Android_V1.9.5') {
            conditions.radio_type = '0';
            // to compatible with earlier version of APP which would not retrieve sub_cate from back end
            conditions.sub_cate = 1;
        }
    } else if(UA.indexOf('YueKong/') > -1) {
        // this request comes from an iOS client
        if (UA < 'YueKong/1.4.0') {
            // the reference applied remote version is fixed by server logic since this version is not specified by App,
            // server does not know what the version of the UCON controller is, so, if there are some remote index are not
            // marked as eternal (V99.0.0), ban them all
            conditions.banned_remote_version = 'V99.0.0';
        }

        // this constraints banning ble peripheral devices for old APP version
        if (UA < 'YueKong/2.1.0') {
            conditions.radio_type = '0';
            // to compatible with earlier version of APP which would not retrieve sub_cate from back end
            conditions.sub_cate = 1;
        }
    }

    logger.info("select remote_index_by pdsn : " + pdsn);

    if (null != pdsn && "null" != pdsn) {
        logger.info("count pdsn as selection filter");
        conditions.protector = orm.like("%" + pdsn.charAt(0) + "%");
    }

    // conditions.applied_device_version = orm.lte(deviceVersion);
    logger.info("conditions = " + JSON.stringify(conditions));

    virtualRemoteIndex.listRemoteIndexes(conditions, from, count, "priority",
            function(getRemoteIndexByIDErr, remoteIndexes) {
        if(errorCode.SUCCESS.code == getRemoteIndexByIDErr.code) {
            for(var i = 0; i < remoteIndexes.length; i++) {
                var retRemoteIndex = new Object();
                var remoteIndex = remoteIndexes[i];
                for(var p in remoteIndex) {
                    if(remoteIndex[p] != null) {
                        retRemoteIndex[p] = remoteIndex[p];
                    }
                }
                if (lang == enums.LANGUAGE_TW) {
                    retRemoteIndex.category_name = retRemoteIndex.category_name_tw;
                    retRemoteIndex.brand_name = retRemoteIndex.brand_name_tw;
                    retRemoteIndex.city_name = retRemoteIndex.city_name_tw;
                    retRemoteIndex.operator_name = retRemoteIndex.operator_name_tw;
                }
                // build a fake remote_index list for fore-ground include remote_index_name field
                if(enums.CATEGORY_AC == categoryID ||
                        enums.CATEGORY_TV == categoryID ||
                        enums.CATEGORY_NW == categoryID ||
                        enums.CATEGORY_IPTV == categoryID ||
                        enums.CATEGORY_DVD == categoryID ||
                        enums.CATEGORY_FAN == categoryID ||
                        enums.CATEGORY_PROJECTOR == categoryID ||
                        enums.CATEGORY_STEREO == categoryID ||
                        enums.CATEGORY_LIGHT_BULB == categoryID ||
                        enums.CATEGORY_BSTB == categoryID||
                        enums.CATEGORY_CLEANING_ROBOT == categoryID ||
                        enums.CATEGORY_AIR_CLEANER == categoryID ||
                        enums.CATEGORY_DYSON == categoryID) {

                    retRemoteIndex.remote_index_name = remoteIndex.brand_name + "-" + (i + 1);
                } else if(enums.CATEGORY_STB == categoryID) {
                    // work-around for iOS V2.1.6 category id issue
                    if(UA.indexOf('YueKong/') > -1 &&
                        UA.indexOf("2.1.6") > -1 &&
                        lang == enums.LANGUAGE_TW) {
                        retRemoteIndex.remote_index_name = remoteIndex.brand_name + "-" + (i + 1);
                    } else {
                        retRemoteIndex.remote_index_name = remoteIndex.city_name + "-" + remoteIndex.operator_name;
                    }
                }
                retIndexes.push(retRemoteIndex);
            }
        }
        callback(getRemoteIndexByIDErr, retIndexes);
    });
};

exports.listRemoteIndexesByOperatorWorkUnit = function (operatorID, from, count, UA, callback) {
    var conditions = null;
    var retIndexes = [];
    var env = null;
    var lang = enums.LANGUAGE_CN;

    if(!operatorID) {
        callback(errorCode.INVALID_PARAMETER, null);
        return;
    }
    conditions = {
        operator_id: operatorID
    };

    // check client language
    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    // conditions.applied_device_version = orm.lte(deviceVersion);
    logger.info("conditions = " + JSON.stringify(conditions));

    RemoteIndexII.listRemoteIndexes(conditions, from, count, "priority",
        function(getRemoteIndexByIDErr, remoteIndexes) {
            if(errorCode.SUCCESS.code == getRemoteIndexByIDErr.code) {
                for(var i = 0; i < remoteIndexes.length; i++) {
                    var retRemoteIndex = new Object();
                    var remoteIndex = remoteIndexes[i];
                    for(var p in remoteIndex) {
                        if(remoteIndex[p] != null) {
                            retRemoteIndex[p] = remoteIndex[p];
                        }
                    }
                    if (lang == enums.LANGUAGE_TW) {
                        retRemoteIndex.category_name = retRemoteIndex.category_name_tw;
                        retRemoteIndex.brand_name = retRemoteIndex.brand_name_tw;
                        retRemoteIndex.city_name = retRemoteIndex.city_name_tw;
                        retRemoteIndex.operator_name = retRemoteIndex.operator_name_tw;
                    }
                    retRemoteIndex.remote_index_name = remoteIndex.city_name + "-" + remoteIndex.operator_name;
                    retIndexes.push(retRemoteIndex);
                }
            }
            callback(getRemoteIndexByIDErr, retIndexes);
        });
};

// 2 functionalities applies on this work unit:
// 1. count user remote indexes
// 2. return user remote indexes
exports.listUserRemoteIndexesWorkUnit = function (snsID, snsType, mobileID, remoteVersion, configuredRemoteIDs, UA,
                                                  func, callback) {
    var lang = enums.LANGUAGE_CN;
    var virtualRemoteIndex = null;
    var retRemoteIndexList = [];
    var remoteIndexCount = 0;
    var validRemotes = [];
    var findUserConditions = {
        weixin_id: snsID,
        sns_type: snsType,
        status: enums.ITEM_VALID
    };

    // process language, remote version hill-back etc.
    if(null == remoteVersion || undefined == remoteVersion) {
        remoteVersion = 'V1.0.0';
    }

    if(remoteVersion < 'V1.4.0') {
        virtualRemoteIndex = RemoteIndex;
    } else {
        virtualRemoteIndex = RemoteIndexII;
    }

    // check client language
    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    if (null != snsID && null != mobileID) {
        MobileUser.findMobileUsersByConditions(findUserConditions, function(findMobileUsersErr, mobileUsers) {
            if (errorCode.SUCCESS.code == findMobileUsersErr.code &&
                null != mobileUsers &&
                mobileUsers.length > 0) {
                async.eachSeries(mobileUsers, function (mobileUser, traverseMobileCallback) {
                    var vMobileID = mobileUser.mobile_id;
                    var findRemoteIntanceConditions = {
                        mobile_id: vMobileID,
                        status: enums.ITEM_VALID
                    };
                    RemoteIntance.findRemoteInstancesByCondition(findRemoteIntanceConditions,
                        function(findRemoteInstancesErr, remoteInstances) {
                            if (errorCode.SUCCESS.code == findRemoteInstancesErr.code &&
                                null != remoteInstances &&
                                remoteInstances.length > 0) {
                                logger.info("========= find remote isntances by conditions successfully : " + remoteInstances.length);
                                async.eachSeries(remoteInstances, function (remoteInstance, traverseIntanceCallback) {
                                    var remoteInstanceID = remoteInstance.id;
                                    var findRemoteConditions = {
                                        remote_instance_id: remoteInstanceID,
                                        status: enums.ITEM_VALID,
                                        category_id: orm.ne(0)
                                    };
                                    logger.info("=========== find remote conditions = " + findRemoteConditions);
                                    Remote.findRemotesByConditions(findRemoteConditions, function(findRemotesErr, remotes) {
                                        if (errorCode.SUCCESS.code == findRemotesErr.code &&
                                            null != remotes &&
                                            remotes.length > 0) {
                                            // we get enough information here, create a virtual remote index according
                                            // to specified remote
                                            logger.info("========= find remotes by conditions successfully : " + remotes.length);
                                            logger.info("exclusion of remotes : " + configuredRemoteIDs);

                                            validRemotes.length = 0;
                                            for (var r = 0; r < remotes.length; r++) {
                                                logger.info("current remote.id = " + remotes[r].id);
                                                if(false == targetInTemplate(remotes[r].id, configuredRemoteIDs.split(","))) {
                                                    validRemotes.push(remotes[r]);
                                                }
                                            }

                                            async.eachSeries(validRemotes, function (remote, traverseRemoteCallback) {
                                                var remoteIndexID = remote.remote_index_id;
                                                var findRemoteIndexConditions = {
                                                    id: remoteIndexID,
                                                    status: enums.ITEM_VALID
                                                };

                                                findRemoteIndexConditions.applied_remote_version = orm.lte(remoteVersion);
                                                findRemoteIndexConditions.banned_remote_version = orm.gt(remoteVersion);

                                                if(UA.indexOf('Android') > -1) {
                                                    // this request comes from an Android client
                                                    if (UA < 'UCON_Android_V1.4.0') {
                                                        // the reference applied remote version is fixed by server logic since this version is not specified by App,
                                                        // server does not know what the version of the UCON controller is, so, if there are some remote index are not
                                                        // marked as eternal (V99.0.0), ban them all
                                                        findRemoteIndexConditions.banned_remote_version = 'V99.0.0';
                                                    }

                                                    // this constraints banning ble peripheral devices for old APP version
                                                    if (UA < 'UCON_Android_V1.9.5') {
                                                        findRemoteIndexConditions.radio_type = '0';
                                                        // to compatible with earlier version of APP which would not retrieve sub_cate from back end
                                                        findRemoteIndexConditions.sub_cate = 1;
                                                    }
                                                } else if(UA.indexOf('YueKong/') > -1) {
                                                    // this request comes from an iOS client
                                                    if (UA < 'YueKong/1.4.0') {
                                                        // the reference applied remote version is fixed by server logic since this version is not specified by App,
                                                        // server does not know what the version of the UCON controller is, so, if there are some remote index are not
                                                        // marked as eternal (V99.0.0), ban them all
                                                        findRemoteIndexConditions.banned_remote_version = 'V99.0.0';
                                                    }

                                                    // this constraints banning ble peripheral devices for old APP version
                                                    if (UA < 'YueKong/2.1.0') {
                                                        findRemoteIndexConditions.radio_type = '0';
                                                        // to compatible with earlier version of APP which would not retrieve sub_cate from back end
                                                        findRemoteIndexConditions.sub_cate = 1;
                                                    }
                                                }

                                                // conditions.applied_device_version = orm.lte(deviceVersion);
                                                logger.info("findRemoteIndexConditions = " + JSON.stringify(findRemoteIndexConditions));

                                                virtualRemoteIndex.findRemoteIndexByCondition(findRemoteIndexConditions,
                                                    function(findRemoteIndexErr, remoteIndexes) {
                                                        if (errorCode.SUCCESS.code == findRemoteIndexErr.code &&
                                                            null != remoteIndexes &&
                                                            remoteIndexes.length > 0) {
                                                            logger.info("========= find remotes indexes successfully : " + remoteIndexes.length);
                                                            var remoteIndex = remoteIndexes[0];

                                                            // change its name to the name of remote itself
                                                            logger.info("set remote index name to remote name :" +
                                                                remote.name);
                                                            remoteIndex.name = remoteInstance.name + " - " + remote.name;

                                                            if (lang == enums.LANGUAGE_TW) {
                                                                remoteIndex.category_name = remoteIndex.category_name_tw;
                                                                remoteIndex.brand_name = remoteIndex.brand_name_tw;
                                                                remoteIndex.city_name = remoteIndex.city_name_tw;
                                                                remoteIndex.operator_name = remoteIndex.operator_name_tw;
                                                            }

                                                            logger.info("function = " + func);
                                                            if (parseInt(func) == 0) {
                                                                logger.info("function == 0, increase remote index count by 1");
                                                                remoteIndexCount++;
                                                            } else if (parseInt(func) == 1) {
                                                                logger.info("function == 1, push remote index to stack");
                                                                retRemoteIndexList.push(remoteIndex);
                                                            } else {
                                                                logger.error("wrong parameter : " + func);
                                                            }
                                                        } else {
                                                            logger.info("no remote index found per " + remote.name + ", " + remote.remote_index_id);
                                                        }
                                                        traverseRemoteCallback();
                                                    });
                                            }, function (err) {
                                                traverseIntanceCallback();
                                            });
                                        } else {
                                            traverseIntanceCallback();
                                        }
                                    });
                                }, function (err) {
                                    traverseMobileCallback();
                                });
                            } else {
                                traverseMobileCallback();
                            }
                        });
                }, function (err) {
                    logger.info("function at return phase = " + func + ", count = " + remoteIndexCount +
                        " list count = " + retRemoteIndexList.length);
                    if (parseInt(func) == 0) {
                        callback(errorCode.SUCCESS, remoteIndexCount);
                    } else if (parseInt(func) == 1) {
                        callback(errorCode.SUCCESS, retRemoteIndexList);
                    }
                });
            } else {
                if (parseInt(func) == 0) {
                    callback(errorCode.SUCCESS, 0);
                } else if (parseInt(func) == 1) {
                    callback(errorCode.SUCCESS, null);
                }
            }
        });
    } else {
        // SNS information is not specified, use mobile information instead
        var findRemoteIntanceConditions = {
            mobile_id: mobileID,
            status: enums.ITEM_VALID
        };
        RemoteIntance.findRemoteInstancesByCondition(findRemoteIntanceConditions,
            function(findRemoteInstancesErr, remoteInstances) {
                if (errorCode.SUCCESS.code == findRemoteInstancesErr.code &&
                    null != remoteInstances &&
                    remoteInstances.length > 0) {
                    async.eachSeries(remoteInstances, function (remoteInstance, traverseIntanceCallback) {
                        var remoteInstanceID = remoteInstance.id;
                        var findRemoteConditions = {
                            remote_instance_id: remoteInstanceID,
                            status: enums.ITEM_VALID,
                            category_id: orm.ne(0)
                        };
                        Remote.findRemotesByConditions(findRemoteConditions, function(findRemotesErr, remotes) {
                            if (errorCode.SUCCESS.code == findRemotesErr.code &&
                                null != remotes &&
                                remotes.length > 0) {
                                // we get enough information here, create a virtual remote index according
                                // to specified remote
                                validRemotes.length = 0;
                                for (var r = 0; r < remotes.length; r++) {
                                    if(false == targetInTemplate(remotes[r].id, configuredRemoteIDs.split(","))) {
                                        validRemotes.push(remotes[r]);
                                    }
                                }
                                async.eachSeries(validRemotes, function (remote, traverseRemoteCallback) {
                                    var remoteIndexID = remote.remote_index_id;
                                    var findRemoteIndexConditions = {
                                        id: remoteIndexID,
                                        status: enums.ITEM_VALID
                                    };

                                    findRemoteIndexConditions.applied_remote_version = orm.lte(remoteVersion);
                                    findRemoteIndexConditions.banned_remote_version = orm.gt(remoteVersion);

                                    if(UA.indexOf('Android') > -1) {
                                        // this request comes from an Android client
                                        if (UA < 'UCON_Android_V1.4.0') {
                                            // the reference applied remote version is fixed by server logic since this version is not specified by App,
                                            // server does not know what the version of the UCON controller is, so, if there are some remote index are not
                                            // marked as eternal (V99.0.0), ban them all
                                            findRemoteIndexConditions.banned_remote_version = 'V99.0.0';
                                        }

                                        // this constraints banning ble peripheral devices for old APP version
                                        if (UA < 'UCON_Android_V1.9.5') {
                                            findRemoteIndexConditions.radio_type = '0';
                                        }
                                    } else if(UA.indexOf('YueKong/') > -1) {
                                        // this request comes from an iOS client
                                        if (UA < 'YueKong/1.4.0') {
                                            // the reference applied remote version is fixed by server logic since this version is not specified by App,
                                            // server does not know what the version of the UCON controller is, so, if there are some remote index are not
                                            // marked as eternal (V99.0.0), ban them all
                                            findRemoteIndexConditions.banned_remote_version = 'V99.0.0';
                                        }

                                        // this constraints banning ble peripheral devices for old APP version
                                        if (UA < 'YueKong/2.1.0') {
                                            findRemoteIndexConditions.radio_type = '0';
                                        }
                                    }

                                    // conditions.applied_device_version = orm.lte(deviceVersion);
                                    logger.info("findRemoteIndexConditions = " + JSON.stringify(findRemoteIndexConditions));

                                    virtualRemoteIndex.findRemoteIndexByCondition(findRemoteIndexConditions,
                                        function(findRemoteIndexErr, remoteIndexes) {
                                            if (errorCode.SUCCESS.code == findRemoteIndexErr.code &&
                                                null != remoteIndexes &&
                                                remoteIndexes.length > 0) {
                                                logger.info("find remote indexes successfully");
                                                var remoteIndex = remoteIndexes[0];

                                                // change its name to the name of remote itself
                                                logger.info("set remote index name to remote name :" +
                                                    remote.name);
                                                remoteIndex.name = remoteInstance.name + " - " + remote.name;

                                                if (lang == enums.LANGUAGE_TW) {
                                                    remoteIndex.category_name = remoteIndex.category_name_tw;
                                                    remoteIndex.brand_name = remoteIndex.brand_name_tw;
                                                    remoteIndex.city_name = remoteIndex.city_name_tw;
                                                    remoteIndex.operator_name = remoteIndex.operator_name_tw;
                                                }
                                                if (parseInt(func) == 0) {
                                                    remoteIndexCount++;
                                                } else if (parseInt(func) == 1) {
                                                    retRemoteIndexList.push(remoteIndex);
                                                }
                                            } else {
                                                logger.info("no remote index found per " + remote.name + ", " + remote.remote_index_id);
                                            }
                                            traverseRemoteCallback();
                                        });
                                }, function (err) {
                                    traverseIntanceCallback();
                                });
                            } else {
                                traverseIntanceCallback();
                            }
                        });
                    }, function (err) {
                        if (parseInt(func) == 0) {
                            callback(errorCode.SUCCESS, remoteIndexCount);
                        } else if (parseInt(func) == 1) {
                            callback(errorCode.SUCCESS, retRemoteIndexList);
                        }
                    });
                } else {
                    if (parseInt(func) == 0) {
                        callback(errorCode.SUCCESS, 0);
                    } else if (parseInt(func) == 1) {
                        callback(errorCode.SUCCESS, null);
                    }
                }
            });
    }
};

exports.listRemoteIndexesForSiriusWorkUnit = function (categoryID, brandID, cityCode, from, count, UA, callback) {
    var conditions = null;
    var retIndexes = [];
    var env = null;
    var lang = enums.LANGUAGE_CN;

    // distinguish remote index version via polymorphism
    var virtualRemoteIndex = null;

    if(enums.CATEGORY_AC == categoryID || enums.CATEGORY_TV == categoryID || enums.CATEGORY_NW == categoryID ||
        enums.CATEGORY_IPTV == categoryID || enums.CATEGORY_DVD == categoryID || enums.CATEGORY_FAN == categoryID ||
        enums.CATEGORY_PROJECTOR == categoryID || enums.CATEGORY_STEREO == categoryID ||
        enums.CATEGORY_LIGHT_BULB == categoryID || enums.CATEGORY_BSTB == categoryID ||
        enums.CATEGORY_CLEANING_ROBOT == categoryID || enums.CATEGORY_AIR_CLEANER == categoryID ||
        enums.CATEGORY_DYSON == categoryID) {
        if(null == brandID) {
            logger.warn("category other than STB without brandID");
            callback(errorCode.INVALID_PARAMETER, null);
            return;
        }
        conditions = {
            category_id: categoryID,
            brand_id: brandID,
            protocol: orm.ne('upd1986c'),
            status: enums.ITEM_VALID
        };
    } else if(enums.CATEGORY_STB == categoryID) {
        if(!cityCode) {
            callback(errorCode.INVALID_PARAMETER, null);
            return;
        }
        var provinceSuffix = cityCode.substring(0, 2);
        var unspecifiedCityCode = provinceSuffix + '0000';

        // exclude stbs not come from kookong db
        conditions = {
            category_id: categoryID,
            city_code: cityCode,
            status: enums.ITEM_VALID,
            remote: orm.like("remote_box_ii_%")
        };
    } else {
        callback(errorCode.INVALID_CATEGORY, null);
        return;
    }

    virtualRemoteIndex = RemoteIndexII;

    // check client language
    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    // conditions.applied_device_version = orm.lte(deviceVersion);
    logger.info("conditions = " + JSON.stringify(conditions));

    virtualRemoteIndex.listRemoteIndexes(conditions, from, count, "priority",
        function(getRemoteIndexByIDErr, remoteIndexes) {
            if(errorCode.SUCCESS.code == getRemoteIndexByIDErr.code) {
                for(var i = 0; i < remoteIndexes.length; i++) {
                    var retRemoteIndex = new Object();
                    var remoteIndex = remoteIndexes[i];
                    for(var p in remoteIndex) {
                        if(remoteIndex[p] != null) {
                            retRemoteIndex[p] = remoteIndex[p];
                        }
                    }
                    if (lang == enums.LANGUAGE_TW) {
                        retRemoteIndex.category_name = retRemoteIndex.category_name_tw;
                        retRemoteIndex.brand_name = retRemoteIndex.brand_name_tw;
                        retRemoteIndex.city_name = retRemoteIndex.city_name_tw;
                        retRemoteIndex.operator_name = retRemoteIndex.operator_name_tw;
                    }
                    // build a fake remote_index list for fore-ground include remote_index_name field
                    if(enums.CATEGORY_AC == categoryID ||
                        enums.CATEGORY_TV == categoryID ||
                        enums.CATEGORY_NW == categoryID ||
                        enums.CATEGORY_IPTV == categoryID ||
                        enums.CATEGORY_DVD == categoryID ||
                        enums.CATEGORY_FAN == categoryID ||
                        enums.CATEGORY_PROJECTOR == categoryID ||
                        enums.CATEGORY_STEREO == categoryID ||
                        enums.CATEGORY_LIGHT_BULB == categoryID ||
                        enums.CATEGORY_BSTB == categoryID ||
                        enums.CATEGORY_DYSON == categoryID) {

                        retRemoteIndex.remote_index_name = remoteIndex.brand_name + "-" + (i + 1);
                    } else if(enums.CATEGORY_STB == categoryID) {
                        retRemoteIndex.remote_index_name = remoteIndex.city_name + "-" + remoteIndex.operator_name;
                    }
                    retIndexes.push(retRemoteIndex);
                }
            }
            callback(getRemoteIndexByIDErr, retIndexes);
        });
};

exports.getRemoteIndexByIDWorkUnit = function (remoteIndexID, version, callback) {
    var virtualRemoteIndex = null;

    /* compatibility consideration */
    if(null != version && undefined != version && version >= 'V1.4.0') {
        virtualRemoteIndex = RemoteIndexII;
    } else {
        virtualRemoteIndex = RemoteIndex;
    }
    virtualRemoteIndex.getRemoteIndexByID(remoteIndexID, function(getRemoteIndexByIDErr, remoteIndex) {
        if(errorCode.SUCCESS.code == getRemoteIndexByIDErr.code &&
            remoteIndex &&
            enums.ITEM_VALID == remoteIndex.status) {
            callback(getRemoteIndexByIDErr, remoteIndexes);
        } else {
            callback(errorCode.BRAND_NOT_FOUND, null);
        }
    });
};

exports.publishRemoteIndexesWorkUnit = function (remoteIndexList, callback) {
    async.eachSeries(remoteIndexList, function (remoteIndex, innerCallback) {
        var conditions = null;
        if (remoteIndex.category_id == enums.CATEGORY_STB) {
            conditions = {
                category_id: remoteIndex.category_id,
                city_code: remoteIndex.city_code,
                remote: remoteIndex.remote,
                protocol: remoteIndex.protocol
            };
        } else {
            conditions = {
                category_id: remoteIndex.category_id,
                brand_id: remoteIndex.brand_id,
                remote: remoteIndex.remote,
                protocol: remoteIndex.protocol
            };
        }

        // only care remote index ii
        RemoteIndexII.findRemoteIndexByCondition(conditions, function(findRemoteIndexErr, remoteIndexes) {
            if (findRemoteIndexErr.code == errorCode.SUCCESS.code &&
                undefined != remoteIndexes && null != remoteIndexes &&
                remoteIndexes.length > 0) {
                logger.info("found certain remote indexes in remote indexes publish, update its status");
                if(remoteIndexes[0].status != enums.ITEM_VALID) {
                    remoteIndexes[0].status = enums.ITEM_VALID;
                    RemoteIndexII.updateRemoteIndexByID(remoteIndexes[0].id, remoteIndexes[0],
                    function(updateRemoteIndexErr, updatedRemoteIndex) {
                        innerCallback();
                    });
                } else {
                    innerCallback();
                }
            } else {
                RemoteIndexII.createRemoteIndex(remoteIndex, function(createRemoteIndexErr) {
                    innerCallback();
                });
            }
        });
    }, function (err) {
        callback(errorCode.SUCCESS);
    });
};

exports.deleteRemoteIndexWorkUnit = function (remoteIndex, callback) {
    var conditions;
    logger.info("remoteIndex to be deleted = " + JSON.stringify(remoteIndex));
    if (remoteIndex.category_id == enums.CATEGORY_STB) {
        conditions = {
            category_id: remoteIndex.category_id,
            city_code: remoteIndex.city_code,
            protocol: remoteIndex.protocol,
            remote: remoteIndex.remote
        };
    } else {
        conditions = {
            category_id: remoteIndex.category_id,
            brand_id: remoteIndex.brand_id,
            protocol: remoteIndex.protocol,
            remote: remoteIndex.remote
        };
    }
    RemoteIndexII.deleteRemoteIndexByConditions(conditions, function(deleteRemoteIndexErr) {
        callback(deleteRemoteIndexErr);
    });
};

// deprecated
exports.matchKeyCodeWorkUnit = function (categoryID, brandID, cityCode, remoteKey, code, version, callback) {
    var matchedCount = 0;
    var matchedRemoteList = new Map();
    var conditions = null;

    var virtualRemoteIndex = null;

    /* compatibility consideration */
    if(null != version && undefined != version && version >= 'V1.4.0') {
        virtualRemoteIndex = RemoteIndexII;
    } else {
        virtualRemoteIndex = RemoteIndex;
    }

    // find remote index according to category and brand
    if (enums.CATEGORY_AC == categoryID || enums.CATEGORY_TV == categoryID || enums.CATEGORY_NW == categoryID ||
        enums.CATEGORY_IPTV == categoryID || enums.CATEGORY_DVD == categoryID || enums.CATEGORY_FAN == categoryID ||
        enums.CATEGORY_PROJECTOR == categoryID || enums.CATEGORY_STEREO == categoryID || enums.CATEGORY_LIGHT_BULB == categoryID ||
        enums.CATEGORY_BSTB == categoryID || enums.CATEGORY_CLEANING_ROBOT == categoryID || enums.CATEGORY_AIR_CLEANER == categoryID ||
        enums.CATEGORY_DYSON == categoryID) {
        conditions = {
            brand_id: brandID,
            category_id: categoryID,
            status: 1
        };
    } else if(enums.CATEGORY_STB == categoryID) {
        conditions = {
            city_code: cityCode
        }
    }
    virtualRemoteIndex.findRemoteIndexByCondition(conditions,
        function(findRemoteIndexByConditionsErr, remoteIndexes) {
            logger.debug("matched in indexes : " + remoteIndexes.length);
            if(errorCode.SUCCESS.code == findRemoteIndexByConditionsErr.code &&
                null != remoteIndexes && remoteIndexes.length > 0) {
                logger.info(remoteIndexes.length + " remotes are found, continue trying in KV collections");
                async.eachSeries(remoteIndexes, function (remoteIndex, innerCallback) {
                    var remoteName = remoteIndex.remote;
                    var protocolName = remoteIndex.protocol;
                    var virtualRemote = new VirtualRemote();
                    var binFileName = "";
                    virtualRemote.findRemoteByKey(protocolName, remoteName, remoteKey, code,
                        function(findRemoteByKeyErr, remote) {
                            if(errorCode.SUCCESS.code == findRemoteByKeyErr.code &&
                                null != remote) {
                                if(remote.key_codes && remote.key_codes.length > 0) {
                                    if(matchKeyCode(remoteName, remote.key_codes, code)) {
                                        logger.info("codes are completely matched for : " + remoteName);
                                        matchedCount ++;
                                        binFileName = "ykir_" + protocolName + "_" + remoteName + ".bin";
                                        matchedRemoteList.set(remoteName, binFileName);
                                    } else {
                                        logger.info("code not match for : " + remoteName);
                                    }
                                }
                                innerCallback();
                            } else {
                                logger.warn("remote not found per " + remoteName);
                                innerCallback();
                            }
                        });
                }, function (err) {
                    if (err) {
                        logger.info("failed to match remote : " + err);
                        callback(errorCode.FAILED, 0, null);
                    } else {
                        logger.info("succeeded matching " + matchedCount + " remote(s) : " +
                        JSON.stringify(matchedRemoteList.values()));
                        callback(errorCode.SUCCESS, matchedCount, matchedRemoteList.values());
                    }
                });
            } else {
                logger.warn("remote indexes are not found by category and brand : " +
                categoryID + ", " + brandID);
                callback(errorCode.REMOTE_INDEX_NOT_FOUND, 0, null);
            }
        });
};

exports.downloadRemoteBinWorkUnit = function(fileName, binaryVersion, res, callback) {
    var bucketName = "";

    if (null != binaryVersion && undefined != binaryVersion && '2' == binaryVersion) {
        bucketName = OSS_DIR_DOWN_PATH;
    } else {
        bucketName = "yuekong-code-rel";
    }

    var aliOss = new OSS(OSS_HOST, OSS_PORT, OSS_APP_ID, OSS_APP_SECRET);
    aliOss.serveObjectByID(fileName, bucketName, res, function (serveObjectErr, response) {
        var error = errorCode.SUCCESS;
        if (errorCode.SUCCESS.code == serveObjectErr) {
            logger.info("serve remote binary object successfully");
        } else {
            error = errorCode.REMOTE_BIN_DOWNLOAD_FAILURE;
        }
        callback(error, response);
    });
};

exports.downloadRemoteBinCachedWorkUnit = function(fileName, callback) {
    var remoteBinaryPath = FILE_TEMP_PATH;
    var localBinFileName = remoteBinaryPath + "/" + fileName;

    var error = errorCode.SUCCESS;

    fs.exists(localBinFileName, function(exists) {
        if (exists) {
            logger.info("file " + localBinFileName + " already exists, serve directly");
            callback(error, localBinFileName);
        } else {
            logger.info("file " + localBinFileName + " does not exist, download it from OSS");
            var aliOss = new OSS(OSS_HOST, OSS_PORT, OSS_APP_ID, OSS_APP_SECRET);
            aliOss.serveObjectByID(fileName, OSS_DIR_DOWN_PATH, localBinFileName,
                function (serveObjectErr) {
                    if (errorCode.SUCCESS.code == serveObjectErr) {
                        logger.info("serve remote binary object and cached successfully");
                        callback(error, localBinFileName);
                    } else {
                        logger.info("serve remote binary object and cached failed");
                        error = errorCode.FAILED;
                        callback(error, null);
                    }
                });
        }
    });

};

/**
 * Match key code in remote KV
 * @param template : the key code fetched from remote KV
 * @param target : the key code send by client
 */
function matchKeyCode(remoteName, template, target) {
    var templateCodes = template.split(" ");
    var maxCodeValue = 0;
    var minCodeValue = 1000000;

    var templateCodeLength = templateCodes.length - 1;
    logger.debug("per " + remoteName + " /// target length " + target.length + " and template length " +
        templateCodeLength);

    if(target.length < templateCodeLength || target.length > templateCodeLength * 1.5) {
        logger.debug("will return");
        return false;
    }

    for(var i = 0; i < templateCodeLength; i++) {
        var templateCode = templateCodes[i];
        var targetCode = target[i];

        // as target code varies in a certain range, the method directly sees if the value of target code is
        // in the range of +-25% of the value of template code
        var maxTemplateRange = templateCode * 1.4;
        var minTemplateRange = templateCode * 0.6;

        /* updated by strawmanbobi 2015-02-11 b1 - begin **/
        // if template code really equals to 0 while target code really far-larger than max code value
        // we take this situation as MATCHED !
        logger.info("templateCode = " + templateCode + ", targetCode = " + targetCode + ", maxCode = " + maxCodeValue);
        if(0 == templateCode && targetCode > 2 * maxCodeValue) {
            logger.info("in the real world, it matched!");
            return true;
        }
        /* updated by strawmanbobi 2015-02-11 b1 - end **/

        if(targetCode < minTemplateRange || targetCode > maxTemplateRange) {
            // code not matched
            logger.info("code not matched : " + targetCode + " X " + templateCode);
            return false;
        }

        // save max key code value and min key code value
        if(maxCodeValue < targetCode) {
            maxCodeValue = targetCode;
        }
        if(minCodeValue > targetCode) {
            minCodeValue = targetCode;
        }
    }
    return true;
}

/**
 * Check if some target is in certain template
 * @param target : ID key of remote
 * @param template Array : Array of ID template
 */
function targetInTemplate(target, template) {
    for (var i = 0; i < template.length; i++) {
        // logger.info("** " + target + " ** " + template[i]);
        if (parseInt(target) == parseInt(template[i])) {
            return true;
        }
    }
    return false;
}