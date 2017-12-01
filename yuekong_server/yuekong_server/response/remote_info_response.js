/**
 * Created by strawmanbobi
 * 2015-05-31
 */

ServiceResponse = require("./service_response");
function RemoteInfoResponse(status, entity) {
    this.entity = entity;
    ServiceResponse.call(this, status);
}

module.exports = RemoteInfoResponse;