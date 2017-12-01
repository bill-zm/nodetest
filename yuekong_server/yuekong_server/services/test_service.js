/**
 * Created by strawmanbobi
 * 2015-07-17.
 */

// local inclusion
var ServiceResponse = require('../response/service_response.js');

var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

var dateUtils = require('../../../Infrastructure/BackEnd/utils/date_utils.js');

/*
 * function :   Service of test purpose
 * parameter :
 * return :
 */
exports.haveSomeTest = function (req, res) {
    // var posixTime = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    // res.send(posixTime);

    var diff = dateUtils.getDateDiffer("2016-07-31 23:00:05", "2016-08-01 00:00", "minute");
    logger.info("time diff = " + diff);
    res.end();
};