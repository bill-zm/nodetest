/**
 * Created by strawmanbobi
 * 16-04-18
 */

ServiceResponse = require("./service_response");
function UpdateRecordResponse(status, entity) {
    this.entity = entity;
    ServiceResponse.call(this, status);
}

module.exports = UpdateRecordResponse;