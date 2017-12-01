/**
 * Created by strawmanbobi
 * 2015-02-27
 */

ServiceResponse = require("./service_response");
function SingleRemoteResponse(status, entity) {
    this.entity = entity;
    ServiceResponse.call(this, status);
}

module.exports = SingleRemoteResponse;