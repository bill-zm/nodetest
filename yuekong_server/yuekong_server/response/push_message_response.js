/**
 * Created by strawmanbobi
 * 16-04-27
 */

ServiceResponse = require("./service_response");
function PushMessageResponse(status, entity) {
    this.entity = entity;
    ServiceResponse.call(this, status);
}

module.exports = PushMessageResponse;