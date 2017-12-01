/**
 * Created by strawmanbobi
 * 2016-03-02
 */

// global inclusion
require('../../../Infrastructure/BackEnd/configuration/constants');

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var StringResponse = require('../response/string_response.js');
var SingleUserResponse = require('../response/user_response.js');

var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var userLogic = require('../work_unit/user_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Weixin access token
 * parameter :  APP_ID
 *              Auth code
 *              Grant type
 * return :     StringResponse
 */
exports.weixinAccessToken = function (req, res) {
    var appID = req.body.app_id;
    var authCode = req.body.auth_code;

    var stringResponse = new StringResponse();
    userLogic.weixinAccessTokenWorkUnit(appID, authCode, function (weixinAccessTokenErr, accessToken) {
        stringResponse.status = weixinAccessTokenErr;
        stringResponse.entity = accessToken;
        res.send(stringResponse);
        res.end();
    });
};

/*
 * function :   Weixin get user info
 * parameter :  Access token
 *              Open ID
 * return :     StringResponse
 */
exports.weixinGetUserInfo = function (req, res) {
    var accessToken = req.body.access_token;
    var openID = req.body.openid;

    var stringResponse = new StringResponse();
    userLogic.weixinGetUserInfoWorkUnit(accessToken, openID, function (weixinGetUserInfoErr, userInfo) {
        stringResponse.status = weixinGetUserInfoErr;
        stringResponse.entity = userInfo;
        res.send(stringResponse);
        res.end();
    });
};

/*
 * function :   Register user
 * parameter :  MobileID
 *              User object
 * return :     UserResponse
 */
exports.registerUser = function (req, res) {
    var mobileID = req.query.mobile_id;
    var newUser = req.body;

    var singleUserResponse = new SingleUserResponse();
    userLogic.createUserWorkUnit(mobileID, newUser, function (createUserErr, createdUser) {
        singleUserResponse.status = createUserErr;
        singleUserResponse.entity = createdUser;
        res.send(singleUserResponse);
        res.end();
    });
};

/*
 * function :   Bind Mobile To User
 * parameter :  MobileID
 *              SNS ID
 *              SNS Type
 * return :     ServiceResponse
 */
exports.bindMobileToUser = function (req, res) {
    var mobileID = req.query.mobile_id;
    var snsID = req.query.sns_id;
    var snsType = req.query.sns_type;

    var serviceResponse = new SingleUserResponse();
    userLogic.bindMobileToUserWorkUnit(mobileID, snsID, snsType, function (bindMobileErr) {
        serviceResponse.status = bindMobileErr;
        res.send(serviceResponse);
        res.end();
    });
};

/*
 * function :   Get weixin share wording
 * parameter :  User name
 *              MobileID
 *              User open ID
 * return :     StringResponse
 */
exports.getWeixinShareWording = function (req, res) {
    var mobileID = req.query.mobile_id;
    var userName = req.body.name;
    var userOpenID = req.body.weixin_id;

    var UA = req.headers['user-agent'];

    var stringResponse = new StringResponse();
    userLogic.getWeixinShareWordingWorkUnit(UA, mobileID, userOpenID, userName,
        function (uconStatErr, weixinShareWording) {
        stringResponse.status = uconStatErr;
        stringResponse.entity = weixinShareWording;
        res.send(stringResponse);
        res.end();
    });
};

/*
 * function :   Get weixin statistics
 * parameter :  MobileID
 *              User open ID
 * return :     StringResponse
 */
exports.getWeixinUserStat = function (req, res) {
    var mobileID = req.query.mobile_id;
    var userOpenID = req.query.weixin_id;

    var stringResponse = new StringResponse();
    userLogic.getWeixinUserStatWorkUnit(mobileID, userOpenID, function (weixinUserStatErr, weixinUserStat) {
        stringResponse.status = weixinUserStatErr;
        stringResponse.entity = weixinUserStat;
        res.send(stringResponse);
        res.end();
    });
};

/*
 * function :   Get user informartion by weixin ID
 * parameter :  weixin ID
 * return :     SingleUserResponse
 */
exports.getUserByWeixinID = function (req, res) {
    var weixinID = req.query.weixin_id;

    var singleUserResponse = new SingleUserResponse();
    userLogic.getUserByWeixinIDWorkUnit(weixinID, function (getUserErr, user) {
        singleUserResponse.status = getUserErr;
        singleUserResponse.entity = user;
        res.send(singleUserResponse);
        res.end();
    });
};