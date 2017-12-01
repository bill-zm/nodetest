/**
 * Created by strawmanbobi
 * 2016-04-27
 */

var app = require('../yk_server.js');
var pushService = require('../services/push_service.js');

app.get('/yuekong/push/list_push_messages', pushService.listPushMessages);

app.post('/yuekong/push/create_push_message', pushService.createPushMessage);
app.post('/yuekong/push/notify_update', pushService.notifyUpdate);
app.post('/yuekong/push/notify_subscription', pushService.notifySubscription);