/**
 * Created by strawmanbobi
 * 2016-06-06
 */

var app = require('../yk_server.js');
var roomService = require('../services/room_service.js');

app.post('/yuekong/room/update_room', roomService.updateRoom);
app.post('/yuekong/room/delete_room', roomService.deleteRoom);

app.get('/yuekong/room/list_rooms', roomService.listRooms);