/**
 * Created by strawmanbobi
 * 2015-02-28
 */

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var SubscriptionResponse = require('../response/subscription_response.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var subscriptionLogic = require('../work_unit/subscription_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Create subscription
 * parameter :  pdsn
 *              subscription to be created
 * return :     SubscriptionResponse
 */
exports.createSubscription = function (req, res) {
    var pdsn = req.query.pdsn;
    var token = req.query.token;
    var subscription = req.body;

    var subscriptionResponse = new SubscriptionResponse();
    subscriptionLogic.createSubscriptionWorkUnit(pdsn, token, subscription,
        function(createSubscriptionErr, createdSubscription) {
        subscriptionResponse.status = createSubscriptionErr;
        subscriptionResponse.entity = createdSubscription;
        res.send(subscriptionResponse);
        res.end();
    });
};

/*
 * function :   Update subscription
 * parameter :  pdsn
 *              subscription to be created
 * return :     SubscriptionResponse
 */
exports.updateSubscription = function (req, res) {
    var id = req.query.subscription_id;
    var subscription = req.body;

    var subscriptionResponse = new SubscriptionResponse();
    subscriptionLogic.updateSubscriptionWorkUnit(id, subscription,
        function(updateSubscriptionErr, updatedSubscription) {
            subscriptionResponse.status = updateSubscriptionErr;
            subscriptionResponse.entity = updatedSubscription;
            res.send(subscriptionResponse);
            res.end();
        });
};

/*
 * function :   Get subscriptions by UCON Center (Device)
 * parameter :  pdsn
 *              from
 *              count
 * return :     SubscriptionResponse
 */
exports.getSubscriptions = function (req, res) {
    var pdsn = req.query.pdsn;
    var from = req.query.from;
    var count = req.query.count;
    var binary_version = req.query.binary_version;

    var UA = req.headers['user-agent'];

    logger.info("get subscription = " + pdsn);

    var subscriptionResponse = new SubscriptionResponse();
    subscriptionLogic.getSubscriptionWorkUnit(pdsn, from, count, binary_version, UA, 
            function(getSubscriptionErr, subscriptions) {
        subscriptionResponse.status = getSubscriptionErr;
        subscriptionResponse.entity = subscriptions;
        res.send(subscriptionResponse);
        res.end();
    });
};

/*
 * function :   Get subscriptions by App Client
 * parameter :  pdsn
 *              from
 *              count
 * return :     SubscriptionResponse
 */
exports.listSubscriptions = function (req, res) {
    var mobileID = req.query.mobile_id;
    var from = req.query.from;
    var count = req.query.count;

    var subscriptionResponse = new SubscriptionResponse();
    subscriptionLogic.listSubscriptionWorkUnit(mobileID, from, count, function(listSubscriptionErr, subscriptions) {
        subscriptionResponse.status = listSubscriptionErr;
        subscriptionResponse.entity = subscriptions;
        res.send(subscriptionResponse);
        res.end();
    });
};

/*
 * function :   Delete subscription
 * parameter :  subscriptionID
 * return :     ServiceResponse
 */
exports.deleteSubscription = function (req, res) {
    var subscriptionID = req.query.subscription_id;

    var serviceResponse = new ServiceResponse();
    subscriptionLogic.deleteSubscriptionWorkUnit(subscriptionID, function(deletedSubscriptionErr) {
        serviceResponse.status = deletedSubscriptionErr;
            res.send(serviceResponse);
            res.end();
        });
};