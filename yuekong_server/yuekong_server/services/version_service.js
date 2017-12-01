/**
 * Created by strawmanbobi
 * 2015-07-17.
 */
// global inclusion
require('../../../Infrastructure/BackEnd/configuration/constants');

// local inclusion
var ServiceResponse = require('../response/service_response.js');
var VersionResponse = require('../response/version_response.js');
var SingleVersionResponse = require('../response/single_version_response.js');

var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var versionLogic = require('../work_unit/version_logic.js');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Get Latest version of UCON
 * parameter :  WLAN version
 *              BLE version
 * return :     Device Version Response
 * warning:     This API used just only for USER UPDATE
 */
exports.getLatestVersion = function (req, res) {
    var type = req.query.type;
    var subType = req.query.sub_type;
    var remoteType = req.query.remote_type;
    var comeFrom = req.query.come_from;

    var UA = req.headers['user-agent'];

    var versionResponse = new VersionResponse();
    versionLogic.getLatestVersionWorkUnit(type, subType, remoteType, UA, comeFrom, function (getLatestVersionErr, latestVersion) {
        versionResponse.status = getLatestVersionErr;
        versionResponse.entity = latestVersion;
        res.setHeader('Access-Control-Allow-Origin','*');
        res.send(versionResponse);
        res.end();
    });
};

/*
 * function :   Get Latest version of UCON, simplified API
 * parameter :  type of version
 *              sub type of version
 *              remote type
 *              come from
 * return :     id of verion in DB
 * warning :    this API is only used by UCON PC updater
 */
exports.getLatestVersionSimple = function (req, res) {
    var type = req.query.type;
    var subType = req.query.sub_type;
    var remoteType = req.query.remote_type;
    var comeFrom = req.query.come_from;

    var UA = req.headers['user-agent'];

    versionLogic.getLatestVersionWorkUnit(type, subType, remoteType, UA, comeFrom,
    function (getLatestVersionErr, latestVersion) {
        if (errorCode.SUCCESS.code == getLatestVersionErr.code) {
            res.end(latestVersion.id + "," + latestVersion.rem_ble_ver + "," + latestVersion.rem_ble_hash);
        } else {
            res.end("ERROR");
        }
    });
};

/*
 * function :   Get Version information by ID
 * parameter :  ID of version
 * return :     information of version
 */
exports.getVersionByID = function (req, res) {
    var id = req.query.id;

    var singleVersionResponse = new SingleVersionResponse();
    versionLogic.getVersionByIDWorkUnit(id, function (getVersionByIDErr, version) {
        singleVersionResponse.status = getVersionByIDErr;
        singleVersionResponse.entity = version;
        res.setHeader('Access-Control-Allow-Origin','*');
        res.send(singleVersionResponse);
        res.end();
    });
};

/*
 * function :   Publish version
 * parameter :  version
 *              app key
 *              app token
 * return :     ServiceResponse
 */
exports.publishVersion = function (req, res) {
    var appKey = req.query.app_key;
    var appToken = req.query.app_token;
    var version = req.body;

    var serviceResponse = new ServiceResponse();

    if(APP_KEY != appKey || APP_TOKEN != appToken) {
        serviceResponse.status = errorCode.AUTHENTICATION_FAILURE;
        res.send(serviceResponse);
        res.end();
    } else {
        versionLogic.publishVersionWorkUnit(version, function(publishVersionErr) {
            serviceResponse.status = publishVersionErr;
            res.send(serviceResponse);
            res.end();
        });
    }
};