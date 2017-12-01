/**
 * Created by Strawmanbobi
 * 2016-03-13.
 */
var mobileID = null;
var userOpenID = null;
var userName = "我";

var remoteIconList = ['icon_clone.png', 'icon_AC.png', 'icon_TV.png', 'icon_STB.png',
                        'icon_NW.png', 'icon_IPTV.png', 'icon_DVD.png', 'icon_fan.png',
                        'icon_projector.png', 'icon_stereo.png', 'icon_light.png', 'icon_STB.png',
                        'icon_clean_robot.png', 'icon_air_cleaner'];

$(document).ready(function() {
    mobileID = getParameter('mobile_id');
    userOpenID = getParameter('user_open_id');

    if (null != userOpenID && 0 != userOpenID) {
        getUserInfo();
    }

    getRemotes();
});

function getUserInfo() {
    $.ajax({
        url: "/yuekong/user/get_user_by_weixin_id?weixin_id="+userOpenID,
        type: "GET",
        timeout: 20000,
        success: function (response) {
            if(response.status.code == 0 && null != response.entity) {
                console.log(response.entity);
                userName = response.entity.name;
            } else {
                // do nothing
                console.log("get user info failed");
            }
        },
        error: function () {
            // do nothing
            console.log("get user info failed");
        }
    });
}

function getRemotes() {
    $.ajax({
        url: "/yuekong/user/get_weixin_user_stat?mobile_id="+mobileID+"&weixin_id="+userOpenID,
        type: "GET",
        timeout: 20000,
        success: function (response) {
            if(response.status.code == 0 && null != response.entity) {
                console.log(response.entity);
                indicateRemoteList(response.entity.remoteList, response.entity.deviceInstanceCount);
            } else {
                console.log("get remote stats failed");
            }
        },
        error: function () {
            console.log("get remote stats failed");
        }
    });
}

function indicateRemoteList(remoteList, deviceInstanceCount) {
    var uconType = deviceInstanceCount == 0 ? 'UCON' : 'UCON套装';
    var indication = userName + "已经成功使用" + uconType + "控制了" + remoteList.length + "个家用电器";
    $("#share_title").html(indication);

    var listContent = "";
    for (var i = 0; i < remoteList.length; i++) {
        var categoryID = remoteList[i].category_id;
        var brandName = "";
        if (categoryID == 0) {
            brandName = "   (自学习)";
        } else if (categoryID == 3) {
            brandName = ""
        } else {
            brandName = "   (" + remoteList[i].brand_name + ")";
        }
        listContent += "<li class='list-group-item' style='background: #288ce1; color: #ffffff;'>" +
            "<img src='./images/" + remoteIconList[categoryID] + "' style='width: 20%; height: 20%; margin-right: 10px;'>" +
            remoteList[i].name +
            "</li>"
    }

    $("#remote_list_frame").html(listContent);
}

function gotoPurchase() {
    location.href = "http://item.m.jd.com/product/10392150927.html";
}