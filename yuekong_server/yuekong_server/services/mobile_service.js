/**
 * Created by strawmanbobi
 * 2015-02-01.
 */

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var MobileResponse = require('../response/mobile_response.js');
var SingleMobileResponse = require('../response/single_mobile_response.js');
var IntegerResponse = require('../response/integer_response.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var mobileLogic = require('../work_unit/mobile_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Update mobile
 * parameter :  HTTP body of mobile
 * return :     SingleMobileResponse
 */
exports.updateMobile = function (req, res) {
    var newMobile = req.body;

    var singleMobileResponse = new SingleMobileResponse();
    mobileLogic.updateMobileWorkUnit(newMobile, function (updateMobileErr, updatedMobile) {
        singleMobileResponse.status = updateMobileErr;
        singleMobileResponse.entity = updatedMobile;
        res.send(singleMobileResponse);
        res.end();
    });
};

/*
 * function :   List Mobiles
 * parameter :  from
 *              count
 * return :     MobileResponse
 */
exports.listMobiles = function (req, res) {
    var from = req.query.from;
    var count = req.query.count;

    var mobileResponse = new MobileResponse();
    mobileLogic.listMobilesWorkUnit(from, count, function (listMobilesErr, mobiles) {
        mobileResponse.status = listMobilesErr;
        mobileResponse.entity = mobiles;
        res.send(mobileResponse);
        res.end();
    });
};

/*
 * function :   Get mobile by ID
 * parameter :  mobile_id
 * return :     MobileResponse
 */
exports.getMobileByID = function (req, res) {
    var mobileID = req.query.mobile_id;

    var mobileResponse = new MobileResponse();
    mobileLogic.getMobileByIDWorkUnit(mobileID, function (getMobileByIDErr, mobiles) {
        mobileResponse.status = getMobileByIDErr;
        mobileResponse.entity = mobiles;
        res.send(mobileResponse);
        res.end();
    });
};

/*
 * function :   Get mobile by PID
 * parameter :  PID of mobile
 * return :     MobileResponse
 */
exports.getMobileByMobileID = function (req, res) {
    var mobileID = req.query.mobile_id;

    var mobileResponse = new MobileResponse();
    mobileLogic.getMobileByMobileIDWorkUnit(mobileID, function (getMobileByMobileIDErr, mobiles) {
        mobileResponse.status = getMobileByMobileIDErr;
        mobileResponse.entity = mobiles;
        res.send(mobileResponse);
        res.end();
    });
};