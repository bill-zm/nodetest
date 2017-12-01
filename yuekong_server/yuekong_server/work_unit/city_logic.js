/**
 * Created by strawmanbobi
 * 2015-01-23
 */

require('../../../Infrastructure/BackEnd/configuration/constants');

var City = require('../model/city_dao.js');
var Brand = require('../model/brand_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var enums = new Enums();
var errorCode = new ErrorCode();

exports.listProvincesWorkUnit = function (pdsn, UA, callback) {
    var lang = enums.LANGUAGE_CN;

    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    logger.info("select provinces pdsn : " + pdsn);

    // work-around for iOS V2.1.6 category id issue
    if(UA.indexOf('YueKong/') > -1 && UA.indexOf("2.1.6") > -1 && lang == enums.LANGUAGE_TW) {
        var conditions = {
            category_id: enums.CATEGORY_BSTB,
            status: enums.ITEM_VALID
        };
        Brand.listBrands(conditions, 0, 50, "priority", function(listBrandsErr, brands) {
            if (errorCode.SUCCESS.code == listBrandsErr.code &&
                undefined != brands && null != brands && brands.length > 0) {
                for (var i = 0; i < brands.length; i++) {
                    var brand = brands[i];
                    if (lang == enums.LANGUAGE_EN) {
                        brand.name = brand.name_en;
                    } else if (lang == enums.LANGUAGE_TW) {
                        brand.name = brand.name_tw;
                        brand.code = brand.id + "";
                        brand.longitude = 0.0;
                        brand.latitude = 0.0;
                    }
                }
            }
            callback(listBrandsErr, brands);
        });
    } else {
        City.listProvinces(pdsn, function(listProvincesErr, provinces) {
            if (errorCode.SUCCESS.code == listProvincesErr.code && provinces.length > 0) {
                for (var i = 0; i < provinces.length; i++) {
                    var province = provinces[i];
                    if (lang == enums.LANGUAGE_TW) {
                        province.name = province.name_tw;
                    }
                }
            }
            callback(listProvincesErr, provinces);
        });
    }
};

exports.listCitiesWorkUnit = function (provincePrefix, pdsn, UA, callback) {
    var lang = enums.LANGUAGE_CN;

    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    // work-around for iOS V2.1.6 category id issue
    if(UA.indexOf('YueKong/') > -1 && UA.indexOf("2.1.6") > -1 && lang == enums.LANGUAGE_TW) {
        var conditions = {
            category_id: enums.CATEGORY_BSTB,
            status: enums.ITEM_VALID
        };
        Brand.listBrands(conditions, 0, 50, "priority", function(listBrandsErr, brands) {
            if (errorCode.SUCCESS.code == listBrandsErr.code &&
                undefined != brands && null != brands && brands.length > 0) {
                for (var i = 0; i < brands.length; i++) {
                    var brand = brands[i];
                    if (lang == enums.LANGUAGE_EN) {
                        brand.name = brand.name_en;
                    } else if (lang == enums.LANGUAGE_TW) {
                        brand.name = brand.name_tw;
                        brand.code = brand.id + "";
                        brand.longitude = 0.0;
                        brand.latitude = 0.0;
                    }
                }
            }
            callback(listBrandsErr, brands);
        });
    } else {

        City.listCities(provincePrefix, pdsn, function (listCitiesErr, cities) {
            if (errorCode.SUCCESS.code == listCitiesErr.code && cities.length > 0) {
                for (var i = 0; i < cities.length; i++) {
                    var city = cities[i];
                    if (lang == enums.LANGUAGE_TW) {
                        city.name = city.name_tw;
                    }
                }
            }
            callback(listCitiesErr, cities);
        });
    }
};

exports.listCityAreasWorkUnit = function (cityPrefix, UA, callback) {
    var lang = enums.LANGUAGE_CN;

    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    City.listCityAreas(cityPrefix, function (listAreasErr, areas) {
        if (errorCode.SUCCESS.code == listAreasErr.code && areas.length > 0) {
            for (var i = 0; i < areas.length; i++) {
                var area = areas[i];
                if (lang == enums.LANGUAGE_TW) {
                    area.name = area.name_tw;
                }
            }
        }
        callback(listAreasErr, areas);
    });
};

exports.listCoveredCitiesWorkUnit = function (from, count, UA, callback) {
    var lang = enums.LANGUAGE_CN;
    var conditions = null;

    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    // work-around for iOS V2.1.6 category id issue
    if (UA.indexOf('SIRIUS') > -1) {
        var siriusCoveredCityCodes = ["110100", "120100", "310100", "320100", "330100", "440100", "440300", "500100"];
        var retCities = [];
        conditions = {
            status: enums.CITY_COVERED
        };
        City.findCitiesByConditions(conditions, from, count, "id", function(listCitiesErr, cities) {
            if (errorCode.SUCCESS.code == listCitiesErr.code && cities.length > 0) {
                for (var i = 0; i < cities.length; i++) {
                    if(isCityInList(siriusCoveredCityCodes, cities[i].code)) {
                        retCities.push(cities[i]);
                    }
                }
            }
            callback(listCitiesErr, retCities);
        });
    } else if (UA.indexOf('YueKong/') > -1 && UA.indexOf("2.1.6") > -1 && lang == enums.LANGUAGE_TW) {
        conditions = {
            category_id: enums.CATEGORY_BSTB,
            status: enums.ITEM_VALID
        };
        Brand.listBrands(conditions, from, count, "priority", function(listBrandsErr, brands) {
            if (errorCode.SUCCESS.code == listBrandsErr.code &&
                undefined != brands && null != brands && brands.length > 0) {
                for (var i = 0; i < brands.length; i++) {
                    var brand = brands[i];
                    if (lang == enums.LANGUAGE_EN) {
                        brand.name = brand.name_en;
                    } else if (lang == enums.LANGUAGE_TW) {
                        brand.name = brand.name_tw;
                        brand.code = brand.id + "";
                        brand.longitude = 0.0;
                        brand.latitude = 0.0;
                    }
                }
            }
            callback(listBrandsErr, brands);
        });
    } else {
        conditions = {
            status: enums.CITY_COVERED
        };
        City.findCitiesByConditions(conditions, from, count, "id", function(listCitiesErr, cities) {
            if (errorCode.SUCCESS.code == listCitiesErr.code && cities.length > 0) {
                for (var i = 0; i < cities.length; i++) {
                    var city = cities[i];
                    if (lang == enums.LANGUAGE_TW) {
                        city.name = city.name_tw;
                    }
                }
            }
            callback(listCitiesErr, cities);
        });
    }
};

// Utilities
function isCityInList(cityCodeList, cityCode) {
    for (var i = 0; i < cityCodeList.length; i++) {
        if (cityCodeList[i] == cityCode) {
            return true;
        }
    }
    return false;
}