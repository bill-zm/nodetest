/**
 * Created by strawmanbobi
 * 2015-01-22.
 */

var app = require('../yk_server.js');
var deviceService = require('../services/device_service.js');

app.post('/yuekong/device/register_device', deviceService.registerDevice);
app.post('/yuekong/device/update_device_by_id', deviceService.updateDeviceByID);
app.post('/yuekong/device/update_device_by_pdsn', deviceService.updateDeviceByPDSN);

app.get('/yuekong/device/list_devices', deviceService.listDevices);
app.get('/yuekong/device/get_device_by_id', deviceService.getDeviceByID);
app.get('/yuekong/device/get_device_by_pdsn', deviceService.getDeviceByPDSN);

app.post('/yuekong/device/create_device_instance', deviceService.createDeviceInstance);
app.post('/yuekong/device/update_device_instance', deviceService.updateDeviceInstance);
app.post('/yuekong/device/delete_device_instance', deviceService.deleteDeviceInstance);
app.get('/yuekong/device/list_device_instances', deviceService.listDeviceInstances);
app.get('/yuekong/device/count_device_instances', deviceService.countDeviceInstances);
app.get('/yuekong/device/get_device_instance', deviceService.getDeviceInstance);