/**
 * Created by strawmanbobi
 * 2015-01-23
 */

// global inclusion
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
var dbOrm = require('../../../Infrastructure/BackEnd/db/mysql/mysql_connection').mysqlDB;
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

// local inclusion
var ErrorCode = require('../configuration/error_code');
var errorCode = new ErrorCode();

var City = dbOrm.define('city',
    {
        id: Number,
        code: String,
        name: String,
        longitude: Number,
        latitude: Number,
        name_tw: String,
        protector: String
    },
    {
        cache: false
    }
);

City.listProvinces = function(pdsn, callback) {
    var error = errorCode.SUCCESS;

    if (null != pdsn && "null" != pdsn) {
        dbOrm.driver.execQuery("SELECT * FROM city WHERE code LIKE '__0000' AND protector LIKE '%" + pdsn.charAt(0) + "%';",
            function(getProvincesErr, result) {
                if (getProvincesErr) {
                    logger.info("get provinces failed : " + getProvincesErr);
                    error = errorCode.FAILED;
                    callback(error,null);
                } else {
                    logger.info("get provinces successfully");
                    callback(error, result);
                }
            });
    } else {
        dbOrm.driver.execQuery("SELECT * FROM city WHERE code LIKE '__0000'",
            function(getProvincesErr, result) {
                if (getProvincesErr) {
                    logger.info("get provinces failed : " + getProvincesErr);
                    error = errorCode.FAILED;
                    callback(error,null);
                } else {
                    logger.info("get provinces successfully");
                    callback(error, result);
                }
            });
    }
};

City.listCities = function(provincePrefix, pdsn, callback) {
    var error = errorCode.SUCCESS;
    // dbOrm is object of ORM
    if (null != pdsn && "null" != pdsn) {
        dbOrm.driver.execQuery("SELECT * FROM city WHERE code LIKE '" + provincePrefix +
            "__00' AND code NOT LIKE '__0000' AND protector LIKE '%" + pdsn.charAt(0) + "%';",
            function (getCitiesErr, result) {
                if (getCitiesErr) {
                    logger.info("get cities failed : " + getCitiesErr);
                    error = errorCode.FAILED;
                    callback(error, null);
                } else {
                    logger.info("get cities successfully");
                    callback(error, result);
                }
            });
    } else {
        dbOrm.driver.execQuery("SELECT * FROM city WHERE code LIKE '" + provincePrefix +
            "__00' AND code NOT LIKE '__0000'", function (getCitiesErr, result) {
                if (getCitiesErr) {
                    logger.info("get cities failed : " + getCitiesErr);
                    error = errorCode.FAILED;
                    callback(error, null);
                } else {
                    logger.info("get cities successfully");
                    callback(error, result);
                }
            });
    }
};

City.listCityAreas = function(cityPrefix, callback) {
    var error = errorCode.SUCCESS;

    dbOrm.driver.execQuery("SELECT * FROM city WHERE code LIKE '" + cityPrefix +
        "__' AND code <> '" + cityPrefix + "00'", function (getAreasErr, result) {
        if (getAreasErr) {
            logger.info("get cities failed : " + getAreasErr);
            error = errorCode.FAILED;
            callback(error, null);
        } else {
            logger.info("get cities successfully");
            callback(error, result);
        }
    });
};

City.findCitiesByConditions = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.lt(from);
        City.find(conditions).limit(parseInt(count)).orderRaw("?? ASC", [sortField])
            .run(function (error, cities) {
                if (error) {
                    logger.error("find city error : " + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("find city successfully, length of cities = " + cities.length);
                    callback(errorCode.SUCCESS, cities);
                }
            });
    } else {
        City.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? ASC", [sortField])
            .run(function (error, cities) {
                if (error) {
                    logger.error("find city error : " + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("find city successfully, length of cities = " + cities.length);
                    callback(errorCode.SUCCESS, cities);
                }
            });
    }

};

City.countCitiesByConditions = function(conditions, callback) {
    dbOrm.driver.execQuery("SELECT COUNT(id) AS number FROM city WHERE " + conditions,
        function (countCitiesErr, result) {
            if (countCitiesErr) {
                logger.info("count cities failed : " + countCitiesErr);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("count cities successfully : " + JSON.stringify(result));
                callback(errorCode.SUCCESS, result);
            }
        });
};

module.exports = City;