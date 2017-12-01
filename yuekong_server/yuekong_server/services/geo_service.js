/**
 * Created by strawmanbobi
 * 2015-01-23.
 */

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var ProvinceResponse = require('../response/province_response.js');
var OperatorResponse = require('../response/operator_response.js');
var CityResponse = require('../response/city_response.js');

var cityLogic = require('../work_unit/city_logic.js');
var operatorLogic = require('../work_unit/operator_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   List provinces
 * parameter :
 * return :     ProvinceResponse
 */
exports.listProvinces = function (req, res) {
    var pdsn = req.query.pdsn;
    var UA = req.headers['user-agent'];

    var provinceResponse = new ProvinceResponse();
    cityLogic.listProvincesWorkUnit(pdsn, UA, function (listProvincesErr, provinces) {
        provinceResponse.status = listProvincesErr;
        provinceResponse.entity = provinces;
        res.send(provinceResponse);
        res.end();
    });
};

/*
* function :   List Cities
* parameter :  province code prefix
* return :     CityResponse
*/
exports.listCities = function (req, res) {
    var provincePrefix = req.query.province_prefix;
    var pdsn = req.query.pdsn;

    var UA = req.headers['user-agent'];

    var cityResponse = new CityResponse();
    cityLogic.listCitiesWorkUnit(provincePrefix, pdsn, UA, function (listCitiesErr, cities) {
        cityResponse.status = listCitiesErr;
        cityResponse.entity = cities;
        res.send(cityResponse);
        res.end();
    });
};

/*
 * function :   List City areas
 * parameter :  city code prefix
 * return :     CityResponse
 */
exports.listCityAreas = function (req, res) {
    var cityPrefix = req.query.city_prefix;

    var UA = req.headers['user-agent'];

    var cityResponse = new CityResponse();
    cityLogic.listCityAreasWorkUnit(cityPrefix, UA, function (listCityAreasErr, areas) {
        cityResponse.status = listCityAreasErr;
        cityResponse.entity = areas;
        res.send(cityResponse);
        res.end();
    });
};

/*
 * function :   List Cities are covered
 * parameter :  province code prefix
 * return :     CityResponse
 */
exports.listCoveredCities = function (req, res) {
    var from = req.query.from;
    var count = req.query.count;

    var UA = req.headers['user-agent'];

    var cityResponse = new CityResponse();
    cityLogic.listCoveredCitiesWorkUnit(from, count, UA, function (listCitiesErr, cities) {
        cityResponse.status = listCitiesErr;
        cityResponse.entity = cities;
        res.send(cityResponse);
        res.end();
    });
};

/*
 * function :   List operators
 * parameter :  city code
 * return :     OperatorResponse
 */
exports.listOperators = function (req, res) {
    var cityCode = req.query.city_code;
    var from = req.query.from;
    var count = req.query.count;

    var UA = req.headers['user-agent'];

    var operatorResponse = new OperatorResponse();
    operatorLogic.listOperatorsWorkUnit(cityCode, from, count, UA, function (listOperatorsErr, operators) {
        operatorResponse.status = listOperatorsErr;
        operatorResponse.entity = operators;
        res.send(operatorResponse);
        res.end();
    });
};
