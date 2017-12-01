/**
 * Created by Strawmanbobi
 * 2015-09-26.
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

    if(null != mobileID && '' != mobileID) {
        getUCONDevices();
    } else {
        $('#device_list').empty();
        $('#device_list').append('<p>您还未绑定 UCON 套装，请在客户端中点击“添加新的UCON”以绑定</p>');
    }

    // set UI according to version
    if (null != version) {
        versionInfo = version.split("_");
        clientOS = versionInfo[0];
        clientVersion = versionInfo[1];
    }
    if (clientVersion >= "V2.0.0") {
        showBackButton();
    }
});

function getUCONDevices() {
    $.ajax({
        url: "/yuekong/device/list_device_instances?mobile_id="+mobileID+"&from=0&count=100",
        type: "GET",
        timeout: 20000,
        success: function (response) {
            if(response.status.code == 0 && response.entity.length > 0) {
                appendDeviceList(response.entity);
            } else {
                $('#device_list').empty();
                $('#device_list').append('<p>您还未绑定 UCON 套装，请在客户端中点击“添加新的UCON”以绑定</p>')
            }
        },
        error: function () {
            $('#device_list').empty();
            $('#device_list').append('<p>您还未绑定 UCON 套装，请在客户端中点击“添加新的UCON”以绑定</p>')
        }
    });
}

function deleteDeviceInstance(id) {
    $.ajax({
        url: "/yuekong/device/delete_device_instance?id="+id,
        type: "POST",
        timeout: 20000,
        success: function (response) {
            getUCONDevices();
        },
        error: function () {
            getUCONDevices();
        }
    });
}

function appendDeviceList(deviceInstanceList) {
    var i = 0;
    $('#device_list').empty();
    for (i = 0; i < deviceInstanceList.length; i++) {
        var deviceInstance = deviceInstanceList[i];
        var name = filtScript(deviceInstance.name);

        $('#device_list').append('<div class="col-lg-12">' +
            '<p style="font-size: 16px;"><img src="./images/device.png" style="width: 32px; height: 32px; margin-right: 20px;">' + name +
            '<a style="float: right;" class="btn btn-default" href="#" onclick="deleteDeviceInstance(' + deviceInstance.id +')">删除 &raquo;</a></p>' +
            '<p>序列号: '+ deviceInstance.pdsn + ' 版本: ' + deviceInstance.version + '</p>' +
            '</div>' +
            '<hr>');
    }
}

function filtScript(s) {
    var pattern = new RegExp("[%--`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    var rs = "";
    for (var i = 0; i < s.length; i++) {
        rs = rs+s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

function showBackButton() {
    $("#back_button").show();
}

function goBack() {
    location.href = './index.html?lang='+lang+'&mobile_id='+mobileID+'&version='+version;
}