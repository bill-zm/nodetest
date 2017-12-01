/**
 * Created by strawmanbobi
 * 2015-08-17
 */

var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
require('../../../Infrastructure/BackEnd/configuration/constants');

var RemoteRelationship = require('../model/remote_relationship_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var async = require('async');

var enums = new Enums();
var errorCode = new ErrorCode();

exports.createRemoteRelationshipWorkUnit = function(newRemoteRelationship, callback) {
    var conditions = {
        remote_id: newRemoteRelationship.remote_id
    };
    RemoteRelationship.findRemoteRelationshipByConditions(conditions, function(findRemoteRelationshipErr,
                                                                                remoteRelationships) {
        if (errorCode.SUCCESS.code != findRemoteRelationshipErr.code ||
            null == remoteRelationships ||
            0 == remoteRelationships.length) {
            // create new remote relationship
            RemoteRelationship.createRemoteRelationship(newRemoteRelationship, function(createRemoteRelationshipErr,
                                                                                         createdRemoteRelationship) {
                callback(createRemoteRelationshipErr, createdRemoteRelationship);
            });
        } else {
            // update remote relationship
            var remoteRelationship = remoteRelationships[0];
            RemoteRelationship.updateRemoteRelationship(remoteRelationship.id, newRemoteRelationship,
                function(updateRemoteRelationshipErr, updatedRemoteRelationship) {
                    callback(updateRemoteRelationshipErr, updatedRemoteRelationship);
                });
        }
    });
};

exports.getRemoteRelationshipWorkUnit = function(remoteID, callback) {
    var conditions = {
        remote_id : remoteID
    };

    RemoteRelationship.findRemoteRelationshipByConditions(conditions,
        function(findRemoteRelationshipErr, remoteRelationships) {
        if (errorCode.SUCCESS.code == findRemoteRelationshipErr.code &&
                null != remoteRelationships &&
                remoteRelationships.length > 0) {
            var remoteRelationship = remoteRelationships[0];
            callback(errorCode.SUCCESS, remoteRelationship);
        } else {
            callback(errorCode.SUCCESS, null);
        }
    });
};

exports.deleteRemoteRelationshipWorkUnit = function(remoteID, callback) {
    var conditions = {
        remote_id : remoteID
    };
    RemoteRelationship.findRemoteRelationshipByConditions(conditions, function(findRemoteRelationshipErr,
                                                                               remoteRelationships) {
        if (errorCode.SUCCESS.code != findRemoteRelationshipErr.code ||
            null == remoteRelationships ||
            0 == remoteRelationships.length) {
            // nothing to be done
            callback(errorCode.SUCCESS);
        } else {
            // delete remote relationship
            var remoteRelationship = remoteRelationships[0];
            RemoteRelationship.deleteRemoteRelationshipByID(remoteRelationship.id,
                function(deleteRemoteRelationshipErr) {
                    callback(deleteRemoteRelationshipErr);
                });
        }
    });
};