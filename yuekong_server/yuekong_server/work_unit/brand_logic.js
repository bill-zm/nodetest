/**
 * Created by strawmanbobi
 * 2015-01-23
 */

var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
require('../../../Infrastructure/BackEnd/configuration/constants');

var Brand = require('../model/brand_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var async = require('async');

var enums = new Enums();
var errorCode = new ErrorCode();

exports.createBrandWorkUnit = function (brand, callback) {
    Brand.createBrand(brand, function (createBrandErr, createdBrand) {
        if(errorCode.SUCCESS.code == createBrandErr.code) {
            callback(createBrandErr, createdBrand);
        } else {
            callback(createBrandErr, null);
        }
    });
};

exports.listBrandsWorkUnit = function (categoryID, from, count, isTest, pdsn, UA, callback) {
    var conditions;
    var lang = enums.LANGUAGE_CN;

    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    /**** FOR TEST ONLY ****/
    if(null != isTest && undefined != isTest) {
        conditions = {
            status: orm.gt(enums.ITEM_INVALID),
            category_id: categoryID
        };
    } else {
        conditions = {
            status: enums.ITEM_VALID,
            category_id: categoryID
        };
    }

    if (null != pdsn && "null" != pdsn) {
        conditions.protector = orm.like("%" + pdsn.charAt(0) + "%");
    }

    // adjust brand count for Android V2.0.1 and iOS V2.1.8
    if(UA.indexOf('Android') > -1) {
        // this request comes from an Android client
        if (UA <= 'UCON_Android_V2.0.1') {
            count = 300;
        }
    } else if(UA.indexOf('YueKong/') > -1) {
        if (UA <= 'YueKong/2.1.8') {
            count = 300;
        }
    }

    logger.info("list brands, conditions = " + conditions);

    Brand.listBrands(conditions, from, count, "priority", function(listBrandsErr, brands) {
        if (errorCode.SUCCESS.code == listBrandsErr.code &&
            undefined != brands && null != brands && brands.length > 0) {
            for (var i = 0; i < brands.length; i++) {
                var brand = brands[i];
                if (lang == enums.LANGUAGE_EN) {
                    brand.name = brand.name_en;
                } else if (lang == enums.LANGUAGE_TW) {
                    brand.name = brand.name_tw;
                }
            }
        }
        callback(listBrandsErr, brands);
    });
};

exports.listPopularBrandsWorkUnit = function (categoryID, pdsn, UA, callback) {
    var conditions;
    var limit = 10;
    var lang = enums.LANGUAGE_CN;

    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    conditions = {
        status: enums.ITEM_VALID,
        category_id: categoryID,
        priority: orm.ne(999)
    };

    if (categoryID == enums.CATEGORY_AC ||
        categoryID == enums.CATEGORY_TV) {
        if (UA.indexOf("SIRIUS") > -1) {
            limit = 9;
        } else {
            limit = 10;
        }
    } else {
        limit = 6;
    }

    if (null != pdsn && "null" != pdsn) {
        conditions.protector = orm.like("%" + pdsn.charAt(0) + "%");
    }

    Brand.listBrands(conditions, 0, limit, "priority", function(getBrandByIDErr, brands) {
        if (errorCode.SUCCESS.code == getBrandByIDErr.code &&
            undefined != brands && null != brands && brands.length > 0) {
            for (var i = 0; i < brands.length; i++) {
                var brand = brands[i];
                if (lang == enums.LANGUAGE_EN) {
                    brand.name = brand.name_en;
                } else if (lang == enums.LANGUAGE_TW) {
                    brand.name = brand.name_tw;
                }
            }
        }
        callback(getBrandByIDErr, brands);
    });
};

exports.getBrandByIDWorkUnit = function (brandID, callback) {
    Brand.getBrandByID(brandID, function(getBrandByIDErr, brand) {
        if(errorCode.SUCCESS.code == getBrandByIDErr.code &&
            brand &&
            (enums.ITEM_VALID == brand.status ||
            enums.ITEM_VERIFY == brand.status)) {
            callback(getBrandByIDErr, brands);
        } else {
            callback(errorCode.BRAND_NOT_FOUND, null);
        }
    });
};

exports.publishBrandsWorkUnit = function (brandList, callback) {
    async.eachSeries(brandList, function (brand, innerCallback) {
        var conditions = {
            name: brand.name,
            category_id: brand.category_id
        };
        Brand.findBrandByConditions(conditions, function(findBrandErr, brands) {
            if (findBrandErr.code == errorCode.SUCCESS.code && undefined != brands && null != brands &&
                brands.length > 0) {
                logger.info("found certain brands in brands publish, update its status");
                if(brands[0].status != enums.ITEM_VALID) {
                    brands[0].status = enums.ITEM_VALID;
                    Brand.updateBrandByID(brands[0].id, brands[0], function(updateBrandErr, updatedBrand) {
                        innerCallback();
                    });
                } else {
                    innerCallback();
                }
            } else {
                Brand.createBrand(brand, function(createBrandErr) {
                    innerCallback();
                });
            }
        });
    }, function (err) {
        callback(errorCode.SUCCESS);
    });
};