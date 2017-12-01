/**
 * Created by strawmanbobi
 * 2016-04-27
 */

// system inclusion
var constants = require('../../../Infrastructure/BackEnd/configuration/constants');

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var PushMessageResponse = require('../response/push_message_response.js');

var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var pushLogic = require('../work_unit/push_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   List Push Messages
 * parameter :  Filter conditions in HTTP body
 *              month
 *              app key
 *              app token
 * return :     Array of PushMessage objects
 */
exports.listPushMessages = function (req, res) {
    var month = req.query.month;
    var fromPeer = req.query.from_peer;
    var toPeer = req.query.to_peer;
    var pushType = req.query.push_type;
    var destType = req.query.dest_type;
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;

    var pushMessageResponse = new PushMessageResponse();
    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        pushMessageResponse.status = errorCode.AUTHENTICATION_FAILURE;
        pushMessageResponse.entity = null;
        res.send(pushMessageResponse);
        res.end();
    } else {
        pushLogic.listPushMessageWorkUnit(pushType, destType, fromPeer, toPeer, month,
            function (listPushMessageErr, pushMessages) {
                pushMessageResponse.status = listPushMessageErr;
                pushMessageResponse.entity = pushMessages;
                res.send(pushMessageResponse);
                res.end();
            });
    }
};

/*
 * function :   Create Push Message
 * parameter :  Message Object in HTTP body
 *              app key
 *              app token
 * return :     ServiceResponse
 */
exports.createPushMessage = function (req, res) {
    var pushMessage = req.body;
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;

    var serviceResponse = new ServiceResponse();
    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        serviceResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(serviceResponse);
        res.end();
    } else {
        pushLogic.createPushMessageWorkUnit(pushMessage, function (createPushMessageErr) {
            serviceResponse.status = createPushMessageErr;
            res.send(serviceResponse);
            res.end();
        });
    }
};

/*
 * function :   Notify Update Done
 * parameter :  Message Object in HTTP body
 * return :     ServiceResponse
 */
exports.notifyUpdate = function (req, res) {
    var pushMessage = req.body;
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;

    var serviceResponse = new ServiceResponse();
    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        serviceResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(serviceResponse);
        res.end();
    } else {
        pushLogic.notifyUpdateWorkUnit(pushMessage, function (createPushMessageErr) {
            serviceResponse.status = createPushMessageErr;
            res.send(serviceResponse);
            res.end();
        });
    }
};

/*
 * function :   Notify Subscription Done
 * parameter :  Message Object in HTTP body,
 *              Subscription id list
 * return :     ServiceResponse
 */
exports.notifySubscription = function (req, res) {
    var pushMessage = req.body;
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;

    var serviceResponse = new ServiceResponse();
    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        serviceResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(serviceResponse);
        res.end();
    } else {
        pushLogic.notifySubscriptionWorkUnit(pushMessage, function (createPushMessageErr) {
            serviceResponse.status = createPushMessageErr;
            res.send(serviceResponse);
            res.end();
        });
    }
};