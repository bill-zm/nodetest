/**
 * Created by zhangmeng on 2017/9/14.
 */
var checkedType = 2;
//加载事件
var a = GetRequest()
var openid = a['openId'];

if(openid == undefined){
    openid=""
}
else {
    console.log(openid +" : 99999999")
    localStorage.setItem(openId,openid)
}
window.onload = function(){
    // wx.config({
    //     debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    //     appId: 'gh_b3d2b92e5689', // 必填，公众号的唯一标识
    //     timestamp: getNowFormatDate(), // 必填，生成签名的时间戳
    //     nonceStr: '1023', // 必填，生成签名的随机串
    //     signature: '',// 必填，签名，见附录1
    //     jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    // });
    // var tbody=window.document.getElementById("tab-list");
    //
    // var arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    // var str = ""
    // for(daa in arr){
    //     str += "<div class=\"weui-cell\">"+
    //         "<div class=\"weui-cell__bd\">"
    //         +"<p class='plsit-p'>标题文字</p>"
    //         +"</div>"
    //         +"<div class=\"weui-cell__ft\">说明文字</div>"
    //         +"</div>";
    // }
    //  // str += "<tr class=\"weui-cell\">" +
    // //     "<td>" + data[i].hotel_seq + "</td>" +
    // //     "<td>" + data[i].hotel_name + "</td>" +
    // //     "<td>" + data[i].order_no + "</td>" +
    // //     "<td>" + data[i].user_phone + "</td>" +
    // //     "<td>" + data[i].create_time + "</td>" +
    // //     "<td>" + data[i].user_id + "</td>" +
    // //     "<td>" + data[i].cellid + "</td>" +
    // //     "<td>" + data[i].gps_city + "</td>" +
    // //     "<td>" + data[i].cell_city + "</td>" +
    // //     "<td>" + data[i].distance + "</td>" +
    // //     "</tr>";
    // //
    // alert(str);
    // tbody.innerHTML = str;
    openid = localStorage.getItem(openId)
    console.log(openid +" : 99999999")
};
function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}
function checkClick1() {
    if($('input[name="checkbox1"]').prop("checked"))
    {
        // $('input[name="checkbox2"]').removeAttr("checked")
        // $("[name='checkbox2']").removeAttr("checked")
        checkedType = 2
        document.getElementById("s12").checked = false
    }
    else{
        checkedType = 1
        document.getElementById("s11").checked = true
        // $('input[name="checkbox1"]').attr("checked",'true')
    }
}
function checkClick2() {
    // if($('input[name="checkbox2"]').prop("checked"))
    // {
    //     $("[name='checkbox1']").removeAttr("checked")
    // }
    // else{
    //     $("[name='checkbox2']").attr("checked",'true')
    // }
    if($('input[name="checkbox2"]').prop("checked"))
    {
        checkedType = 1
        // $('input[name="checkbox2"]').removeAttr("checked")
        // $("[name='checkbox2']").removeAttr("checked")
        document.getElementById("s11").checked = false
    }
    else{
        checkedType = 2
        document.getElementById("s12").checked = true
        // $('input[name="checkbox1"]').attr("checked",'true')
    }
}
function submitClick(o) {
    var url = 'http://localhost:3000/express';
    $.ajax({
        type: 'POST',
        url: url,
        dataType: 'JSON',
        timeout: 10000,
        contentType: "application/json",
        charset: "utf-8",
        data: JSON.stringify({'uid':'4893930'}),
        success: function (response) {
            console.log('success: ' +JSON.stringify(response))
        },
        beforeSend: function (xhr) {
        },
        error: function (error) {
            console.log('error' + JSON.stringify(error))
        },
    });
}
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}