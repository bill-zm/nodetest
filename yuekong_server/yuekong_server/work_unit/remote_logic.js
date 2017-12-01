/**
 * Created by strawmanbobi
 * 2015-02-04
 */

require('../../../Infrastructure/BackEnd/configuration/constants');

var RemoteIndex = require('../model/remote_index_dao.js');
var RemoteIndexII = require('../model/remote_index_ii_dao.js');
var Remote = require('../model/remote_dao.js');
var RemoteInstance = require('../model/remote_instance_dao.js');
var DeviceAuth = require('../authority/device_auth.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var async = require('async');

var enums = new Enums();
var errorCode = new ErrorCode();
var deviceAuth = new DeviceAuth(MEMCACHED_HOST, MEMCACHED_PORT, MEMCACHED_SASL_USER, MEMCACHED_SASL_PASSWORD);

exports.createRemoteInstanceWorkUnit = function (remoteInstance, callback) {
    var conditions = null;
    if (undefined != remoteInstance.user_id && null != remoteInstance.user_id) {
        conditions = {
            user_id: remoteInstance.user_id,
            rsn: remoteInstance.rsn,
            status: enums.ITEM_VALID
        };
    } else {
        conditions = {
            mobile_id: remoteInstance.mobile_id,
            rsn: remoteInstance.rsn,
            status: enums.ITEM_VALID
        };
    }

    RemoteInstance.findRemoteInstancesByCondition(conditions, function(findRemoteInstanceErr, remoteInstances) {
        if(errorCode.SUCCESS.code == findRemoteInstanceErr.code &&
            remoteInstances &&
            remoteInstances.length > 0) {
            var remoteInstanceID = remoteInstances[0].id;
            logger.info("this remote instance already exists, update it with new properties");
            RemoteInstance.updateRemoteInstanceByID(remoteInstanceID, remoteInstance,
                function(updateRemoteInstanceErr, updatedRemoteInstance) {
                    callback(updateRemoteInstanceErr, updatedRemoteInstance);
                });
        } else {
            logger.info("this remote instance does not exist, create a new one");
            RemoteInstance.createRemoteInstance(remoteInstance,
            function(createRemoteInstanceErr, createdRemoteInstance) {
                callback(createRemoteInstanceErr, createdRemoteInstance);
            });
        }
    });
};

exports.listRemoteInstancesWorkUnit = function (mobileID, callback) {
    var conditions = {
        mobile_id: mobileID,
        status: enums.ITEM_VALID
    };
    RemoteInstance.findRemoteInstancesByCondition(conditions, function(findRemoteInstancesErr, remoteInstances) {
        if(errorCode.SUCCESS.code == findRemoteInstancesErr.code) {
            callback(findRemoteInstancesErr, remoteInstances);
        } else {
            callback(errorCode.REMOTE_INSTANCE_NOT_FOUND, null);
        }
    });
};

exports.resetRemoteInstanceWorkUnit = function (remoteInstanceID, callback) {
    var conditions = {
        remote_instance_id: remoteInstanceID
    };

    // remove remote first and then remote instance
    Remote.findRemotesByConditions(conditions, function(findRemoteErr, remotes) {
        if(errorCode.SUCCESS.code != findRemoteErr.code) {
            callback(findRemoteErr);
        } else {
            async.eachSeries(remotes, function (remote, innerCallback) {
                remote.status = enums.ITEM_INVALID;
                Remote.deleteRemoteByID(remote.id, function(deleteRemoteErr) {
                    if(deleteRemoteErr.code == errorCode.SUCCESS.code) {
                        logger.info("delete remote successfully");
                        innerCallback();
                    } else {
                        // do not give up going through all the remotes in certain remote_instance
                        logger.info("delete remote failed");
                        innerCallback();
                    }
                });
            }, function (err) {
                // remove remote instance anyway
                RemoteInstance.deleteRemoteInstanceByID(remoteInstanceID, function(deleteRemoteInstanceErr) {
                    callback(deleteRemoteInstanceErr);
                });
            });
        }
    });
};

exports.renameRemoteInstanceWorkUnit = function (remoteInstanceID, newName, newRemoteInstance, callback) {
    if (null == newRemoteInstance) {
        logger.info("new remote instance is empty, set a new one with name");
        newRemoteInstance = {
            name: newName
        };
    }
    logger.info("change name of object : " + JSON.stringify(newRemoteInstance));

    RemoteInstance.updateRemoteInstanceByID(remoteInstanceID, newRemoteInstance, function(updateRemoteInstanceErr) {
        if (errorCode.SUCCESS.code == updateRemoteInstanceErr.code) {
            callback(updateRemoteInstanceErr);
        } else {
            callback(updateRemoteInstanceErr);
        }
    });
};

exports.updateRemoteInstanceWorkUnit = function (remoteInstanceID, newRemoteInstance, callback) {
    RemoteInstance.updateRemoteInstanceByID(remoteInstanceID, newRemoteInstance,
        function(updateRemoteInstanceErr, updatedRemoteInstance) {
        if (errorCode.SUCCESS.code == updateRemoteInstanceErr.code) {
            callback(updateRemoteInstanceErr, updatedRemoteInstance);
        } else {
            callback(updateRemoteInstanceErr, updatedRemoteInstance);
        }
    });
};

exports.createRemoteWorkUnit = function(remote, callback) {
    var conditions = {
        remote_number: remote.remote_number,
        remote_instance_id: remote.remote_instance_id,
        // rsn: remote.rsn,
        status: enums.ITEM_VALID
    };
    Remote.findRemotesByConditions(conditions, function(findRemoteErr, remotes) {
        if(errorCode.SUCCESS.code == findRemoteErr.code &&
            remotes && remotes.length > 0) {
            logger.info("remote of instance ID " + remote.remote_instance_id + ", " + remote.remote_number + " already exists");
            callback(findRemoteErr, remotes[0]);
        } else {
            logger.info("remote of instance ID " + remote.remote_instance_id + ", " + remote.remote_number + " does not exist");
            Remote.createRemote(remote, function(createRemoteErr, createdRemote) {
                callback(createRemoteErr, createdRemote);
            });
        }
    });
};

exports.createSiriusRemoteWorkUnit = function(remote, callback) {
    Remote.createRemote(remote, function(createRemoteErr, createdRemote) {
        callback(createRemoteErr, createdRemote);
    });
};

exports.bindRemoteInstanceWorkUnit = function(remoteInstanceID, pdsn, callback) {
    var newRemoteInstance = {
        device_pdsn: pdsn,
        is_bound: enums.REMOTE_BOUND
    };
    RemoteInstance.updateRemoteInstanceByID(remoteInstanceID, newRemoteInstance,
        function(updateRemoteInstanceErr, updatedRemoteInstance) {
            callback(updateRemoteInstanceErr);
    });
};

exports.deleteRemoteWorkUnit = function (remoteID, callback) {
    Remote.deleteRemoteByID(remoteID, function(deleteRemoteErr) {
        callback(deleteRemoteErr);
    });
};

exports.updateRemoteWorkUnit = function(remoteID, newRemote, callback) {
    Remote.updateRemoteByID(remoteID, newRemote, function(updateRemoteErr, updatedRemote) {
        callback(updateRemoteErr, updatedRemote);
    });
};

/*
exports.updateRemoteWorkUnit = function (pdsn, token, mobileID, remoteInstanceName, isBound, userOpenID, userName,
                                         remote, callback) {
    var remoteInstanceID = null;
    if(null != pdsn && null != token) {
        // condition of remote-device pair
        var key = "device_" + pdsn;
        var conditions = null;
        deviceAuth.validateAuthInfo(key, token, function(validateDeviceAuthErr) {
            if(errorCode.SUCCESS.code == validateDeviceAuthErr.code) {
                // to check whether the remote instance of certain RSN does exist
                conditions = {
                    rsn: remote.rsn,
                    mobile_id: mobileID,
                    status: enums.ITEM_VALID
                };
                RemoteInstance.findRemoteInstancesByCondition(conditions,
                    function(findRemoteInstancesErr, remoteInstances) {
                        if(errorCode.SUCCESS.code == findRemoteInstancesErr.code &&
                            null != remoteInstances && remoteInstances.length > 0) {
                            // remote instance exists, directly create remote
                            if(remote && remote.id) {
                                // this remote might already exist, only update fields for it
                                remote.remote_instance_id = remoteInstances[0].id;
                                remote.rsn = remoteInstances[0].rsn;
                                remoteInstanceID = remoteInstances[0].id;
                                Remote.getRemoteByID(remote.id, function(getRemoteErr, getRemote) {
                                    if(errorCode.SUCCESS.code == getRemoteErr.code && getRemote) {
                                        Remote.updateRemoteByID(getRemote.id, remote,
                                        function(updateRemoteErr, updatedRemote) {
                                            callback(updateRemoteErr, updatedRemote);
                                        });
                                    } else {
                                        // this remote does not exist actually, create a new one
                                        Remote.createRemote(remote, remoteInstanceID, function(createRemoteErr, createdRemote) {
                                            callback(createRemoteErr, createdRemote);
                                        });
                                    }
                                });
                            } else {
                                if(remote) {
                                    // this might be a new remote to be registered
                                    Remote.createRemote(remote, remoteInstanceID, function(createRemoteErr, createdRemote) {
                                        callback(createRemoteErr, createdRemote);
                                    });
                                } else {
                                    callback(errorCode.FAILED, null);
                                }
                            }
                        } else {
                            // remote instance does not exist, create remote instance first
                            var remoteInstance = {
                                name: remoteInstanceName,
                                rsn: remote.rsn,
                                is_bound: isBound,
                                mobile_id: mobileID,
                                user_open_id: userOpenID,
                                user_name: userName,
                                mac_address: remote.mac_address
                            };
                            RemoteInstance.createRemoteInstance(remoteInstance,
                            function(createRemoteInstanceErr, createdRemoteInstance) {
                                if(errorCode.SUCCESS.code == createRemoteInstanceErr.code) {
                                    remoteInstanceID = createdRemoteInstance.id;
                                    logger.info("create remote instance successfully");
                                    if(remote && remote.id) {
                                        // this remote might already exist, only update fields for it
                                        remote.remote_instance_id = createdRemoteInstance.id;
                                        Remote.getRemoteByID(remote.id, function(getRemoteErr, getRemote) {
                                            if(errorCode.SUCCESS.code == getRemoteErr.code && getRemote) {
                                                Remote.updateRemoteByID(getRemote.id, remote,
                                                function(updateRemoteErr, updatedRemote) {
                                                    callback(updateRemoteErr, updatedRemote);
                                                });
                                            } else {
                                                // this remote does not exist actually, create a new one
                                                Remote.createRemote(remote, remoteInstanceID,
                                                function(createRemoteErr, createdRemote) {
                                                    callback(createRemoteErr, createdRemote);
                                                });
                                            }
                                        });
                                    } else {
                                        if(remote) {
                                            // this might be a new remote to be registered
                                            Remote.createRemote(remote, remoteInstanceID,
                                            function(createRemoteErr, createdRemote) {
                                                callback(createRemoteErr, createdRemote);
                                            });
                                        } else {
                                            callback(errorCode.FAILED, null);
                                        }
                                    }
                                } else {
                                    callback(createRemoteInstanceErr, null);
                                }
                            });
                        }
                    });
            } else {
                callback(validateDeviceAuthErr, null);
            }
        });
    } else {
        // to check whether the remote instance of certain RSN does exist
        conditions = {
            rsn: remote.rsn,
            mobile_id: mobileID,
            status: enums.ITEM_VALID
        };
        RemoteInstance.findRemoteInstancesByCondition(conditions,
        function(findRemoteInstancesErr, remoteInstances) {
            if(errorCode.SUCCESS.code == findRemoteInstancesErr.code &&
                null != remoteInstances && remoteInstances.length > 0) {
                logger.info("single remote mode, remote instance already exist");
                remoteInstanceID = remoteInstances[0].id;
                // remote instance exists, directly create remote
                if(remote && remote.id) {
                    // this remote might already exist, only update fields for it
                    remote.remote_instance_id = remoteInstances[0].id;
                    remote.rsn = remoteInstances[0].rsn;
                    Remote.getRemoteByID(remote.id, function(getRemoteErr, getRemote) {
                        if(errorCode.SUCCESS.code == getRemoteErr.code && getRemote) {
                            Remote.updateRemoteByID(getRemote.id, remote,
                                function(updateRemoteErr, updatedRemote) {
                                    callback(updateRemoteErr, updatedRemote);
                                });
                        } else {
                            // this remote does not exist actually, create a new one
                            Remote.createRemote(remote, remoteInstanceID, function(createRemoteErr, createdRemote) {
                                callback(createRemoteErr, createdRemote);
                            });
                        }
                    });
                } else {
                    if(remote) {
                        // this might be a new remote to be registered
                        Remote.createRemote(remote, remoteInstanceID, function(createRemoteErr, createdRemote) {
                            callback(createRemoteErr, createdRemote);
                        });
                    } else {
                        callback(errorCode.FAILED, null);
                    }
                }
            } else {
                logger.info("single remote mode, remote instance does not exist");
                // remote instance does not exist, create remote instance first
                var remoteInstance = {
                    name: remoteInstanceName,
                    rsn: remote.rsn,
                    is_bound: isBound,
                    mobile_id: mobileID,
                    user_open_id: userOpenID,
                    user_name: userName,
                    mac_address: remote.mac_address
                };
                RemoteInstance.createRemoteInstance(remoteInstance,
                function(createRemoteInstanceErr, createdRemoteInstance) {
                    if(errorCode.SUCCESS.code == createRemoteInstanceErr.code) {
                        logger.info("create remote instance successfully");
                        remoteInstanceID = createdRemoteInstance.id;
                        if(remote && remote.id) {
                            // this remote might already exist, only update fields for it
                            remote.remote_instance_id = createdRemoteInstance.id;
                            Remote.getRemoteByID(remote.id, function(getRemoteErr, getRemote) {
                                if(errorCode.SUCCESS.code == getRemoteErr.code && getRemote) {
                                    Remote.updateRemoteByID(getRemote.id, remote,
                                    function(updateRemoteErr, updatedRemote) {
                                        callback(updateRemoteErr, updatedRemote);
                                    });
                                } else {
                                    // this remote does not exist actually, create a new one
                                    Remote.createRemote(remote, remoteInstanceID,
                                    function(createRemoteErr, createdRemote) {
                                        callback(createRemoteErr, createdRemote);
                                    });
                                }
                            });
                        } else {
                            if(remote) {
                                // this might be a new remote to be registered
                                Remote.createRemote(remote, remoteInstanceID,
                                function(createRemoteErr, createdRemote) {
                                    callback(createRemoteErr, createdRemote);
                                });
                            } else {
                                callback(errorCode.FAILED, null);
                            }
                        }
                    } else {
                        callback(createRemoteInstanceErr, null);
                    }
                });
            }
        });
    }
};
*/

exports.listRemotesWorkUnit = function (remoteInstanceID, from, count, callback) {
    var retRemotes = [];
    /*
    var conditions = {
        remote_instance_id: remoteInstanceID,
        status: enums.ITEM_VALID
    };
    */
    // Remote.listRemotes(conditions, from, count, "remote_number", function(listRemotesErr, remotes) {
    Remote.listRemotesByInstance(remoteInstanceID, from, count, "remote_number", function(listRemotesErr, remotes) {
        if(errorCode.SUCCESS.code == listRemotesErr.code &&
            null != remotes && remotes.length > 0) {

            async.eachSeries(remotes, function (remote, innerCallback) {
                var retRemote = new Object();
                for (var p in remote) {
                    // protect radio type for remotes
                    if (null == remote.radio_type) {
                        remote.radio_type = 0;
                    }

                    if (null != remote[p]) {
                        retRemote[p] = remote[p];
                    }
                }
                if (remote.remote_index_id != 0) {
                    // continue fetch applied and banned version interval using promise
                    RemoteIndexII.getRemoteIndexByID(remote.remote_index_id, function(getRemoteIndexErr, remoteIndex) {
                        if (errorCode.SUCCESS.code == getRemoteIndexErr.code && null != remoteIndex) {
                            retRemote.applied_remote_version = remoteIndex.applied_remote_version;
                            retRemote.banned_remote_version = remoteIndex.banned_remote_version;
                            retRemote.applied_device_version = remoteIndex.applied_device_version;
                            retRemote.banned_device_version = remoteIndex.banned_device_version;
                            retRemote.sub_cate = remoteIndex.sub_cate;
                        } else {
                            retRemote.applied_remote_version = "V0.0.0";
                            retRemote.banned_remote_version = "V0.0.0";
                            retRemote.applied_device_version = "V0.0.0";
                            retRemote.banned_device_version = "V0.0.0";
                            retRemote.sub_cate = 1;
                        }
                        retRemotes.push(retRemote);
                        innerCallback();
                    });
                } else {
                    retRemote.applied_remote_version = "V0.0.0";
                    retRemote.banned_remote_version = "V0.0.0";
                    retRemote.applied_device_version = "V0.0.0";
                    retRemote.banned_device_version = "V0.0.0";
                    retRemote.sub_cate = 1;
                    retRemotes.push(retRemote);
                    innerCallback();
                }
            }, function (err) {
                callback(errorCode.SUCCESS, retRemotes);
            });
        } else {
            callback(errorCode.REMOTE_NOT_FOUND, null);
        }
    });
};

exports.listRemotesByRoomWorkUnit = function (siriusID, roomID, from, count, callback) {
    var retRemotes = [];
    var conditions = {
        sirius_id: siriusID,
        room_id: roomID,
        status: enums.ITEM_VALID
    };
    Remote.listRemotes(conditions, from, count, "id", function(listRemotesErr, remotes) {
        if(errorCode.SUCCESS.code == listRemotesErr.code &&
            null != remotes && remotes.length > 0) {

            async.eachSeries(remotes, function (remote, innerCallback) {
                var retRemote = new Object();
                for (var p in remote) {
                    // protect radio type for remotes
                    if (null == remote.radio_type) {
                        remote.radio_type = 0;
                    }

                    if (null != remote[p]) {
                        retRemote[p] = remote[p];
                    }
                }
                // WARNING WARNING:
                // issues might occur while any instance remote_index_ii does not exist however the corresponding
                // remote mapping to it.
                if (remote.remote_index_id != 0) {
                    logger.info("get companion remote index info by id = " + remote.remote_index_id);
                    // continue fetch applied and banned version interval using promise
                    RemoteIndexII.getRemoteIndexByID(remote.remote_index_id, function(getRemoteIndexErr, remoteIndex) {
                        if (errorCode.SUCCESS.code == getRemoteIndexErr.code && null != remoteIndex) {
                            retRemote.applied_remote_version = remoteIndex.applied_remote_version;
                            retRemote.banned_remote_version = remoteIndex.banned_remote_version;
                            retRemote.applied_device_version = remoteIndex.applied_device_version;
                            retRemote.banned_device_version = remoteIndex.banned_device_version;
                            retRemote.sub_cate = remoteIndex.sub_cate;

                            // protocol and remote member for Sirius
                            retRemote.protocol = remoteIndex.protocol;
                            retRemote.remote = remoteIndex.remote;
                        } else {
                            retRemote.applied_remote_version = "V0.0.0";
                            retRemote.banned_remote_version = "V0.0.0";
                            retRemote.applied_device_version = "V0.0.0";
                            retRemote.banned_device_version = "V0.0.0";
                            retRemote.sub_cate = 1;

                            // protocol and remote member for Sirius
                            logger.error("remote_index get error");
                            retRemote.protocol = "_incorrect";
                            retRemote.remote = "_remote";
                        }

                        retRemotes.push(retRemote);
                        innerCallback();
                    });
                } else {
                    logger.error("remote_index_id is empty");
                    retRemote.applied_remote_version = "V0.0.0";
                    retRemote.banned_remote_version = "V0.0.0";
                    retRemote.applied_device_version = "V0.0.0";
                    retRemote.banned_device_version = "V0.0.0";
                    retRemote.sub_cate = 1;

                    // protocol and remote member for Sirius
                    retRemote.protocol = "_incorrect";
                    retRemote.remote = "_remote";
                    retRemotes.push(retRemote);
                    innerCallback();
                }
            }, function (err) {
                callback(errorCode.SUCCESS, retRemotes);
            });
        } else {
            callback(errorCode.REMOTE_NOT_FOUND, null);
        }
    });
};

exports.listRemotesByRoomAndCategoryWorkUnit = function (siriusID, roomID, categoryID, from, count, callback) {
    var retRemotes = [];
    var conditions = {
        sirius_id: siriusID,
        room_id: roomID,
        category_id: categoryID,
        status: enums.ITEM_VALID
    };
    Remote.listRemotes(conditions, from, count, "id", function(listRemotesErr, remotes) {
        if(errorCode.SUCCESS.code == listRemotesErr.code &&
            null != remotes && remotes.length > 0) {

            async.eachSeries(remotes, function (remote, innerCallback) {
                var retRemote = new Object();
                for (var p in remote) {
                    // protect radio type for remotes
                    if (null == remote.radio_type) {
                        remote.radio_type = 0;
                    }

                    if (null != remote[p]) {
                        retRemote[p] = remote[p];
                    }
                }
                // WARNING WARNING:
                // issues might occur while any instance remote_index_ii does not exist however the corresponding
                // remote mapping to it.
                if (remote.remote_index_id != 0) {
                    logger.info("get companion remote index info by id = " + remote.remote_index_id);
                    // continue fetch applied and banned version interval using promise
                    RemoteIndexII.getRemoteIndexByID(remote.remote_index_id, function(getRemoteIndexErr, remoteIndex) {
                        if (errorCode.SUCCESS.code == getRemoteIndexErr.code && null != remoteIndex) {
                            retRemote.applied_remote_version = remoteIndex.applied_remote_version;
                            retRemote.banned_remote_version = remoteIndex.banned_remote_version;
                            retRemote.applied_device_version = remoteIndex.applied_device_version;
                            retRemote.banned_device_version = remoteIndex.banned_device_version;
                            retRemote.sub_cate = remoteIndex.sub_cate;

                            // protocol and remote member for Sirius
                            retRemote.protocol = remoteIndex.protocol;
                            retRemote.remote = remoteIndex.remote;
                        } else {
                            retRemote.applied_remote_version = "V0.0.0";
                            retRemote.banned_remote_version = "V0.0.0";
                            retRemote.applied_device_version = "V0.0.0";
                            retRemote.banned_device_version = "V0.0.0";
                            retRemote.sub_cate = 1;

                            // protocol and remote member for Sirius
                            logger.error("remote_index get error");
                            retRemote.protocol = "_incorrect";
                            retRemote.remote = "_remote";
                        }

                        retRemotes.push(retRemote);
                        innerCallback();
                    });
                } else {
                    logger.error("remote_index_id is empty");
                    retRemote.applied_remote_version = "V0.0.0";
                    retRemote.banned_remote_version = "V0.0.0";
                    retRemote.applied_device_version = "V0.0.0";
                    retRemote.banned_device_version = "V0.0.0";
                    retRemote.sub_cate = 1;

                    // protocol and remote member for Sirius
                    retRemote.protocol = "_incorrect";
                    retRemote.remote = "_remote";
                    retRemotes.push(retRemote);
                    innerCallback();
                }
            }, function (err) {
                callback(errorCode.SUCCESS, retRemotes);
            });
        } else {
            callback(errorCode.REMOTE_NOT_FOUND, null);
        }
    });
};

exports.listRemotesBySiriusIDWorkUnit = function (siriusID, from, count, callback) {
    var retRemotes = [];
    var whereClause = "sirius_id = '" + siriusID + "' AND status = " + enums.ITEM_VALID;
    var orderByClause = "room_id, id ASC";
    var limitClause = from + ", " + count;
    Remote.listRemotesRaw(whereClause, orderByClause, limitClause, function(listRemotesErr, remotes) {
        if(errorCode.SUCCESS.code == listRemotesErr.code &&
            null != remotes && remotes.length > 0) {

            async.eachSeries(remotes, function (remote, innerCallback) {
                var retRemote = new Object();
                for (var p in remote) {
                    // protect radio type for remotes
                    if (null == remote.radio_type) {
                        remote.radio_type = 0;
                    }

                    if (null != remote[p]) {
                        retRemote[p] = remote[p];
                    }
                }
                // WARNING WARNING:
                // issues might occur while any instance remote_index_ii does not exist however the corresponding
                // remote mapping to it.
                if (remote.remote_index_id != 0) {
                    logger.info("get companion remote index info by id = " + remote.remote_index_id);
                    // continue fetch applied and banned version interval using promise
                    RemoteIndexII.getRemoteIndexByID(remote.remote_index_id, function(getRemoteIndexErr, remoteIndex) {
                        if (errorCode.SUCCESS.code == getRemoteIndexErr.code && null != remoteIndex) {
                            retRemote.applied_remote_version = remoteIndex.applied_remote_version;
                            retRemote.banned_remote_version = remoteIndex.banned_remote_version;
                            retRemote.applied_device_version = remoteIndex.applied_device_version;
                            retRemote.banned_device_version = remoteIndex.banned_device_version;
                            retRemote.sub_cate = remoteIndex.sub_cate;

                            // protocol and remote member for Sirius
                            retRemote.protocol = remoteIndex.protocol;
                            retRemote.remote = remoteIndex.remote;
                        } else {
                            retRemote.applied_remote_version = "V0.0.0";
                            retRemote.banned_remote_version = "V0.0.0";
                            retRemote.applied_device_version = "V0.0.0";
                            retRemote.banned_device_version = "V0.0.0";
                            retRemote.sub_cate = 1;

                            // protocol and remote member for Sirius
                            logger.error("remote_index get error");
                            retRemote.protocol = "_incorrect";
                            retRemote.remote = "_remote";
                        }

                        retRemotes.push(retRemote);
                        innerCallback();
                    });
                } else {
                    logger.error("remote_index_id is empty");
                    retRemote.applied_remote_version = "V0.0.0";
                    retRemote.banned_remote_version = "V0.0.0";
                    retRemote.applied_device_version = "V0.0.0";
                    retRemote.banned_device_version = "V0.0.0";
                    retRemote.sub_cate = 1;

                    // protocol and remote member for Sirius
                    retRemote.protocol = "_incorrect";
                    retRemote.remote = "_remote";
                    retRemotes.push(retRemote);
                    innerCallback();
                }
            }, function (err) {
                callback(errorCode.SUCCESS, retRemotes);
            });
        } else {
            callback(errorCode.REMOTE_NOT_FOUND, null);
        }
    });
};

exports.listStbRemotesBySiriusIDWorkUnit = function (siriusID, from, count, callback) {
    var retRemotes = [];

    // currently only set filter category_id = 3, and 5 as well, later
    var whereClause = "sirius_id = '" + siriusID + "' AND category_id = 3 AND status = " + enums.ITEM_VALID;
    var orderByClause = "room_id, id ASC";
    var limitClause = from + ", " + count;
    Remote.listRemotesRaw(whereClause, orderByClause, limitClause, function(listRemotesErr, remotes) {
        if(errorCode.SUCCESS.code == listRemotesErr.code &&
            null != remotes && remotes.length > 0) {

            async.eachSeries(remotes, function (remote, innerCallback) {
                var retRemote = new Object();
                for (var p in remote) {
                    // protect radio type for remotes
                    if (null == remote.radio_type) {
                        remote.radio_type = 0;
                    }

                    if (null != remote[p]) {
                        retRemote[p] = remote[p];
                    }
                }
                // WARNING WARNING:
                // issues might occur while any instance remote_index_ii does not exist however the corresponding
                // remote mapping to it.
                if (remote.remote_index_id != 0) {
                    logger.info("get companion remote index info by id = " + remote.remote_index_id);
                    // continue fetch applied and banned version interval using promise
                    RemoteIndexII.getRemoteIndexByID(remote.remote_index_id, function(getRemoteIndexErr, remoteIndex) {
                        if (errorCode.SUCCESS.code == getRemoteIndexErr.code && null != remoteIndex) {
                            retRemote.applied_remote_version = remoteIndex.applied_remote_version;
                            retRemote.banned_remote_version = remoteIndex.banned_remote_version;
                            retRemote.applied_device_version = remoteIndex.applied_device_version;
                            retRemote.banned_device_version = remoteIndex.banned_device_version;
                            retRemote.sub_cate = remoteIndex.sub_cate;

                            // protocol and remote member for Sirius
                            retRemote.protocol = remoteIndex.protocol;
                            retRemote.remote = remoteIndex.remote;

                            // operator_id for Stb remotes
                            retRemote.operator_id = remoteIndex.operator_id;
                        } else {
                            retRemote.applied_remote_version = "V0.0.0";
                            retRemote.banned_remote_version = "V0.0.0";
                            retRemote.applied_device_version = "V0.0.0";
                            retRemote.banned_device_version = "V0.0.0";
                            retRemote.sub_cate = 1;

                            // protocol and remote member for Sirius
                            logger.error("remote_index get error");
                            retRemote.protocol = "_incorrect";
                            retRemote.remote = "_remote";

                            // operator_id for Stb remotes
                            retRemote.operator_id = "incorrect";
                        }

                        retRemotes.push(retRemote);
                        innerCallback();
                    });
                } else {
                    logger.error("remote_index_id is empty");
                    retRemote.applied_remote_version = "V0.0.0";
                    retRemote.banned_remote_version = "V0.0.0";
                    retRemote.applied_device_version = "V0.0.0";
                    retRemote.banned_device_version = "V0.0.0";
                    retRemote.sub_cate = 1;

                    // protocol and remote member for Sirius
                    retRemote.protocol = "_incorrect";
                    retRemote.remote = "_remote";
                    // operator_id for Stb remotes
                    retRemote.operator_id = "incorrect";

                    retRemotes.push(retRemote);
                    innerCallback();
                }
            }, function (err) {
                callback(errorCode.SUCCESS, retRemotes);
            });
        } else {
            callback(errorCode.REMOTE_NOT_FOUND, null);
        }
    });
};

exports.getRemoteInfoWorkUnit = function (remoteID, binaryVersion, callback) {
    var remoteInfo = new Object();
    // distinguish remote index version via polymorphism
    var virtualRemoteIndex = null;

    /* compatibility consideration */
    if(null != binaryVersion && undefined != binaryVersion && binaryVersion == "2") {
        virtualRemoteIndex = RemoteIndexII;
    } else {
        virtualRemoteIndex = RemoteIndex;
    }
    Remote.getRemoteByID(remoteID, function(getRemoteErr, remote) {
        if(errorCode.SUCCESS.code == getRemoteErr.code && remote) {
            if(remote.status == enums.ITEM_VALID && remote.category_id) {
                var remoteIndexID = remote.remote_index_id;
                logger.info("remote index ID = " + remoteIndexID);
                virtualRemoteIndex.getRemoteIndexByID(remoteIndexID, function(getRemoteIndexErr, remoteIndex) {
                    if(errorCode.SUCCESS.code == getRemoteIndexErr.code && remoteIndex) {
                        remoteInfo.remote_id = remote.id;
                        remoteInfo.protocol = remoteIndex.protocol;
                        remoteInfo.remote = remoteIndex.remote;

                        logger.info("get remote index successfully");
                        callback(getRemoteIndexErr, remoteInfo);
                    } else {
                        logger.info("get remote index failed");
                        callback(errorCode.FAILED, null);
                    }
                });
            } else {
                callback(errorCode.REMOTE_INFO_NOT_FETCHED, null);
            }
        } else {
            logger.info("get remote failed");
            callback(errorCode.FAILED, null);
        }
    });
};