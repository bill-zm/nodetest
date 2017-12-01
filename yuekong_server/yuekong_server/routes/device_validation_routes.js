/**
 * Created by strawmanbobi
 * 2015-01-22.
 */

var app = require('../yk_server.js');
var deviceValidationService = require('../services/device_validation_service.js');

app.post('/yuekong/device_validation/create_device_validation', deviceValidationService.createDeviceValidation);