/**
 * Created by strawmanbobi
 * 2015-01-25.
 */

// global inclusion
require('../../../Infrastructure/BackEnd/configuration/constants');

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var CategoryResponse = require('../response/category_response.js');
var SingleCategoryResponse = require('../response/single_category_response.js');
var BrandResponse = require('../response/brand_response.js');
var SingleBrandResponse = require('../response/single_brand_response.js');
var StringResponse = require('../response/string_response.js');
var RemoteIndexResponse = require('../response/remote_index_response.js');
var IntegerResponse = require('../response/integer_response.js');
var SingleBleRemoteIndexResponse = require('../response/single_ble_remote_index_response');

var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var categoryLogic = require('../work_unit/category_logic.js');
var brandLogic = require('../work_unit/brand_logic.js');
var remoteIndexLogic = require('../work_unit/remote_index_logic.js');
var bleRemoteIndexLogic = require('../work_unit/ble_remote_index_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Create category
 * parameter :  HTTP body of category
 * return :     SingleCategoryResponse
 */
exports.createCategory = function (req, res) {
    var category = req.body;

    var singleCategoryResponse = new SingleCategoryResponse();
    categoryLogic.createCategoryWorkUnit(category, function (createCategoryErr, createdCategory) {
        singleCategoryResponse.status = createCategoryErr;
        singleCategoryResponse.entity = createdCategory;
        res.send(singleCategoryResponse);
        res.end();
    });
};

/*
* function :   List Categories
* parameter :  from
*              count
* return :     CategoryResponse
*/
exports.listCategories = function (req, res) {
    var from = req.query.from;
    var count = req.query.count;

    // updated compatibility for localization constraint
    var pdsn = req.query.pdsn;

    var UA = req.headers['user-agent'];

    var categoryResponse = new CategoryResponse();
    categoryLogic.listCategoriesWorkUnit(from, count, pdsn, UA, function (listCategoriesErr, categories) {
        logger.info(JSON.stringify(categories));
        categoryResponse.status = listCategoriesErr;
        categoryResponse.entity = categories;
        res.send(categoryResponse);
        res.end();
    });
};

/*
* function :   Get category by ID
* parameter :  category_id
* return :     CategoryResponse
*/
exports.getCategoryByID = function (req, res) {
    var categoryID = req.query.category_id;

    var categoryResponse = new CategoryResponse();
    categoryLogic.getCategoryByIDWorkUnit(categoryID, function (getCategoryByIDErr, categories) {
        categoryResponse.status = getCategoryByIDErr;
        categoryResponse.entity = categories;
        res.send(categoryResponse);
        res.end();
    });
};

/*
 * function :   Create brand
 * parameter :  HTTP body of brand
 * return :     SingleBrandResponse
 */
exports.createBrand = function (req, res) {
    var brand = req.body;

    var singleBrandResponse = new SingleBrandResponse();
    brandLogic.createBrandWorkUnit(brand, function (createBrandErr, createdBrand) {
        singleBrandResponse.status = createBrandErr;
        singleBrandResponse.entity = createdBrand;
        res.send(singleBrandResponse);
        res.end();
    });
};

/*
 * function :   List Brands
 * parameter :  from
 *              count
 *              categoryID
 * return :     BrandResponse
 */
exports.listBrands = function (req, res) {
    var categoryID = req.query.category_id;
    var from = req.query.from;
    var count = req.query.count;
    var isTest = req.query.is_test;

    // updated compatibility for localization constraint
    var pdsn = req.query.pdsn;

    logger.info("list popular brands, categoryID = " + categoryID + ", pdsn = " + pdsn + " is_test = " +
        isTest + ", from = " + from + ", count = " + count);

    var UA = req.headers['user-agent'];

    var brandResponse = new BrandResponse();
    brandLogic.listBrandsWorkUnit(categoryID, from, count, isTest, pdsn, UA, function (listBrandsErr, brands) {
        brandResponse.status = listBrandsErr;
        brandResponse.entity = brands;
        res.send(brandResponse);
        res.end();
    });
};

/*
 * function :   List Popular Brands
 * return :     BrandResponse
 */
exports.listPopularBrands = function (req, res) {
    var categoryID = req.query.category_id;
    var pdsn = req.query.pdsn;

    var UA = req.headers['user-agent'];

    logger.info("list popular brands, categoryID = " + categoryID + ", pdsn = " + pdsn);

    var brandResponse = new BrandResponse();
    brandLogic.listPopularBrandsWorkUnit(categoryID, pdsn, UA, function (listBrandsErr, brands) {
        brandResponse.status = listBrandsErr;
        brandResponse.entity = brands;
        res.send(brandResponse);
        res.end();
    });
};

/*
 * function :   List remote indexes
 * parameter :  category ID
 *              brand ID
 *              city code
 *              from
 *              count
 *              is test (optional)
 *              applicable remote version (optional)
 *              applicable device version (optional)
 * return :     RemoteIndexResponse
 */
exports.listRemoteIndexes = function (req, res) {
    var categoryID = req.query.category_id;
    var brandID = req.query.brand_id;
    var cityCode = req.query.city_code;
    var from = req.query.from;
    var count = req.query.count;
    // updated compatibility for localization constraint
    var pdsn = req.query.pdsn;
    var isTest = req.query.is_test; // optional parameter
    var appliedRemoteVersion = req.query.remote_version; // optional parameter
    // var appliedDeviceVersion = req.query.device_version; // optional parameter

    var UA = req.headers['user-agent'];

    logger.info("user-agent = " + UA);

    var remoteIndexResponse = new RemoteIndexResponse();

    if (UA.indexOf("SIRIUS") > -1) {
        remoteIndexLogic.listRemoteIndexesForSiriusWorkUnit(categoryID, brandID, cityCode, from, count, UA,
            function(listRemoteIndexesErr, remoteIndexes) {
                remoteIndexResponse.status = listRemoteIndexesErr;
                remoteIndexResponse.entity = remoteIndexes;
                res.send(remoteIndexResponse);
                res.end();
            });
    } else {
        remoteIndexLogic.listRemoteIndexesWorkUnit(categoryID, brandID, cityCode, from, count,
            isTest, appliedRemoteVersion, pdsn, UA,
            function(listRemoteIndexesErr, remoteIndexes) {
                remoteIndexResponse.status = listRemoteIndexesErr;
                remoteIndexResponse.entity = remoteIndexes;
                res.send(remoteIndexResponse);
                res.end();
            });
    }
};

/*
 * function :   List remote indexes by operator
 * parameter :  operator ID
 *              from
 *              count
 *              is test (optional)
 *              applicable remote version (optional)
 *              applicable device version (optional)
 * return :     RemoteIndexResponse
 * this API is for SIRIUS use only, temporarily
 */
exports.listRemoteIndexesByOperator = function (req, res) {
    var operatorID = req.query.operator_id;
    var from = req.query.from;
    var count = req.query.count;
    var isTest = req.query.is_test; // optional parameter

    var UA = req.headers['user-agent'];

    logger.info("user-agent = " + UA);

    var remoteIndexResponse = new RemoteIndexResponse();

    remoteIndexLogic.listRemoteIndexesByOperatorWorkUnit(operatorID, from, count, UA,
        function(listRemoteIndexesErr, remoteIndexes) {
            remoteIndexResponse.status = listRemoteIndexesErr;
            remoteIndexResponse.entity = remoteIndexes;
            res.send(remoteIndexResponse);
            res.end();
        });
};

/*
 * function :   Count user remote indexes
 * parameter :  SNS ID
 *              SNS type
 *              Mobile ID
 * return :     IntegerResponse
 */
exports.countUserRemoteIndexes = function (req, res) {
    var snsID = req.query.sns_id;
    var snsType = req.query.sns_type;
    var mobileID = req.query.mobile_id;
    var remoteVersion = req.query.remote_version;
    var configuredRemoteIDs = req.query.remote_ids;

    var UA = req.headers['user-agent'];

    var integerResponse = new IntegerResponse();
    remoteIndexLogic.listUserRemoteIndexesWorkUnit(snsID, snsType, mobileID, remoteVersion, configuredRemoteIDs, UA, 0,
        function(listRemoteIndexesErr, remoteIndexes) {
            integerResponse.status = listRemoteIndexesErr;
            integerResponse.entity = remoteIndexes;
            res.send(integerResponse);
            res.end();
        });
};

/*
 * function :   List user remote indexes
 * parameter :  SNS ID
 *              SNS type
 *              Mobile ID
 * return :     RemoteIndexResponse
 */
exports.listUserRemoteIndexes = function (req, res) {
    var snsID = req.query.sns_id;
    var snsType = req.query.sns_type;
    var mobileID = req.query.mobile_id;
    var remoteVersion = req.query.remote_version;
    var configuredRemoteIDs = req.query.remote_ids;

    var UA = req.headers['user-agent'];

    var remoteIndexResponse = new RemoteIndexResponse();
    remoteIndexLogic.listUserRemoteIndexesWorkUnit(snsID, snsType, mobileID, remoteVersion, configuredRemoteIDs, UA, 1,
        function(listRemoteIndexesErr, remoteIndexes) {
            logger.info("****** status of ws call = " + listRemoteIndexesErr);
            logger.info("****** size of remote indexes = " + remoteIndexes.length);
            remoteIndexResponse.status = listRemoteIndexesErr;
            remoteIndexResponse.entity = remoteIndexes;
            res.send(remoteIndexResponse);
            res.end();
        });
};

/*
 * function :   Get brand by ID
 * parameter :  brand_id
 * return :     BrandResponse
 */
exports.getBrandByID = function (req, res) {
    var brandID = req.query.brand_id;

    var brandResponse = new BrandResponse();
    brandLogic.getBrandByIDWorkUnit(brandID, function (getBrandByIDErr, brands) {
        brandResponse.status = getBrandByIDErr;
        brandResponse.entity = brands;
        res.send(brandResponse);
        res.end();
    });
};

/*
 * function :   Download remote binary
 * parameter :  filename
 * return :     BinaryStream
 */
exports.downloadRemoteBin = function(req, res) {
    var fileName = req.params.file_name;
    var binaryVersion = req.query.binary_version;

    // since response defined by express is passed as a parameter of downloadRemoteBinWorkUnit function
    // actually res and response in callback point to the same object
    remoteIndexLogic.downloadRemoteBinWorkUnit(fileName, binaryVersion, res, function (serveBinErr, response) {
        if (errorCode.SUCCESS.code == serveBinErr.code) {
            response.end();
        } else {
            logger.info('serve binary of remote file error: ' + fileName);
            res.write('');
            res.end();
        }
    });
};

/*
 * function :   Download remote binary cached
 * parameter :  filename
 * return :     BinaryStream
 */
exports.downloadRemoteBinCached = function(req, res) {
    var fileName = req.params.file_name;

    remoteIndexLogic.downloadRemoteBinCachedWorkUnit(fileName, function (serveBinErr, filePath) {
        if (errorCode.SUCCESS.code == serveBinErr.code) {
            logger.info("download file located at " + filePath);
            res.download(filePath, "");
        } else {
            logger.info("download file failed");
            res.write('');
            res.end();
        }
    });
};

/*
 * function :   Get BLE remote index
 * parameter :  remote index ID
 * return :     SingleBleRemoteIndexResponse
 */
exports.getBleRemoteIndex = function (req, res) {
    var remoteIndexID = req.query.remote_index_id;

    var singleBleRemoteIndexResponse = new SingleBleRemoteIndexResponse();
    bleRemoteIndexLogic.getBleRemoteIndexWorkUnit(remoteIndexID,
        function(getBleRemoteIndexErr, bleRemoteIndex) {
            singleBleRemoteIndexResponse.status = getBleRemoteIndexErr;
            singleBleRemoteIndexResponse.entity = bleRemoteIndex;
            res.send(singleBleRemoteIndexResponse);
            res.end();
        });
};

/*
 * function :   Match remote according to key
 * parameter :  PDSN
 *              token
 *              match string
 * return :     StringReponse
 */
exports.matchRemote = function (req, res) {
    var version = req.query.version;

    var matchObj = req.body;

    var categoryID = matchObj.category_id;
    var brandID = matchObj.brand_id;
    var cityCode = matchObj.city_code;
    var remoteKey = matchObj.key;
    var code = matchObj.code;

    var keyMatchResponse = new StringResponse();
    remoteIndexLogic.matchKeyCodeWorkUnit(categoryID, brandID, cityCode, remoteKey, code, version,
        function (matchKeyCodeErr, matchCount, remoteFiles) {
        keyMatchResponse.status = matchKeyCodeErr;
        keyMatchResponse.matchCount = matchCount;
        keyMatchResponse.remoteFiles = remoteFiles;
        res.send(keyMatchResponse);
        res.end();
    });
};

/*
 * function :   Publish brands
 * parameter :  brand object list
 * return :     ServiceResponse
 */
exports.publishBrands = function (req, res) {
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;
    var brandList = req.body;

    var serviceResponse = new ServiceResponse();

    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        serviceResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(serviceResponse);
        res.end();
    } else {
        brandLogic.publishBrandsWorkUnit(brandList, function(publishBrandErr) {
            serviceResponse.status = publishBrandErr;
            res.send(serviceResponse);
            res.end();
        });
    }
};

