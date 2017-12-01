/**
 * Created by strawmanbobi
 * 2015-01-22.
 */

var app = require('../yk_server.js');
var mobileService = require('../services/mobile_service.js');

app.post('/yuekong/mobile/update_mobile', mobileService.updateMobile);

app.get('/yuekong/mobile/list_mobiles', mobileService.listMobiles);
app.get('/yuekong/mobile/get_mobile_by_id', mobileService.getMobileByID);
app.get('/yuekong/mobile/get_mobile_by_mobile_id', mobileService.getMobileByMobileID);