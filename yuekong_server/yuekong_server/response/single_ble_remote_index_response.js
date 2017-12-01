/**
 * Created by strawmanbobi
 * 2016-04-01
 */

ServiceResponse = require("./service_response");
function SingleBleRemoteIndexResponse(status, entity) {
    this.entity = entity;
    ServiceResponse.call(this, status);
}

module.exports = SingleBleRemoteIndexResponse;