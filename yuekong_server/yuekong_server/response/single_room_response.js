/**
 * Created by strawmanbobi
 * 2016-06-06
 */

ServiceResponse = require("./service_response");
function SingleRoomResponse(status, entity) {
    this.entity = entity;
    ServiceResponse.call(this, status);
}

module.exports = SingleRoomResponse;