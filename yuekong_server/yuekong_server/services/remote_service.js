/**
 * Created by strawmanbobi
 * 2015-01-25.
 */

require('../../../Infrastructure/BackEnd/configuration/constants');

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var RemoteResponse = require('../response/remote_response.js');
var RemoteInstanceResponse = require('../response/remote_instance_response.js');
var SingleRemoteInstanceResponse = require('../response/single_remote_instance_response.js');
var SingleRemoteResponse = require('../response/single_remote_response.js');
var RemoteInfoResponse = require('../response/remote_info_response.js');
var SingleRemoteRelationshipResponse = require('../response/single_remote_relationship_response.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var remoteLogic = require('../work_unit/remote_logic.js');
var remoteRelationshipLogic = require('../work_unit/remote_relationship_logic.js');
var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Create remote instance
 * parameter :  remote instance
 * return :     RemoteResponse
 */
exports.createRemoteInstance = function (req, res) {
    var remoteInstance = req.body;

    var singleRemoteInstanceResponse = new SingleRemoteInstanceResponse();
    remoteLogic.createRemoteInstanceWorkUnit(remoteInstance,
        function(createRemoteInstanceErr, createdRemoteInstance) {
            singleRemoteInstanceResponse.status = createRemoteInstanceErr;
            singleRemoteInstanceResponse.entity = createdRemoteInstance;
            res.send(singleRemoteInstanceResponse);
            res.end();
        });
};

/*
 * function :   List remote instance
 * parameter :  mobile ID
 * return :     RemoteInstanceResponse
 */
exports.listRemoteInstances = function (req, res) {
    var mobileID = req.query.mobile_id;

    var remoteInstanceResponse = new RemoteInstanceResponse();
    remoteLogic.listRemoteInstancesWorkUnit(mobileID, function(listRemoteInstancesErr, remoteInstances) {
        remoteInstanceResponse.status = listRemoteInstancesErr;
        remoteInstanceResponse.entity = remoteInstances;
        res.send(remoteInstanceResponse);
        res.end();
    });
};

/*
 * function :   List remote instance
 * parameter :  mobile ID
 * return :     RemoteInstanceResponse
 */
exports.bindRemoteInstance = function (req, res) {
    var devicePdsn = req.query.device_pdsn;
    var remoteInstanceID = req.query.remote_instance_id;

    var serviceResponse = new ServiceResponse();
    remoteInstanceLogic.bindRemoteInstanceWorkUnit(remoteInstanceID, devicePdsn,
    function(bindRemoteInstanceErr) {
        serviceResponse.status = bindRemoteInstanceErr;
        res.send(serviceResponse);
        res.end();
    });
};

/*
 * function :   Delete remote
 * parameter :  mobile ID
 * return :     ServiceResponse
 */
exports.resetRemoteInstance = function (req, res) {
    var remoteInstanceID = req.query.remote_instance_id;

    var serviceResponse = new ServiceResponse();
    remoteLogic.resetRemoteInstanceWorkUnit(remoteInstanceID, function(deleteRemoteInstanceErr) {
        serviceResponse.status = deleteRemoteInstanceErr;
        res.send(serviceResponse);
        res.end();
    });
};

/*
 * function :   Rename remote instance
 * parameter :  remote instance
 * return :     ServiceResponse
 */
exports.renameRemoteInstance = function (req, res) {
    var newName = req.query.name;
    var remoteInstanceID = req.query.remote_instance_id;
    var newRemoteInstance = req.body;

    var serviceResponse = new ServiceResponse();
    remoteLogic.renameRemoteInstanceWorkUnit(remoteInstanceID, newName, newRemoteInstance,
        function(renameRemoteInstanceErr) {
            serviceResponse.status = renameRemoteInstanceErr;
            res.send(serviceResponse);
            res.end();
        });
};

/*
 * function :   Update remote instance
 * parameter :  remote instance
 * return :     RemoteInstanceResponse
 */
exports.updateRemoteInstance = function (req, res) {
    var remoteInstanceID = req.query.remote_instance_id;
    var newRemoteInstance = req.body;

    var singleRemoteInstanceResponse = new SingleRemoteInstanceResponse();
    remoteLogic.updateRemoteInstanceWorkUnit(remoteInstanceID, newRemoteInstance,
        function(updateRemoteInstanceErr, updatedRemoteInstance) {
            singleRemoteInstanceResponse.status = updateRemoteInstanceErr;
            singleRemoteInstanceResponse.entity = updatedRemoteInstance;
            res.send(singleRemoteInstanceResponse);
            res.end();
        });
};

/*
 * function :   Create remote
 * parameter :  remote
 * return :     RemoteResponse
 */
exports.createRemote = function (req, res) {
    var remote = req.body;

    logger.info("createRemote is called : " + remote.name);
    var singleRemoteResponse = new SingleRemoteResponse();
    remoteLogic.createRemoteWorkUnit(remote, function(createRemoteErr, createdRemote) {
        singleRemoteResponse.status = createRemoteErr;
        singleRemoteResponse.entity = createdRemote;
        res.send(singleRemoteResponse);
        res.end();
    });
};

/*
 * function :   Create Sirius Remote
 * parameter :  remote
 * return :     RemoteResponse
 * This function is for SIRIUS special
 */
exports.createSiriusRemote = function (req, res) {
    var remote = req.body;

    var singleRemoteResponse = new SingleRemoteResponse();
    remoteLogic.createSiriusRemoteWorkUnit(remote, function(createRemoteErr, createdRemote) {
        singleRemoteResponse.status = createRemoteErr;
        singleRemoteResponse.entity = createdRemote;
        res.send(singleRemoteResponse);
        res.end();
    });
};

/*
 * function :   Update remote
 * parameter :  remote ID
 *              remote to be updated
 * return :     RemoteResponse
 */
exports.updateRemote = function (req, res) {
    var remoteID = req.query.remote_id;
    var remote = req.body;

    var serviceResponse = new ServiceResponse();
    remoteLogic.updateRemoteWorkUnit(remoteID, remote, function(updateRemoteErr, updatedRemote) {
        serviceResponse.status = updateRemoteErr;
        res.send(serviceResponse);
        res.end();
    });
};

/*
 * function :   Delete remote
 * parameter :  remote ID
 *              remote to be removed
 * return :     ServiceResponse
 */
exports.deleteRemote = function (req, res) {
    var remoteID = req.query.remote_id;

    var serviceResponse = new ServiceResponse();
    remoteLogic.deleteRemoteWorkUnit(remoteID, function(deleteRemoteErr) {
        serviceResponse.status = deleteRemoteErr;
        res.send(serviceResponse);
        res.end();
    });
};

/*
 * function :   List remote
 * parameter :  from
 *              count
 *              remoteInstanceID
 * return :     RemoteResponse
 */
exports.listRemotes = function (req, res) {
    var remoteInstanceID = req.query.remote_instance_id;
    var from = req.query.from;
    var count = req.query.count;

    var remoteResponse = new RemoteResponse();
    remoteLogic.listRemotesWorkUnit(remoteInstanceID, from, count, function(listRemotesErr, remotes) {
        remoteResponse.status = listRemotesErr;
        remoteResponse.entity = remotes;
        res.send(remoteResponse);
        res.end();
    });
};

/*
 * function :   Get remote info
 * parameter :  remote ID
 * return :     RemoteInfoResponse
 */
exports.getRemoteInfo = function (req, res) {
    var remoteID = req.query.remote_id;
    var binaryVersion = req.query.binary_version;

    var remoteInfoResponse = new RemoteInfoResponse();
    remoteLogic.getRemoteInfoWorkUnit(remoteID, binaryVersion, function(getRemoteInfoErr, remoteInfo) {
        remoteInfoResponse.status = getRemoteInfoErr;
        remoteInfoResponse.entity = remoteInfo;
        res.send(remoteInfoResponse);
        res.end();
    });
};

/*
 * function :   List remote by room
 * parameter :  from
 *              count
 *              siriusID
 *              roomID
 * return :     RemoteResponse
 * This function is for SIRIUS special
 */
exports.listRemotesByRoom = function (req, res) {
    var siriusID = req.query.sirius_id;
    var roomID = req.query.room_id;
    var from = req.query.from;
    var count = req.query.count;

    var remoteResponse = new RemoteResponse();
    remoteLogic.listRemotesByRoomWorkUnit(siriusID, roomID, from, count, function(listRemotesErr, remotes) {
        remoteResponse.status = listRemotesErr;
        remoteResponse.entity = remotes;
        res.send(remoteResponse);
        res.end();
    });
};

/*
 * function :   List remote by room and category
 * parameter :  from
 *              count
 *              siriusID
 *              roomID
 *              categoryID
 * return :     RemoteResponse
 * This function is for SIRIUS special
 */
exports.listRemotesByRoomAndCategory = function (req, res) {
    var siriusID = req.query.sirius_id;
    var roomID = req.query.room_id;
    var categoryID = req.query.category_id;
    var from = req.query.from;
    var count = req.query.count;

    var remoteResponse = new RemoteResponse();
    remoteLogic.listRemotesByRoomAndCategoryWorkUnit(siriusID, roomID, categoryID, from, count, function(listRemotesErr, remotes) {
        remoteResponse.status = listRemotesErr;
        remoteResponse.entity = remotes;
        res.send(remoteResponse);
        res.end();
    });
};

/*
 * function :   List remote by siriusID
 * parameter :  from
 *              count
 *              siriusID
 * return :     RemoteResponse
 * This function is for SIRIUS special
 */
exports.listRemotesBySiriusID = function (req, res) {
    var siriusID = req.query.sirius_id;
    var from = req.query.from;
    var count = req.query.count;

    logger.info("list remotes by sirius_id : " + siriusID + ", from : " + from + ", count : " + count);

    var remoteResponse = new RemoteResponse();
    remoteLogic.listRemotesBySiriusIDWorkUnit(siriusID, from, count, function(listRemotesErr, remotes) {
        remoteResponse.status = listRemotesErr;
        remoteResponse.entity = remotes;
        res.send(remoteResponse);
        res.end();
    });
};

/*
 * function :   List STB remote by siriusID
 * parameter :  from
 *              count
 *              siriusID
 * return :     RemoteResponse
 * This function is for SIRIUS special
 */
exports.listStbRemotesBySiriusID = function (req, res) {
    var siriusID = req.query.sirius_id;
    var from = req.query.from;
    var count = req.query.count;

    var remoteResponse = new RemoteResponse();
    remoteLogic.listStbRemotesBySiriusIDWorkUnit(siriusID, from, count, function(listRemotesErr, remotes) {
        remoteResponse.status = listRemotesErr;
        remoteResponse.entity = remotes;
        res.send(remoteResponse);
        res.end();
    });
};

/*
 * function :   Create remote relationship
 * parameter :  new remote relationship object
 * return :     SingleRemoteRelationshipResponse
 * This function is for SIRIUS special
 */
exports.createRemoteRelationship = function (req, res) {
    var newRemoteRelationship = req.body;

    var singleRemoteRelationshipResponse = new SingleRemoteRelationshipResponse();
    remoteRelationshipLogic.createRemoteRelationshipWorkUnit(newRemoteRelationship,
        function(createRemoteRelationshipErr, createdRemoteRelationship) {
            singleRemoteRelationshipResponse.status = createRemoteRelationshipErr;
            singleRemoteRelationshipResponse.entity = createdRemoteRelationship;
        res.send(singleRemoteRelationshipResponse);
        res.end();
    });
};

/*
 * function :   get remote relationship
 * parameter :  remote ID
 * return :     SingleRemoteRelationshipResponse
 * This function is for SIRIUS special
 */
exports.getRemoteRelationship = function (req, res) {
    var remoteID = req.query.remote_id;

    var singleRemoteRelationshipResponse = new SingleRemoteRelationshipResponse();
    remoteRelationshipLogic.getRemoteRelationshipWorkUnit(remoteID,
        function(getRemoteRelationshipErr, remoteRelationship) {
            singleRemoteRelationshipResponse.status = getRemoteRelationshipErr;
            singleRemoteRelationshipResponse.entity = remoteRelationship;
            res.send(singleRemoteRelationshipResponse);
            res.end();
        });
};

/*
 * function :   delete remote relationship
 * parameter :  remote ID
 * return :     ServiceResponse
 * This function is for SIRIUS special
 */
exports.deleteRemoteRelationship = function (req, res) {
    var remoteID = req.query.remote_id;

    var serviceResponse = new ServiceResponse();
    remoteRelationshipLogic.deleteRemoteRelationshipWorkUnit(remoteID,
        function(deleteRemoteRelationshipErr) {
            serviceResponse.status = deleteRemoteRelationshipErr;
            res.send(serviceResponse);
            res.end();
        });
};
