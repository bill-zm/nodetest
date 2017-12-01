/**
 * Created by strawmanbobi
 * 2016-06-06
 */

ServiceResponse = require("./service_response");
function RoomResponse(status, entity) {
    this.entity = entity;
    ServiceResponse.call(this, status);
}

module.exports = RoomResponse;