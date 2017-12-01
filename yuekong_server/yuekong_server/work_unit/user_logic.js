/**
 * Created by strawmanbobi
 * 2016-03-02
 */

// global inclusion
require('../../../Infrastructure/BackEnd/configuration/constants');
var Weixin = require('../../../Infrastructure/BackEnd/sns/weixin.js');

// system inclusion
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');

// local inclusion
var User = require('../model/user_dao.js');
var DeviceInstance = require('../model/device_instance_dao.js');
var RemoteInstance = require('../model/remote_instance_dao.js');
var Remote = require('../model/remote_dao.js');
var MobileUser = require('../model/mobile_user_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var async = require('async');

var enums = new Enums();
var errorCode = new ErrorCode();

exports.weixinAccessTokenWorkUnit = function(appID, authCode, callback) {
    var weixin = new Weixin(appID, OPEN_WX_APP_SECRET, null);

    weixin.fetchAccessToken(authCode, function(fetchAccessTokenErr, accessToken) {
        if (fetchAccessTokenErr == errorCode.SUCCESS.code) {
            callback(errorCode.SUCCESS, accessToken);
        } else {
            callback(errorCode.FAILED, accessToken);
        }
    });
};

exports.weixinGetUserInfoWorkUnit = function(accessToken, openID, callback) {
    var weixin = new Weixin(null, null, accessToken);

    weixin.fetchUserInfo(accessToken, openID, function(getUserInfoErr, userInfo) {
        if (getUserInfoErr == errorCode.SUCCESS.code) {
            callback(errorCode.SUCCESS, userInfo);
        } else {
            callback(errorCode.FAILED, userInfo);
        }
    });
};

exports.createUserWorkUnit = function (mobileID, newUser, callback) {
    var findUserConditions = null;

    if (undefined != newUser.sns_type && null != newUser.sns_type) {
        findUserConditions = {
            weixin_id: newUser.weixin_id,
            sns_type: newUser.sns_type,
            status: enums.ITEM_VALID
        }
    } else {
        findUserConditions = {
            weixin_id: newUser.weixin_id,
            status: enums.ITEM_VALID
        };
    }
    var findDeviceConditions = null;

    logger.info("mobileID = " + mobileID);

    // find user by conditions
    User.findUserByConditions(findUserConditions, function(findUserErr, users) {
        if (errorCode.SUCCESS.code == findUserErr.code && null != users && users.length > 0) {
            logger.info("user already found by conditions : " + JSON.stringify(findUserConditions) + " , update user");
            newUser.status = enums.ITEM_VALID;
            User.updateUserByID(users[0].id, newUser, function(updateUserErr, updatedUser) {
                if(errorCode.SUCCESS.code == updateUserErr.code &&
                    undefined != updatedUser &&
                    null != updatedUser) {
                    findDeviceConditions = {
                        mobile_id: mobileID,
                        status: enums.ITEM_VALID
                    };
                    // update all device instances for this mobile device
                    DeviceInstance.findDevicesInstancesByConditions(findDeviceConditions,
                        function(findDeviceInstancesErr, deviceInstances) {
                            if (errorCode.SUCCESS.code == findDeviceInstancesErr.code &&
                                null != deviceInstances) {
                                for(var i = 0; i < deviceInstances.length; i++) {
                                    var deviceInstance = deviceInstances[i];
                                    deviceInstance.user_open_id = updatedUser.weixin_id;
                                    deviceInstance.user_name = updatedUser.name;
                                    DeviceInstance.updateDeviceInstanceByID(deviceInstance.id, deviceInstance,
                                        function(updateDeviceInstanceErr, updatedDeviceInstance) {
                                            if (errorCode.SUCCESS.code == updateDeviceInstanceErr.code) {
                                                logger.info("device instance with id " + updatedDeviceInstance.id +
                                                    " has been bound to user " + updatedUser.name);
                                            } else {
                                                logger.error("device instance with id " + deviceInstance.id +
                                                    " failed to bind to user " + updatedUser.name);
                                            }
                                        });
                                }
                            } else {
                                logger.info("empty device instances for mobile_id " + mobileID);
                            }
                        });

                    // update all remote instances for this mobile device
                    RemoteInstance.findRemoteInstancesByCondition(findDeviceConditions,
                        function(findRemoteInstancesErr, remoteInstances) {
                            if (errorCode.SUCCESS.code == findRemoteInstancesErr.code &&
                                null != remoteInstances) {
                                for(var i = 0; i < remoteInstances.length; i++) {
                                    var remoteInstance = remoteInstances[i];
                                    remoteInstance.user_open_id = updatedUser.weixin_id;
                                    remoteInstance.user_name = updatedUser.name;
                                    RemoteInstance.updateRemoteInstanceByID(remoteInstance.id, remoteInstance,
                                        function(updateRemoteInstanceErr, updatedRemoteInstance) {
                                            if (errorCode.SUCCESS.code == updateRemoteInstanceErr.code) {
                                                logger.info("remote instance with id " + updatedRemoteInstance.id +
                                                    " has been bound to user " + updatedUser.name);
                                            } else {
                                                logger.error("remote instance with id " + remoteInstance.id +
                                                    " failed to bind to user " + updatedUser.name);
                                            }
                                        });
                                }
                            } else {
                                logger.info("empty remote instances for mobile_id " + mobileID);
                            }
                        });
                    callback(updateUserErr, updatedUser);
                } else {
                    callback(updateUserErr, null);
                }
            });
        } else {
            logger.info("user not found by conditions : " + JSON.stringify(findUserConditions) + " , create user");
            User.createUser(newUser, function (createUserErr, createdUser) {
                if(errorCode.SUCCESS.code == createUserErr.code &&
                    undefined != createdUser &&
                    null != createdUser) {
                    findDeviceConditions = {
                        mobile_id: mobileID,
                        status: enums.ITEM_VALID
                    };
                    // update all device instances for this mobile device
                    DeviceInstance.findDevicesInstancesByConditions(findDeviceConditions,
                        function(findDeviceInstancesErr, deviceInstances) {
                            if (errorCode.SUCCESS.code == findDeviceInstancesErr.code &&
                                null != deviceInstances) {
                                for(var i = 0; i < deviceInstances.length; i++) {
                                    var deviceInstance = deviceInstances[i];
                                    deviceInstance.user_open_id = createdUser.weixin_id;
                                    deviceInstance.user_name = createdUser.name;
                                    DeviceInstance.updateDeviceInstanceByID(deviceInstance.id, deviceInstance,
                                        function(updateDeviceInstanceErr, updatedDeviceInstance) {
                                            if (errorCode.SUCCESS.code == updateDeviceInstanceErr.code) {
                                                logger.info("device instance with id " + updatedDeviceInstance.id +
                                                    " has been bound to user " + createdUser.name);
                                            } else {
                                                logger.error("device instance with id " + deviceInstance.id +
                                                    " failed to bind to user " + createdUser.name);
                                            }
                                        });
                                }
                            } else {
                                logger.info("empty device instances for mobile_id " + mobileID);
                            }
                        });

                    // update all remote instances for this mobile device
                    RemoteInstance.findRemoteInstancesByCondition(findDeviceConditions,
                        function(findRemoteInstancesErr, remoteInstances) {
                            if (errorCode.SUCCESS.code == findRemoteInstancesErr.code &&
                                null != remoteInstances) {
                                for(var i = 0; i < remoteInstances.length; i++) {
                                    var remoteInstance = remoteInstances[i];
                                    remoteInstance.user_open_id = createdUser.weixin_id;
                                    remoteInstance.user_name = createdUser.name;
                                    RemoteInstance.updateRemoteInstanceByID(remoteInstance.id, remoteInstance,
                                        function(updateRemoteInstanceErr, updatedRemoteInstance) {
                                            if (errorCode.SUCCESS.code == updateRemoteInstanceErr.code) {
                                                logger.info("remote instance with id " + updatedRemoteInstance.id +
                                                    " has been bound to user " + createdUser.name);
                                            } else {
                                                logger.error("remote instance with id " + remoteInstance.id +
                                                    " failed to bind to user " + createdUser.name);
                                            }
                                        });
                                }
                            } else {
                                logger.info("empty remote instances for mobile_id " + mobileID);
                            }
                        });
                    callback(createUserErr, createdUser);
                } else {
                    callback(createUserErr, null);
                }
            });
        }
    });
};

exports.bindMobileToUserWorkUnit = function (mobileID, snsID, snsType, callback) {
    var newMobileUser = {
        mobile_id: mobileID,
        weixin_id: snsID,
        sns_type: snsType
    };

    var conditions = {
        mobile_id: mobileID,
        weixin_id: snsID,
        sns_type: snsType,
        status: enums.ITEM_VALID
    };
    MobileUser.findMobileUsersByConditions(conditions, function(findMobileUserErr, mobileUsers) {
        if (errorCode.SUCCESS.code == findMobileUserErr.code &&
            null != mobileUsers &&
            mobileUsers.length > 0) {
            logger.info("mobile users found : " + mobileUsers.length + ", update it");
            var mobileUser = mobileUsers[0];
            MobileUser.updateMobileUserByID(mobileUser.id, newMobileUser,
                function(updateMobileUserErr, updatedMobileUser) {
                    callback(updateMobileUserErr, updatedMobileUser);
                });
        } else {
            logger.info("no mobile users are found, create new one");
            MobileUser.createMobileUser(newMobileUser, function(createMobileUserErr, createdMobileUser) {
                callback(createMobileUserErr, createdMobileUser);
            });
        }
    });
};

exports.listUsersWorkUnit = function (from, count, isTest, UA, callback) {
    var conditions = null;

    User.listUsers(conditions, from, count, "id", function(listUserErr, users) {
        callback(listUserErr, users);
    });
};

exports.getUserByIDWorkUnit = function (userID, callback) {
    User.getUserByID(userID, function(getUserByIDErr, user) {
        callback(getUserByIDErr, user);
    });
};

exports.getUserByWeixinIDWorkUnit = function (weixinID, callback) {
    var conditions = {
        weixin_id: weixinID,
        status: enums.ITEM_VALID
    };
    User.findUserByConditions(conditions, function(findUserErr, users) {
        if (errorCode.SUCCESS.code == findUserErr.code && null != users && users.length > 0) {
            callback(findUserErr, users[0]);
        } else {
            callback(errorCode.FAILED, null);
        }
    });
};

exports.getWeixinShareWordingWorkUnit = function(UA, mobileID, userOpenID, userName, callback) {
    var conditions = null;
    var remoteCount = 0;
    var deviceInstanceCount = 0;
    var countRemoteConditions = null;
    var lang = enums.LANGUAGE_CN;
    var weixinShareWording = new Object();
    var retUserName = "";

    if (undefined == userName || null == userName || userName == "") {
        retUserName = "我";
    } else {
        retUserName = userName;
    }

    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    conditions = {
        mobile_id: mobileID,
        status: enums.ITEM_VALID
    };

    // get remote statistics
    RemoteInstance.findRemoteInstancesByCondition(conditions, function(findRemoteInstanceErr, remoteInstances) {
        if (errorCode.SUCCESS.code == findRemoteInstanceErr.code &&
            null != remoteInstances &&
            remoteInstances.length > 0) {
            async.eachSeries(remoteInstances, function (remoteInstance, innerCallback) {
                var id = remoteInstance.id;
                countRemoteConditions = {
                    remote_instance_id: id,
                    status: enums.ITEM_VALID
                };
                Remote.countRemotesByConditions(countRemoteConditions, function(countRemoteErr, count) {
                    if (errorCode.SUCCESS.code == countRemoteErr.code) {
                        remoteCount += count;
                        innerCallback();
                    } else {
                        innerCallback();
                    }
                })
            }, function (err) {
                // get device statistics
                // handle language
                if (lang == enums.LANGUAGE_EN) {
                    weixinShareWording.title = "I have got an UCON";
                    weixinShareWording.description = retUserName + " has got " + remoteCount +
                        " household appliances controlled by UCON";
                } else if (lang == enums.LANGUAGE_TW) {
                    weixinShareWording.title = "我正在使用UCON";
                    weixinShareWording.description = retUserName + "已經成功使用UCON控制了" + remoteCount + "個家用電器";
                } else {
                    weixinShareWording.title = "我正在使用UCON";
                    weixinShareWording.description = retUserName + "已经成功使用UCON控制了" + remoteCount + "个家用电器";
                }
                callback(errorCode.SUCCESS, weixinShareWording);
            });
        } else {
            if (lang == enums.LANGUAGE_EN) {
                weixinShareWording.title = "I have got an UCON";
                weixinShareWording.description = retUserName + " has got " + remoteCount +
                    " household appliances controlled by UCON";
            } else if (lang == enums.LANGUAGE_TW) {
                weixinShareWording.title = "我正在使用UCON";
                weixinShareWording.description = retUserName + "已經成功使用UCON控制了" + remoteCount + "個家用電器";
            } else {
                weixinShareWording.title = "我正在使用UCON";
                weixinShareWording.description = retUserName + "已经成功使用UCON控制了" + remoteCount + "个家用电器";
            }
            callback(errorCode.SUCCESS, weixinShareWording);
        }
    });
};

exports.getWeixinUserStatWorkUnit = function(mobileID, userOpenID, callback) {
    var conditions = null;
    var deviceInstanceCount = 0;
    var getRemoteConditions = null;
    var remoteList = [];
    var weixinUserStat = new Object();

    conditions = {
        mobile_id: mobileID,
        status: enums.ITEM_VALID
    };

    // get remote statistics
    RemoteInstance.findRemoteInstancesByCondition(conditions, function(findRemoteInstanceErr, remoteInstances) {
        if (errorCode.SUCCESS.code == findRemoteInstanceErr.code &&
            null != remoteInstances &&
            remoteInstances.length > 0) {
            logger.info("remote instance count = " + remoteInstances.length);
            remoteList = new Array();
            async.eachSeries(remoteInstances, function (remoteInstance, innerCallback) {
                var id = remoteInstance.id;
                getRemoteConditions = {
                    remote_instance_id: id,
                    status: enums.ITEM_VALID
                };
                Remote.listRemotes(getRemoteConditions, 0, 100, "id", function(listRemoteErr, remotes) {
                    if (errorCode.SUCCESS.code == listRemoteErr.code && null != remotes) {
                        logger.info("remotes = " + remotes.length);

                        for (var i = 0; i < remotes.length; i++) {
                            remoteList.push(remotes[i]);
                        }

                        logger.info("remoteList count = " + remoteList.length);
                        innerCallback();
                    } else {
                        logger.info("remotes list is empty");
                        innerCallback();
                    }
                })
            }, function (err) {
                DeviceInstance.listDeviceInstances(conditions, 0, 100, "id",
                    function(listDeviceInstanceErr, deviceInstances) {
                        if (null != listDeviceInstanceErr && null != deviceInstances && deviceInstances.length > 0) {
                            deviceInstanceCount = deviceInstances.length;
                        }
                        weixinUserStat.remoteList = remoteList;
                        weixinUserStat.deviceInstanceCount = deviceInstanceCount;
                        callback(errorCode.SUCCESS, weixinUserStat);
                    });
            });
        } else {
            callback(errorCode.SUCCESS, null);
        }
    });
};