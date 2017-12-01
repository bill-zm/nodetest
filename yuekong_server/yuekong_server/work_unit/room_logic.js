/**
 * Created by strawmanbobi
 * 2016-06-06
 */

var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
require('../../../Infrastructure/BackEnd/configuration/constants');

var Room = require('../model/room_dao.js');
var Remote = require('../model/remote_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var async = require('async');

var enums = new Enums();
var errorCode = new ErrorCode();

exports.updateRoomWorkUnit = function (roomID, updateRoom, callback) {
    Room.updateRoom(roomID, updateRoom, function (updateRoomErr, updatedRoom) {
        if(errorCode.SUCCESS.code == updateRoomErr.code) {
            callback(updateRoomErr, updatedRoom);
        } else {
            callback(updateRoomErr, null);
        }
    });
};

exports.deleteRoomWorkUnit = function (roomID, callback) {
    Room.deleteRoom(roomID, function (deleteRoomErr) {
        if(errorCode.SUCCESS.code == deleteRoomErr.code) {
            // delete related remote relatively
            var conditions = {
                room_id: roomID
            };
            Remote.deleteRemoteByCondition(conditions, function(deleteRemoteErr) {
                callback(deleteRemoteErr);
            });
        } else {
            callback(deleteRoomErr, null);
        }
    });
};

exports.listRoomsWorkUnit = function (userID, mobileID, from, count, callback) {
    var retRooms = [];
    var conditions;

    conditions = {
        status: enums.ITEM_VALID,
        room_type: enums.ROOM_TYPE_SYSTEM
    };

    Room.listRooms(conditions, from, count, "id", function(listSystemRoomsErr, systemRooms) {
        if (errorCode.SUCCESS.code == listSystemRoomsErr.code && null != systemRooms) {
            for (var i = 0; i < systemRooms.length; i++) {
                retRooms.push(systemRooms[i]);
            }
        }

        if (null != userID || null != mobileID) {
            conditions = {
                status: enums.ITEM_VALID,
                room_type: enums.ROOM_TYPE_CUSTOM
            };

            if (null != userID) {
                conditions.user_id = userID;
            } else if (null != mobileID) {
                conditions.mobile_id = mobileID;
            }
            Room.listRooms(conditions, from, count, "id", function(listCustomRoomsErr, customRooms) {
                if (errorCode.SUCCESS.code == listCustomRoomsErr.code && null != customRooms) {
                    for (var i = 0; i < customRooms.length; i++) {
                        retRooms.push(customRooms[i]);
                    }
                }
                callback(errorCode.SUCCESS, retRooms);
            });
        } else {
            callback(errorCode.SUCCESS, retRooms);
        }
    });
};