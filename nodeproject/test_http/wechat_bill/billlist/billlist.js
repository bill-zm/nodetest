// /**
//  * Created by zhangmeng on 2017/10/23.
//  */
//
// window.onload = function(){
//     var tbody=window.document.getElementById("tab-list");
//
//     var arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
//     var str = ""
//     for(daa in arr){
//         tmp = "onclickDetail"
//         console.log(tmp)
//         str += "<div class='weui-cells' style='margin-top: 0px;'   onclick='onclickDetail(daa)'>"+
//             "<div class='weui-cell weui-cell_access'>"+
//             "<div class='weui-cell__bd'>"+
//             "<p style='color: #888888;font-size: 15px'>2017.10.17 周二 17:56</p>"+
//             "<div style='display: flex'>"+
//             "<p style='color: #888888;font-size: 15px'>金额&nbsp&nbsp&nbsp&nbsp</p>"+
//             "<p style='color:#FF813F;font-size: 15px'>8999.10元</p>"+
//             "</div>"+
//             "</div>"+
//             "<div class='weui-cell__ft' style='color:#C7C7C7;font-size: 15px'>开票中</div>"+
//             "</div>"+
//             "</div>";
//     }
//     // str += "<tr class=\"weui-cell\">" +
//     //     "<td>" + data[i].hotel_seq + "</td>" +
//     //     "<td>" + data[i].hotel_name + "</td>" +
//     //     "<td>" + data[i].order_no + "</td>" +
//     //     "<td>" + data[i].user_phone + "</td>" +
//     //     "<td>" + data[i].create_time + "</td>" +
//     //     "<td>" + data[i].user_id + "</td>" +
//     //     "<td>" + data[i].cellid + "</td>" +
//     //     "<td>" + data[i].gps_city + "</td>" +
//     //     "<td>" + data[i].cell_city + "</td>" +
//     //     "<td>" + data[i].distance + "</td>" +
//     //     "</tr>";
//     //
//     // alert(str);
//     tbody.innerHTML = str;
// };
// function onclickDetail(tmp,daa) {
//     alert(this.id)
// }
var a = GetRequest()
var openid = a['openId'];

if(openid == undefined){
    openid=""
}
else{
    localStorage.setItem(openId,openid)
}
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
/**
 * Created by zhangmeng on 2017/10/23.
 */
// window.ready = function () {
//     alert(httpurl)
//     console.log(httpurl)
// };
var dataobject;

$(document).ready(function(){
    openid = localStorage.getItem(openId)
    console.log(openid +" : 99999999")
    getBillList();
});
function getBillList() {
    console.log(openid)
    // var httpurl = "http://192.168.1.180:8080";
    // http://192.168.1.180:8080/phtill/v1/invoice/get_invoice_his_list_by_openid?openid=1&from=0&count=10
    //     // window.location.href = "../success/success.html";
    //     // http://192.168.1.180:8080/phtill/v1/invoice/addInvoiceInfo
    var data = {}
    console.log(data)
    console.log('http://192.168.1.180:8080' + '/phtill/v1/invoice/addInvoiceInfo')
    var uri = "invoice/get_invoice_his_list_by_openid";
    var timestamp = Date.parse(new Date()) / 1000;
    var queryList = ["appid=" + appid, "t=" + timestamp];
    // queryList.push("data=" + $.md5(JSON.stringify(data)))
    var sig = calculateSignature("GET", timestamp, uri, queryList, appkey);
    var url = httpurl + '/phtill/v1/' + uri + "?" + queryList.sort().join("&") +
        "&sig=" + encodeURIComponent(sig) + "&openid=" + openid + "&from=" + 0 + "&count=" + 10;
    console.log("11111" + url);
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'JSON',
        timeout: 10000,
        contentType: "application/json",
        charset: "utf-8",
        success: function (response) {
            console.log('success' + response.data + JSON.stringify(response))
            if (response.ret == 0) {
                setListArr(response.data)
                // window.location.href = "../success/success.html"
            }
            else{

            }
            // else if (response.ret == 4104) {
            //     alert("订单不存在")
            // }
            // else if (response.ret == 4105){
            //     alert("订单金额有误")
            // }
        },
        beforeSend: function (xhr) {
        },
        error: function (error) {
            console.log('error' + error)
            // alert("提交失败")
        },
    });
}
var dataarr = [];
function setListArr(arr) {
    // var arr = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
    if(arr.length > 0){
        document.getElementById('null-div').style.display="none";
    }
    else{
        return
    }
    var str = ""
    dataarr = arr;
    console.log(dataarr)
    var tbody = window.document.getElementById("tab-list");
    for(var i =0;i<arr.length;i++){
        var daa = arr[i];
        tmp = "onclickDetail"
        console.log(daa.status)
        var div1 = document.createElement("div");
        div1.class = "weui-cells";
        div1.id = i;
        div1.style.marginTop = '0px';
        div1.style.borderBottomWidth = '1px'
        div1.style.borderBottomColor = '#ccc'
        div1.style.borderBottomStyle = 'solid'
        div1.onclick = function () {
            console.log(this.id)
            detailData = dataarr[this.id];
            var strtmp = JSON.stringify(dataarr[this.id])
            console.log(JSON.stringify(dataarr[this.id]))
            localStorage.setItem('listdata',strtmp)
            window.location.href = '../billdetail/billdetail.html?id='+detailData.id;
        }
        var tmpstatus = ""
        if(daa.status == 0)
            tmpstatus = "信息已收集";
        else if(daa.status == 1)
            tmpstatus = "开票中";
        else if(daa.status == 2)
            tmpstatus ="已开票";
        else if(daa.status == 11)
            tmpstatus = "退款待回收";
        else if(daa.status == 12)
            tmpstatus = "以回收/作废";
        // div1.bObj.addEventListener("onclick",onclickDetail,daa,daa)
        str = "<div class='weui-cell weui-cell_access'>"+
            "<div class='weui-cell__bd'>"+
            "<p style='color: #888888;font-size: 15px'>"+daa.createTimeStr+"</p>"+
            "<div style='display: flex'>"+
            "<p style='color: #888888;font-size: 15px'>金额&nbsp&nbsp&nbsp&nbsp</p>"+
            "<p style='color:#FF813F;font-size: 15px'>"+daa.money+"</p>"+
            "</div>"+
            "</div>"+
            "<div class='weui-cell__ft' style='color:#C7C7C7;font-size: 15px'>"+tmpstatus+"</div>"+
            "</div>";
        div1.innerHTML = str;
        tbody.appendChild(div1)
    }
};
function nullBtnClick() {
    getBillList();
}
    // str += "<tr class=\"weui-cell\">" +
    //     "<td>" + data[i].hotel_seq + "</td>" +
    //     "<td>" + data[i].hotel_name + "</td>" +
    //     "<td>" + data[i].order_no + "</td>" +
    //     "<td>" + data[i].user_phone + "</td>" +
    //     "<td>" + data[i].create_time + "</td>" +
    //     "<td>" + data[i].user_id + "</td>" +
    //     "<td>" + data[i].cellid + "</td>" +
    //     "<td>" + data[i].gps_city + "</td>" +
    //     "<td>" + data[i].cell_city + "</td>" +
    //     "<td>" + data[i].distance + "</td>" +
    //     "</tr>";
    //
    // alert(str);
    // tbody.innerHTML = str;
