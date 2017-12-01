/**
 * Created by strawmanbobi
 * 2015-02-02
 */

var app = require('../yk_server.js');
var subscriptionService = require('../services/subscription_service.js');

app.post('/yuekong/subscription/create_subscription', subscriptionService.createSubscription);
app.post('/yuekong/subscription/update_subscription', subscriptionService.updateSubscription);
app.post('/yuekong/subscription/delete_subscription', subscriptionService.deleteSubscription);

app.get('/yuekong/subscription/get_subscriptions', subscriptionService.getSubscriptions);
app.get('/yuekong/subscription/list_subscriptions', subscriptionService.listSubscriptions);