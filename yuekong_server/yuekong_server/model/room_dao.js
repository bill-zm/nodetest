/**
 * Created by strawmanbobi
 * 2016-06-06
 */

// global inclusion
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
var dbOrm = require('../../../Infrastructure/BackEnd/db/mysql/mysql_connection').mysqlDB;
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;
var dateUtils = require('../../../Infrastructure/BackEnd/utils/date_utils.js');

// local inclusion
var ErrorCode = require('../configuration/error_code');
var errorCode = new ErrorCode();

var Enums = require('../configuration/enums');
var enums = new Enums();

var Room = dbOrm.define('room',
    {
        id: Number,
        name: String,
        user_id: String,
        mobile_id: String,
        room_type: Number,
        status: Number,
        update_time: String
    },
    {
        cache: false
    }
);

Room.updateRoom = function(roomID, updateRoom, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");

    if(undefined != roomID && null != roomID) {
        Room.get(roomID, function(error, room) {
            if(error || null == room || enums.ITEM_VALID != room.status) {
                logger.info("get room error or room not exist, create new one");
                var newRoom = new Room({
                    name: updateRoom.name,
                    user_id: updateRoom.user_id,
                    mobile_id: updateRoom.mobile_id,
                    room_type: enums.ROOM_TYPE_CUSTOM,
                    status: enums.ITEM_VALID,
                    update_time: date
                });
                newRoom.save(function(error, createdRoom) {
                    if(error) {
                        logger.error('failed to create room : ' + error);
                        callback(errorCode.FAILED, null);
                    } else {
                        logger.info('succeeded to create room');
                        callback(errorCode.SUCCESS, createdRoom);
                    }
                });
            } else {
                logger.info("room got, update the current room info");
                for(var p in room) {
                    if(null != updateRoom[p]) {
                        room[p] = updateRoom[p];
                    }
                }
                room.save(function(error, createdRoom) {
                    if(error) {
                        logger.error('failed to create room : ' + error);
                        callback(errorCode.FAILED, null);
                    } else {
                        logger.info('succeeded to create room');
                        callback(errorCode.SUCCESS, createdRoom);
                    }
                });
            }
        });
    } else {
        logger.info("room id is not specified, create new room");
        var newRoom = new Room({
            name: updateRoom.name,
            user_id: updateRoom.user_id,
            mobile_id: updateRoom.mobile_id,
            room_type: enums.ROOM_TYPE_CUSTOM,
            status: enums.ITEM_VALID,
            update_time: date
        });
        newRoom.save(function(error, createdRoom) {
            if(error) {
                logger.error('failed to create room : ' + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info('succeeded to create room');
                callback(errorCode.SUCCESS, createdRoom);
            }
        });
    }
};

Room.findRoomByConditions = function(conditions, callback) {
    Room.find(conditions)
        .run(function (error, rooms) {
            if (error) {
                logger.error("find room error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find room successfully, length of rooms = " + rooms.length);
                callback(errorCode.SUCCESS, rooms);
            }
        });
};

Room.listRooms = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.gt(from);
        Room.find(conditions).limit(parseInt(count)).orderRaw("?? ASC", [sortField])
            .run(function (listRoomsErr, rooms) {
                if (listRoomsErr) {
                    logger.error("list rooms error : " + listRoomsErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list rooms successfully");
                    callback(errorCode.SUCCESS, rooms);
                }
            });
    } else {
        Room.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? ASC", [sortField])
            .run(function (listRoomsErr, rooms) {
                if (listRoomsErr) {
                    logger.error("list rooms error : " + listRoomsErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list rooms successfully");
                    callback(errorCode.SUCCESS, rooms);
                }
            });
    }
};

Room.getRoomByID = function(roomID, callback) {
    Room.get(roomID, function(error, room) {
        if (error) {
            logger.error("get room by ID error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get room by ID successfully");
            callback(errorCode.SUCCESS, room);
        }
    });
};

Room.countRoomsByConditions = function(conditions, callback) {
    Room.count(conditions, function(error, roomCount) {
        if (error) {
            logger.error("count rooms error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("count rooms successfully");
            callback(errorCode.SUCCESS, roomCount);
        }
    });
};

Room.deleteRoom = function(roomID, callback) {
    Room.get(roomID, function(error, room) {
        if(error || null == room || enums.ITEM_VALID != room.status) {
            logger.info("get room error or room not exist, return success");
            callback(errorCode.SUCCESS);
        } else {
            logger.info("update room, set status = 0");
            room.status = enums.ITEM_INVALID;
            room.save(function(error, deletedRoom) {
                if(error) {
                    logger.error('failed to delete room : ' + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info('succeeded to delete room');
                    callback(errorCode.SUCCESS, deletedRoom);
                }
            });
        }
    });
};

module.exports = Room;