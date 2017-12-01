/**
 * Created by strawmanbobi
 * 2015-01-23
 */

var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
require('../../../Infrastructure/BackEnd/configuration/constants');

var Category = require('../model/category_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var enums = new Enums();
var errorCode = new ErrorCode();

exports.createCategoryWorkUnit = function (category, callback) {
    Category.createCategory(category, function (createCategoryErr, createdCategory) {
        if(errorCode.SUCCESS.code == createCategoryErr.code) {
            callback(createCategoryErr, createdCategory);
        } else {
            callback(createCategoryErr, null);
        }
    });
};

exports.listCategoriesWorkUnit = function (from, count, pdsn, UA, callback) {
    var conditions = {
        status: orm.gt(enums.ITEM_INVALID)
    };
    var version = '';
    var lang = enums.LANGUAGE_CN;

    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    var isUnprotectedApp = false;

    var retCategories = [];

    if(UA.indexOf('Android') > -1) {
        // this request comes from an Android client
        if(UA < 'UCON_Android_V1.4.0') {
            // the reference applied remote version is fixed by server logic since this version is not specified by App,
            // server does not know what the version of the UCON controller is, so, if there are some remote index are not
            // marked as eternal (V99.0.0), ban them all
            callback(errorCode.FAILED, null);
        } else {
            version = UA.substring(14);
            // updated compatibility for localization constraint
            if (null != pdsn && "null" != pdsn) {
                // this indicates the request is from APP with version above V2.0.0
                conditions.protector = orm.like("%" + pdsn.charAt(0) + "%");
            } else {
                isUnprotectedApp = true;
            }
            retCategories.length = 0;
            Category.listCategories(conditions, from, count, "id", function(getCategoryByIDErr, categories) {
                for (var index = 0; index < categories.length; index++) {
                    var category = categories[index];
                    if (category.applied_android_version > ('V' + version) ||
                        category.banned_android_version <= ('V' + version)) {
                        // category.status = enums.ITEM_VERIFY;
                        // categories.splice(index, 1);
                        continue;
                    }
                    if (true == isUnprotectedApp && category.id == enums.CATEGORY_BSTB) {
                        // disable STB in international version
                        // categories.splice(index, 1);
                        continue;
                    } else {
                        // change name according to language context
                        if (lang == enums.LANGUAGE_CN) {
                            if (category.id == enums.CATEGORY_BSTB) {
                                // disable STB in international version
                                // category.status = enums.ITEM_VERIFY;
                                // categories.splice(index, 1);
                                continue;
                            }
                        } else if (lang == enums.LANGUAGE_EN) {
                            if (category.id == enums.CATEGORY_STB||
                                category.id == enums.CATEGORY_IPTV) {
                                // disable STB in international version
                                // category.status = enums.ITEM_VERIFY;
                                // categories.splice(index, 1);
                                continue;
                            }
                            category.name = category.name_en;
                        } else if (lang == enums.LANGUAGE_TW) {
                            if (category.id == enums.CATEGORY_STB ||
                                category.id == enums.CATEGORY_IPTV) {
                                // disable STB in international version
                                // category.status = enums.ITEM_VERIFY;
                                // categories.splice(index, 1);
                                continue;
                            }
                            category.name = category.name_tw;
                        }
                        retCategories.push(category);
                    }
                }
                callback(getCategoryByIDErr, retCategories);
            });
        }
    } else if(UA.indexOf('YueKong/') > -1) {
        // this request comes from an iOS client
        if(UA < 'YueKong/1.4.0') {
            // the reference applied remote version is fixed by server logic since this version is not specified by App,
            // server does not know what the version of the UCON controller is, so, if there are some remote index are not
            // marked as eternal (V99.0.0), ban them all
            callback(errorCode.FAILED, null);
        } else {
            version = UA.substring(8);
            // updated compatibility for localization constraint
            if (null != pdsn && "null" != pdsn) {
                // this indicates the request is from APP with version above V2.1.0
                conditions.protector = orm.like("%" + pdsn.charAt(0) + "%");
            } else {
                isUnprotectedApp = true;
            }
            retCategories.length = 0;
            Category.listCategories(conditions, from, count, "id", function(getCategoryByIDErr, categories) {
                for (var index = 0; index < categories.length; index++) {
                    var category = categories[index];
                    if(category.applied_ios_version > ('V' + version) ||
                        category.banned_ios_version <= ('V' + version)) {
                        // category.status = enums.ITEM_VERIFY;
                        // categories.splice(index, 1);
                        continue;
                    }
                    // change name according to language context
                    if (true == isUnprotectedApp && category.id == enums.CATEGORY_BSTB) {
                        // disable STB in international version
                        // categories.splice(index, 1);
                        continue;
                    } else {
                        // change name according to language context
                        if (lang == enums.LANGUAGE_CN) {
                            if (category.id == enums.CATEGORY_BSTB) {
                                // disable STB in international version
                                // category.status = enums.ITEM_VERIFY;
                                // categories.splice(index, 1);
                                continue;
                            }
                        } else if (lang == enums.LANGUAGE_EN) {
                            if (category.id == enums.CATEGORY_STB||
                                category.id == enums.CATEGORY_IPTV) {
                                // disable STB in international version
                                // category.status = enums.ITEM_VERIFY;
                                // categories.splice(index, 1);
                                continue;
                            }
                            category.name = category.name_en;
                        } else if (lang == enums.LANGUAGE_TW) {
                            if (category.id == enums.CATEGORY_STB||
                                category.id == enums.CATEGORY_IPTV) {
                                // disable STB in international version
                                // category.status = enums.ITEM_VERIFY;
                                // categories.splice(index, 1);
                                continue;
                            }
                            // work-around for iOS V2.1.6 category id issue
                            if (UA.indexOf('2.1.6') > -1 && enums.CATEGORY_BSTB == category.id) {
                                // category.id = enums.CATEGORY_STB;
                                var tempCategory = {
                                    id: enums.CATEGORY_STB,
                                    name: category.name_tw,
                                    status: category.status,
                                    create_time: category.create_time,
                                    radio_type: category.radio_type,
                                    ble_mode: category.ble_mode
                                };
                                retCategories.push(tempCategory);
                                continue;
                            } else {
                                logger.error("match missed : " + UA.indexOf('2.1.6') + ", " + category.id);
                            }
                            category.name = category.name_tw;
                        }
                        retCategories.push(category);
                    }
                }
                // logger.info("000000" + JSON.stringify(retCategories));
                callback(getCategoryByIDErr, retCategories);
            });
        }
    } else if(UA.indexOf('SIRIUS') > -1) {
        conditions.id = orm.lte("10");
        Category.listCategories(conditions, from, count, "id", function(getCategoryByIDErr, categories) {
            callback(getCategoryByIDErr, categories);
        });
    } else {
        Category.listCategories(conditions, from, count, "id", function(getCategoryByIDErr, categories) {
            callback(getCategoryByIDErr, categories);
        });
    }
};

exports.getCategoryByIDWorkUnit = function (categoryID, callback) {
    Category.getCategoryByID(categoryID, function(getCategoryByIDErr, category) {
        if(errorCode.SUCCESS.code == getCategoryByIDErr.code &&
            category &&
            enums.ITEM_VALID == category.status) {
            callback(getCategoryByIDErr, category);
        } else {
            callback(errorCode.CATEGORY_NOT_FOUND, null);
        }
    });
};