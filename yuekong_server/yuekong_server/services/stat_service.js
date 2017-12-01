/**
 * Created by strawmanbobi
 * 2015-07-17.
 */

// global inclusion
require('../../../Infrastructure/BackEnd/configuration/constants');

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var IntegerResponse = require('../response/integer_response.js');
var StatResponse = require('../response/stat_response.js');
var UpdateRecordResponse = require('../response/update_record_response.js');

var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var statLogic = require('../work_unit/stat_logic.js');
var updateRecordLogic = require('../work_unit/update_record_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var errorCode = new ErrorCode();
var enums = new Enums();

/*
 * function :   Generic Count
 * parameter :  app key
 *              app token
 *              stat type
 * return :     Integer Response
 */
exports.genericCount = function (req, res) {
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;
    var statType = req.query.stat_type;

    var UA = req.headers['user-agent'];

    var integerResponse = new IntegerResponse();
    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        integerResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(integerResponse);
        res.end();
    } else {
        statLogic.genericCountWorkUnit(statType, function(genericCountErr, genericCount) {
            integerResponse.status = genericCountErr;
            integerResponse.entity = genericCount;
            res.send(integerResponse);
            res.end();
        });
    }
};

/*
 * function :   Generic Stat
 * parameter :  app key
 *              app token
 *              stat type
 *              begin date
 *              end date
 * return :     Stat Response
 */
exports.genericStat = function (req, res) {
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;
    var statType = req.query.stat_type;
    var beginDate = req.query.begin_date;
    var endDate = req.query.end_date;

    var UA = req.headers['user-agent'];

    var statResponse = new StatResponse();
    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        statResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(statResponse);
        res.end();
    } else {
        statLogic.genericStatWorkUnit(statType, beginDate, endDate, function(genericStatErr, genericStat) {
            statResponse.status = genericStatErr;
            statResponse.entity = genericStat;
            res.send(statResponse);
            res.end();
        });
    }
};

/*
 * function :   Stat Categories
 * parameter :
 * return :     Stat Response
 */
exports.statCategories = function (req, res) {
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;

    var UA = req.headers['user-agent'];

    var statResponse = new StatResponse();
    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        statResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(statResponse);
        res.end();
    } else {
        statLogic.statCategoriesWorkUnit(function(statCategoriesErr, categoriesStat) {
            statResponse.status = statCategoriesErr;
            statResponse.entity = categoriesStat;
            res.send(statResponse);
            res.end();
        });
    }
};

/*
 * function :   Stat Brands
 * parameter :  categoryID
 * return :     Stat Response
 */
exports.statBrands = function (req, res) {
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;
    var categoryID = req.query.category_id;

    var UA = req.headers['user-agent'];

    var statResponse = new StatResponse();
    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        statResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(statResponse);
        res.end();
    } else {
        statLogic.statBrandsWorkUnit(categoryID, function(statBrandsErr, brandsStat) {
            statResponse.status = statBrandsErr;
            statResponse.entity = brandsStat;
            res.send(statResponse);
            res.end();
        });
    }
};

/*
 * function :   Stat Cities
 * parameter :
 * return :     Stat Response
 */
exports.statCities = function (req, res) {
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;

    var UA = req.headers['user-agent'];

    var statResponse = new StatResponse();
    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        statResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(statResponse);
        res.end();
    } else {
        statLogic.statCitiesWorkUnit(function(statCitiesErr, citiesStat) {
            statResponse.status = statCitiesErr;
            statResponse.entity = citiesStat;
            res.send(statResponse);
            res.end();
        });
    }
};

/*
 * function :   Create statistics item
 * parameter :  Stat object
 * return :     Service Response
 */
exports.createStat = function (req, res) {
    var stat = req.body;
    var UA = req.headers['user-agent'];

    var serviceResponse = new ServiceResponse();
    statLogic.createStatWorkUnit(stat, UA, function (createStatErr, createdStat) {
        serviceResponse.status = createStatErr;
        res.send(serviceResponse);
        res.end();
    });
};

/*
 * function :   Get update statistics information
 * parameter :  Upgrade object list
 * return :     UpdateRecord Response
 */
exports.listUpdateRecords = function (req, res) {
    var month = req.query.month;
    var updaterID = req.query.updater_id;

    var updateRecordResponse = new UpdateRecordResponse();
    updateRecordLogic.listUpdateRecordsWorkUnit(month, updaterID, function (listUpdateRecordsErr, updateRecords) {
        updateRecordResponse.status = listUpdateRecordsErr;
        updateRecordResponse.entity = updateRecords;
        res.send(updateRecordResponse);
        res.end();
    });
};