/**
 * Created by strawmanbobi
 * 15-06-25
 */

ServiceResponse = require("./service_response");
function KeyCodeResponse(status, entity) {
    this.entity = entity;
    ServiceResponse.call(this, status);
}

module.exports = KeyCodeResponse;