/*
 * function :   Publish remote indexes
 * parameter :  remote index object list
 *              app key
 *              app token
 * return :     ServiceResponse
 */
exports.publishRemoteIndexes = function (req, res) {
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;
    var remoteIndexList = req.body;

    var serviceResponse = new ServiceResponse();

    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        serviceResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(serviceResponse);
        res.end();
    } else {
        remoteIndexLogic.publishRemoteIndexesWorkUnit(remoteIndexList, function(publishRemoteIndexesErr) {
            serviceResponse.status = publishRemoteIndexesErr;
            res.send(serviceResponse);
            res.end();
        });
    }
};

/*
 * function :   Delete remote indexes
 * parameter :  remote index ID
 *              app key
 *              app token
 * return :     ServiceResponse
 */
exports.deleteRemoteIndex = function (req, res) {
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;
    var remoteIndex = req.body;

    var serviceResponse = new ServiceResponse();

    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        serviceResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(serviceResponse);
        res.end();
    } else {
        remoteIndexLogic.deleteRemoteIndexWorkUnit(remoteIndex, function(deleteRemoteIndexesErr) {
            serviceResponse.status = deleteRemoteIndexesErr;
            res.send(serviceResponse);
            res.end();
        });
    }
};

/*
 * function :   Publish BLE remote indexes
 * parameter :  BLE remote index object list
 *              app key
 *              app token
 * return :     ServiceResponse
 */
exports.publishBleRemoteIndex = function (req, res) {
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;
    var bleRemoteIndex = req.body;

    var serviceResponse = new ServiceResponse();

    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        serviceResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(serviceResponse);
        res.end();
    } else {
        bleRemoteIndexLogic.createBleRemoteIndexWorkUnit(bleRemoteIndex, function(publishRemoteIndexesErr) {
            serviceResponse.status = publishRemoteIndexesErr;
            res.send(serviceResponse);
            res.end();
        });
    }
};
