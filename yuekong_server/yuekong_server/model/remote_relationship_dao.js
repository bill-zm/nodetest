/**
 * Created by strawmanbobi
 * 2016-08-17
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

var RemoteRelationship = dbOrm.define('remote_relationship',
    {
        id: Number,
        remote_id: Number,
        remote_map: String,
        related_remote_id: Number,
        related_remote_map: String
    },
    {
        cache: false
    }
);

RemoteRelationship.createRemoteRelationship = function(remote_relationship, callback) {
    var newRemoteRelationship = new RemoteRelationship({
        remote_id: remote_relationship.remote_id,
        remote_map: remote_relationship.remote_map,
        related_remote_id: remote_relationship.related_remote_id,
        related_remote_map: remote_relationship.related_remote_map
    });
    newRemoteRelationship.save(function(error, createdRemoteRelationship) {
        if(error) {
            logger.error('failed to create remote relationship : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create relationship');
            callback(errorCode.SUCCESS, createdRemoteRelationship);
        }
    });
};

RemoteRelationship.updateRemoteRelationship = function(remoteRelationshipID, newRemoteRelationship, callback) {
    RemoteRelationship.get(remoteRelationshipID, function(error, remoteRelationship) {
        if (error || null == remoteRelationship) {
            logger.error('failed to get remote relationship in update remote relationship : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            remoteRelationship.remote_id = newRemoteRelationship.remote_id;
            remoteRelationship.remote_map = newRemoteRelationship.remote_map;
            remoteRelationship.related_remote_id = newRemoteRelationship.related_remote_id;
            remoteRelationship.related_remote_map = newRemoteRelationship.related_remote_map;
            remoteRelationship.save(function(error, updatedRemoteRelationship) {
                if(error) {
                    logger.error('failed to update remote relationship : ' + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info('succeeded to update relationship');
                    callback(errorCode.SUCCESS, updatedRemoteRelationship);
                }
            });
        }
    });
};

RemoteRelationship.findRemoteRelationshipByConditions = function(conditions, callback) {
    RemoteRelationship.find(conditions)
        .run(function (error, remote_relationships) {
            if (error) {
                logger.error("find remote relationship error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find remote relationship successfully, " +
                    "length of remote relationships = " + remote_relationships.length);
                callback(errorCode.SUCCESS, remote_relationships);
            }
        });
};

RemoteRelationship.deleteRemoteRelationshipByID = function(remoteRelationshipID, callback) {
    RemoteRelationship.get(remoteRelationshipID, function(error, remoteRelationship) {
        if (error) {
            logger.error("get remote relationship by ID error in delete remote relationship : " + error);
            callback(errorCode.FAILED, null);
        } else {
            remoteRelationship.remove(function(error) {
                if(error) {
                    logger.error('failed to delete remote relationship : ' + error);
                    callback(errorCode.FAILED);
                } else {
                    logger.info('succeeded to delete remote relationship');
                    callback(errorCode.SUCCESS);
                }
            });
        }
    });
};

module.exports = RemoteRelationship;