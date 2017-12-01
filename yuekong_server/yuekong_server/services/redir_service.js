/**
 * Created by strawmanbobi
 * 2015-01-23.
 */

// platform inclusion
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var constants = require('../configuration/system_configs');

var Enums = require('../configuration/enums');
var ErrorCode = require('../configuration/error_code');

var enums = new Enums();
var errorCode = new ErrorCode();

/*
 * function :   Redirect Download Page
 * parameter :
 * return :
 */
exports.redirectDownload = function (req, res) {
    // var UA = req.headers['user-agent'];
    // var uaInfo = System.getUAInfo(UA);
    // var privateRedir = req.query.private_redir;

    res.redirect("http://" + WEB_SERVER_ADDRESS + "/web/download.html");
    /*
    if (null != privateRedir && "1" == privateRedir) {

    } else {
        if("iOS" == uaInfo.os.name) {
            res.redirect('http://www.pgyer.com/SqwV');
        } else if ("Android" == uaInfo.os.name) {
            res.redirect('http://www.pgyer.com/TmMv');
        } else {
            res.redirect('/web/update/index.html');
        }
    }
    */
};

/*
 * function :   Redirect Purchase Page
 * parameter :
 * return :
 */
exports.redirectPurchase = function (req, res) {
    res.redirect("http://mp.weixin.qq.com/bizmall/malldetail?id=&pid=pOTQCs-LDCGXmlE3mRm4-UQrOAhY&biz=MzAwMzI2NjEwNQ==&scene=&action=show_detail&showwxpaytitle=1#wechat_redirect");
};

/*
 * function :   Redirect Binary Download Link
 * parameter :  Binary name
 * return :
 */
exports.binDownload = function (req, res) {
    var target = req.params.bin_file;
    var ossFile = "";
    /*
    var resourcePrefix = "http://yuekong-release.oss-cn-hangzhou.aliyuncs.com/";
    var directory = "";
    var ossFile = "";

    if (target.indexOf("rem") != -1) {
        directory = "UCON_REMOTE";
    } else if (target.indexOf("dev") != -1) {
        directory = "UCON_CENTER"
    } else if (target.indexOf("ucon") != -1) {
        directory = "UCON";
    } else {
        res.end();
        return;
    }
    */

    // ossFile = resourcePrefix + directory + "/" + target;
    ossFile = "/web/binary/" + target;

    res.redirect(ossFile);
};