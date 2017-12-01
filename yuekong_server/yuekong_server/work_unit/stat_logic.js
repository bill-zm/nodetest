/**
 * Created by strawmanbobi
 * 2015-12-28
 */
// system inclusion
fs = require('fs');

require('../../../Infrastructure/BackEnd/configuration/constants');
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');

var Stat = require('../model/virtual_stat_dao.js');
var RemoteInstance = require('../model/remote_instance_dao.js');
var Remote = require('../model/remote_dao.js');
var DeviceInstance = require('../model/device_instance_dao.js');
var Category = require('../model/category_dao.js');
var Brand = require('../model/brand_dao.js');
var City = require('../model/city_dao.js');
var RemoteIndexII = require('../model/remote_index_ii_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var enums = new Enums();
var errorCode = new ErrorCode();

var async = require('async');

exports.createStatWorkUnit = function (stat, UA, callback) {
    Stat.prototype.createStat(stat, function(createStatErr, createdStat) {
        callback(createStatErr, createdStat);
    });
};

exports.genericCountWorkUnit = function(statType, callback) {
    if (statType == enums.STAT_TYPE_REMOTE_INSTANCE_ACTIVE) {
        RemoteInstance.countRemoteInstances(null, function(countRemoteInstancesErr, remoteInstancesCount) {
            callback(countRemoteInstancesErr, remoteInstancesCount);
        });
    } else if (statType == enums.STAT_TYPE_DEVICE_ACTIVE) {
        DeviceInstance.countDeviceInstances(null, function(countDeviceInstancesErr, deviceInstancesCount) {
            callback(countDeviceInstancesErr, deviceInstancesCount);
        });
    } else if (statType == enums.STAT_TYPE_REMOTE_ACTIVE) {
        Remote.countRemotes(null, function(countRemotesErr, remotesCount) {
            callback(countRemotesErr, remotesCount);
        });
    } else {
        logger.error("count type not valid : " + statType);
        callback(errorCode.FAILED, null);
    }
};

exports.genericStatWorkUnit = function (statType, beginDate, endDate, callback) {
    if (statType == enums.STAT_TYPE_REMOTE_INSTANCE_ACTIVE) {
        RemoteInstance.statRemoteInstances(beginDate, endDate, function(statRemoteInstancesErr, remoteInstancesStat) {
            callback(statRemoteInstancesErr, remoteInstancesStat);
        });
    } else if (statType == enums.STAT_TYPE_DEVICE_ACTIVE) {
        DeviceInstance.statDeviceInstances(beginDate, endDate, function(statDeviceInstancesErr, deviceInstancesStat) {
            callback(statDeviceInstancesErr, deviceInstancesStat);
        });
    } else if (statType == enums.STAT_TYPE_REMOTE_ACTIVE) {
        Remote.statRemotes(beginDate, endDate, function(statRemotesErr, remotesStat) {
            callback(statRemotesErr, remotesStat);
        });
    } else {
        logger.error("stat type not valid : " + statType);
        callback(errorCode.FAILED, null);
    }
};

exports.statCategoriesWorkUnit = function (callback) {
    var conditions = {
        status: enums.ITEM_VALID
    };

    var retCategoriesCount = [];

    Category.listCategories(conditions, 0, 200, "id", function(findCategoriesErr, categories) {
        if (errorCode.FAILED.code == findCategoriesErr.code) {
            logger.error("failed to find categories");
            callback(findCategoriesErr, null);
        } else {
            async.eachSeries(categories, function (category, innerCallback) {
                var categoryName = category.name;
                var categoryID = category.id;
                if (enums.CATEGORY_STB != categoryID) {
                    var countConditions = {
                        category_id: categoryID,
                        status: enums.ITEM_VALID
                    };
                    Brand.countBrandsByConditions(countConditions,
                        function(countBrandsErr, brandsCount) {
                            if (errorCode.SUCCESS.code == countBrandsErr.code) {
                                var categoryStat = new Object();
                                categoryStat.id = categoryID;
                                categoryStat.name = categoryName;
                                categoryStat.brands_count = brandsCount;
                                retCategoriesCount.push(categoryStat);
                            } else {
                                logger.error("failed to count categories");
                            }
                            innerCallback();
                        });
                } else {
                    var countConditions = "code LIKE '__0000';";
                    City.countCitiesByConditions(countConditions,
                        function(countCitiesErr, citiesCount) {
                            if (errorCode.SUCCESS.code == countCitiesErr.code) {
                                var categoryStat = new Object();
                                categoryStat.id = categoryID;
                                categoryStat.name = categoryName;
                                categoryStat.brands_count = citiesCount[0].number;
                                retCategoriesCount.push(categoryStat);
                            } else {
                                logger.error("failed to count categories");
                            }
                            innerCallback();
                        });
                }

            }, function (err) {
                callback(errorCode.SUCCESS, retCategoriesCount);
            });
        }
    });
};

exports.statBrandsWorkUnit = function (categoryID, callback) {
    var conditions = {
        category_id: categoryID,
        status: enums.ITEM_VALID
    };

    var retBrandsCount = [];

    Brand.listBrands(conditions, 0, 200, "priority", function(findBrandsErr, brands) {
        if (errorCode.FAILED.code == findBrandsErr.code) {
            logger.error("failed to find brands");
            callback(findBrandsErr, null);
        } else {
            async.eachSeries(brands, function (brand, innerCallback) {
                var brandName = brand.name;
                var brandID = brand.id;

                if (enums.CATEGORY_STB != categoryID) {
                    var countConditions = {
                        brand_id: brandID,
                        status: enums.ITEM_VALID
                    };
                    RemoteIndexII.countRemoteIndexesByConditions(countConditions,
                        function(countRemoteIndexesErr, remoteIndexesCount) {
                            if (errorCode.SUCCESS.code == countRemoteIndexesErr.code) {
                                var brandStat = new Object();
                                brandStat.id = brandID;
                                brandStat.name = brandName;
                                brandStat.remote_indexes_count = remoteIndexesCount;
                                retBrandsCount.push(brandStat);
                            } else {
                                logger.error("failed to count remote indexes");
                            }
                            innerCallback();
                        });
                }
            }, function (err) {
                callback(errorCode.SUCCESS, retBrandsCount);
            });
        }
    });
};

exports.statCitiesWorkUnit = function (callback) {
    var retCitiesCount = [];

    City.listProvinces(null, function(listProvincesErr, provinces) {
        if (errorCode.FAILED.code == listProvincesErr.code) {
            logger.error("failed to find brands");
            callback(listProvincesErr, null);
        } else {
            async.eachSeries(provinces, function (province, innerCallback) {
                var provinceName = province.name;
                var provinceCode = province.code;
                var provincePrefix = provinceCode.substring(0, 2);
                var countConditions = "code LIKE '" + provincePrefix + "__00' AND code <> '" + provincePrefix + "0000';";
                City.countCitiesByConditions(countConditions,
                    function(countCitiesErr, citiesCount) {
                        if (errorCode.SUCCESS.code == countCitiesErr.code) {
                            var cityStat = new Object();
                            cityStat.name = provinceName;
                            cityStat.city_count = citiesCount[0].number;
                            retCitiesCount.push(cityStat);
                        } else {
                            logger.error("failed to count cities");
                        }
                        innerCallback();
                    });
            }, function (err) {
                callback(errorCode.SUCCESS, retCitiesCount);
            });
        }
    });
};