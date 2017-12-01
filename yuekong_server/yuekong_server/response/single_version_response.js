/**
 * Created by strawmanbobi
 * 15-07-17
 */

ServiceResponse = require("./service_response");
function SingleVersionResponse(status, entity) {
    this.entity = entity;
    ServiceResponse.call(this, status);
}

module.exports = SingleVersionResponse;