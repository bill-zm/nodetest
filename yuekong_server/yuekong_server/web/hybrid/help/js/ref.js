/**
 * Created by Strawmanbobi
 * 2016-03-22.
 */
var mobileID = null;
var version = null;
var lang = null;
var versionInfo = "";
var clientVersion = "";
var clientOS = "";

$(document).ready(function() {
    mobileID = getParameter('mobile_id');
    version = getParameter('version');
    lang = getParameter('lang');

    if (null != version) {
        versionInfo = version.split("_");
        clientOS = versionInfo[0];
        clientVersion = versionInfo[1];
    }
    if (clientVersion >= "V2.0.0") {
        showBackButton();
    }
});

function showBackButton() {
    $("#back_button").show();
}

function goBack() {
    location.href = './index.html?lang='+lang+'&mobile_id='+mobileID+'&version='+version;
}