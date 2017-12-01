/**
 * Created by Strawmanbobi
 * 2015-09-26.
 */
var mobileID = null;
var lang = null;
var version = null;

$(document).ready(function() {
    var versionInfo = [];
    var clientOS = "";
    var clientVersion = "";
    mobileID = getParameter('mobile_id');
    lang = getParameter('lang');
    version = getParameter('version');

    if(null != mobileID && '' != mobileID) {
        $('#index_page').show();
    } else {
        gotoHelp();
    }

    if(null != lang && 'en' == lang) {
        $("#help_img").attr("src","./images/how_to_use_en.png");
        $('#device_manage_banner').hide();
    } else {
        $('#device_manage_banner').show();
    }

    $('#video_banner').hide();
    // analyze version code
    if (null != version) {
        versionInfo = version.split("_");
        clientOS = versionInfo[0];
        clientVersion = versionInfo[1];
    }
    $('#help_banner').show();
    // $('#help_banner').show();
});

function gotoHelp() {
    if (null != lang && 'tw' == lang) {
        location.href = './ref_tw.html?lang='+lang+'&mobile_id='+mobileID+'&version='+version;
    } else if(null != lang && 'en' == lang) {
        location.href = './ref.html?lang='+lang+'&mobile_id='+mobileID+'&version='+version;
    } else {
        location.href = './ref.html?lang='+lang+'&mobile_id='+mobileID+'&version='+version;
    }

}

function gotoDeviceManage() {
    location.href = './dm.html?lang='+lang+'&mobile_id='+mobileID+'&version='+version;
}

function gotoVideoPage() {
    location.href = './wizard.html?lang='+lang+'&mobile_id='+mobileID+'&version='+version;
}
