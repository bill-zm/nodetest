/**
 * Created by strawmanbobi
 * 2016-06-06
 */

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var RoomResponse = require('../response/room_response.js');
var SingleRoomResponse = require('../response/single_room_response.js');

var roomLogic = require('../work_unit/room_logic.js');

var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Update Room
 * parameter :  Room object
 * return :     SingleRoomResponse
 */
exports.updateRoom = function (req, res) {
    var roomID = req.query.room_id;
    var room = req.body;

    var singleRoomResponse = new SingleRoomResponse();
    roomLogic.updateRoomWorkUnit(roomID, room, function(updateRoomErr, updatedRoom) {
        singleRoomResponse.status = updateRoomErr;
        singleRoomResponse.entity = updatedRoom;
        res.send(singleRoomResponse);
        res.end();
    });
};

/*
 * function :   Delete Room
 * parameter :  Room id
 * return :     ServiceResponse
 */
exports.deleteRoom = function (req, res) {
    var roomID = req.query.room_id;

    logger.info("delete room, roomID = " + roomID);

    var serviceResponse = new ServiceResponse();
    roomLogic.deleteRoomWorkUnit(roomID, function(deleteRoomErr) {
        serviceResponse.status = deleteRoomErr;
        res.send(serviceResponse);
        res.end();
    });
};

/*
 * function :   List Rooms
 * parameter :  user ID
 *              mobile ID
 * return :     RoomResponse
 */
exports.listRooms = function (req, res) {
    var userID = req.query.user_id;
    var mobileID = req.query.mobile_id;
    var from = req.query.from;
    var count = req.query.count;

    var roomResponse = new RoomResponse();
    roomLogic.listRoomsWorkUnit(userID, mobileID, from, count, function(listRoomsErr, rooms) {
        roomResponse.status = listRoomsErr;
        roomResponse.entity = rooms;
        res.send(roomResponse);
        res.end();
    });
};