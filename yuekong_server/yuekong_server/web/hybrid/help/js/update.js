/**
 * Created by Strawmanbobi
 * 2015-11-30
 */

var detecting = 1;
var gStatus = -1;
var imageFileSize = 155648;
var flashedSize = 0;
var currentVersion = "";

$(document).ready(function() {
    id = getParameter('id');
    getVersionByID(id);
    iconFadeOut();
    // updateProgress(0, 0);
});

function iconFadeIn() {
    if (detecting) {
        /*
        $("#ucon_icon").fadeIn(2000, function() {
            iconFadeOut();
        });
        */
        $("#ucon_icon").show();
    } else {
        $("#ucon_icon").hide();
    }
}

function iconFadeOut() {
    if (detecting) {
        /*
        $("#ucon_icon").fadeOut(2000, function () {
            iconFadeIn();
        });
        */
        $("#ucon_icon").show();
    } else {
        $("#ucon_icon").hide();
    }
}

function getVersionByID(id) {
    var remBleVer = $('#rem_ble_ver');
    var remBleComment = $('#rem_ble_comment');
    $.ajax({
        url: "/yuekong/version/get_version_by_id?id="+id,
        type: "GET",
        timeout: 20000,
        success: function (response) {
            if(response.status.code == 0) {
                showVersionInfo(response.entity);
            } else {
                remBleComment.empty();
                remBleComment.append('版本信息获取失败，请重试');
            }
        },
        error: function () {
            remBleComment.empty();
            remBleComment.append('版本信息获取失败，请重试');
        }
    });
}

function showVersionInfo(versionInfo) {
    var comment = "";
    var remBleVer = $('#rem_ble_ver');
    var remBleComment = $('#rem_ble_comment');
    if (null != versionInfo.comment) {
        comment = versionInfo.comment.replace(/\r\n|\n|\r/g, '<br/>');
    }
    if (versionInfo.version_type == 0) {
        // this is a version of device
        remBleComment.empty();
        remBleVer.empty();

        $('#rem_ble_panel').hide();
        $('#dev_wlan_panel').show();
        $('#dev_ble_panel').show();

    } else if (versionInfo.version_type == 1) {
        // this is a version of remote
        remBleVer.empty();
        remBleComment.empty();

        remBleVer.append('遥控器版本更新 ' + versionInfo.rem_ble_ver + ' (' + versionInfo.update_time.substring(0, 10) + ')');
        remBleComment.append(comment);

        $('#rem_ble_panel').show();
        $('#dev_wlan_panel').hide();
        $('#dev_ble_panel').hide();
    }
}

function changeDeviceStatus(status, parameter, extraParameter) {
    var tempLog = $("#temp_log");
    if (status != 3 && parseInt(status) == parseInt(gStatus)) {
        return;
    }

    switch(status) {
        case 0:
            // there is no device connected or connecting
            setStatusPanel(1, "连接UCON中...", "请确保您的计算机连接到Internet，并用串口USB线连接到UCON遥控器", 1);
            $("#can_not_connect").show();
            break;
        case 1:
            // UCON connected
            setStatusPanel(0, "UCON已连接", "您的UCON已经是最新版本，请继续使用", 0);
            $("#can_not_connect").hide();
            break;
        case 2:
            // UCON updating
            imageFileSize = parameter | 155648;
            tempLog.empty();
            tempLog.html(flashedSize + "/" + imageFileSize);
            flashedSize = 0;
            updateProgress(flashedSize, imageFileSize);
            setStatusPanel(0, "UCON已连接", "准备升级中，请不要断开UCON和计算机之间的连接...", 0);
            /*
            var currentVersion = $("#current_version");
            if ("0" != extraParameter) {
                currentVersion.empty();
                currentVersion.html("当前版本 : " + extraParameter);
                currentVersion.show();
            } else {
                currentVersion.empty();
                currentVersion.hide();
            }
            */
            break;
        case 3:
            // UCON update in progress
            flashedSize = parameter;
            tempLog.empty();
            tempLog.html(flashedSize + "/" + imageFileSize);
            updateProgress(flashedSize, imageFileSize);
            setStatusPanel(0, "UCON已连接", "正在升级，请不要断开UCON和计算机之间的连接...", 0);
            break;
        case 4:
            setStatusPanel(0, "出现问题", "升级失败，请拔下UCON遥控器，并重试", 0);
            hideProgress();
            break;
        case 5:
            setStatusPanel(0, "升级完成", "升级完成，请继续使用!", 0);
            hideProgress();
            break;
        default:
            // there is no device connected or connecting
            setStatusPanel(1, "连接UCON中...", "请确保您的计算机连接到Internet，并用串口USB线连接到UCON遥控器", 1);
            $("#can_not_connect").show();
            break;
    }
    gStatus = parseInt(status);
}

function setStatusPanel(dt, statusText, indicationText, restartAnimation) {
    var uconIcon = $('#ucon_icon');
    var uconConnectedIcon = $('#ucon_icon_connected');
    var cStatusText = $('#device_status');
    var cIndicationText = $('#indication');
    detecting = dt;
    if (0 == detecting) {
        uconIcon.hide();
        uconConnectedIcon.show();
    } else {
        uconIcon.show();
        uconConnectedIcon.hide();
    }

    cStatusText.empty();
    cStatusText.html(statusText);
    cIndicationText.empty();
    cIndicationText.html(indicationText);

    if (1 == restartAnimation) {
        iconFadeIn();
    } else {
        uconIcon.hide();
    }
}

function updateProgress(current, total) {
    var updateProgressPanel = $("#update_progress_panel");
    var updateProgress = $("#update_progress");
    updateProgressPanel.show();
    updateProgress.attr('aria-valuemax', total);
    updateProgress.attr('data-transitiongoal', current);
    updateProgress.progressbar();
}

function hideProgress() {
    var updateProgressPanel = $("#update_progress_panel");
    updateProgressPanel.hide();
}

function popupHint() {
    $("#can_not_connect_dialog").modal();
}