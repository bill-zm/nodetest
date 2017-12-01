/**
 * Created by strawmanbobi
 * 16-03-02
 */

ServiceResponse = require("./service_response");
function UserResponse(status, entity) {
    this.entity = entity;
    ServiceResponse.call(this, status);
}

module.exports = UserResponse;