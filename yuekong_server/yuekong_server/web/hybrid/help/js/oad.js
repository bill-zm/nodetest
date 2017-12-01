/**
 * Created by Strawmanbobi
 * 2015-09-26.
 */
var versionID = null;
var host = null;
var identifier = null;

$(document).ready(function() {
    versionID = getParameter('version_id');
    host = getParameter('host');
    identifier = getParameter('identifier');

    getVersionInfo();
});

function getVersionInfo() {
    $.ajax({
        url: "/yuekong/version/get_version_by_id?id="+versionID,
        type: "GET",
        timeout: 20000,
        success: function (response) {
            if(response.status.code == 0 && response.entity != null) {
                refreshReleaseNote(response.entity);
            } else {
                console.log("get version info failed");
            }
        },
        error: function () {
            console.log("get version info failed");
        }
    });
}

function refreshReleaseNote(versionInfo) {
    var comment = "";

    if (null != versionInfo.comment) {
        comment = versionInfo.comment.replace(/\r\n|\n|\r/g, '<br/>');
    }

    if (versionInfo.version_type == 0) {
        document.getElementById('version_number').innerHTML = versionInfo.dev_wlan_ver + ", " + versionInfo.dev_ble_ver;
    } else if (versionInfo.version_type == 1) {
        document.getElementById('version_number').innerHTML = versionInfo.rem_ble_ver;
    }
    document.getElementById('release_note').innerHTML = comment;
}
