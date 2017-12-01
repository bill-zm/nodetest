/**
 * Created by Strawmanbobi on 2016-03-01.
 */

var app = require('../yk_server.js');
var userService = require('../services/user_service.js');

app.post('/yuekong/user/weixin_access_token', userService.weixinAccessToken);
app.post('/yuekong/user/weixin_get_user_info', userService.weixinGetUserInfo);
// app.post('/yuekong/user/weixin_refresh_token', userService.weixinRefreshToken);
app.post('/yuekong/user/register_user', userService.registerUser);
app.post('/yuekong/user/bind_mobile_to_user', userService.bindMobileToUser);

app.post('/yuekong/user/get_weixin_share_wording', userService.getWeixinShareWording);

app.get('/yuekong/user/get_weixin_user_stat', userService.getWeixinUserStat);
app.get('/yuekong/user/get_user_by_weixin_id', userService.getUserByWeixinID);