/**
 * Created by zhangmeng on 2017/10/23.
 */
var dataobject = "";

// $(document).ready(function(){
//     //do something
//     // console.log(detailData);
//     // alert("1111")
// });
$(document).ready(function(){
    // /**
    //  * 0:信息已收集
    //  */
    // public static final byte INVOICE_INIT = 0;
    //
    // /**
    //  * 1:开票中
    //  */
    // public static final byte INVOICING = 1;
    //
    // /**
    //  * 2:已开票
    //  */
    // public static final byte INVOICED = 2;
    //
    // /**
    //  * 11:退款待回收
    //  */
    // public static final byte REFUNDS = 11;
    //
    // /**
    //  * 12.以回收/作废
    //  */
    // public static final byte RECYCLED = 12;
    // "createTimeStr": " 2017-10-23 17:24:25 ",
    //     "id": 5,
    //     "openid": "1",
    //     "orderNo": "201709251125346003ARw6a1",
    //     "invoiceType": 1,
    //     "title": "1",
    //     "taxNo": "1",
    //     "subject": "1",
    //     "money": 20,
    //     "note": "1",
    //     "address": "1",
    //     "tel": "1",
    //     "bank": "1",
    //     "email": "1",
    //     "status": 0,
    //     "createTime": "Oct 23, 2017 5:24:25 PM",
    //     "noteSubjcetNo": "20171023172425963vk7673"
    console.log("1111111")
    var a = GetRequest();
    var data = localStorage.getItem('listdata');//a['data'];
    var object = JSON.parse(data)
    console.log(data)

    http://localhost:8080/phtill/v1/invoice/get_invoice_info_by_id?id=6
    var data = {};
        console.log('http://localhost:8080/phtill/v1/invoice/get_invoice_info_by_id')
    var uri = "invoice/get_invoice_info_by_id";
    var timestamp = Date.parse(new Date()) / 1000;
    var queryList = ["appid=" + appid, "t=" + timestamp];
    // queryList.push("data=" + $.md5(JSON.stringify(data)))
    var sig = calculateSignature("GET", timestamp, uri, queryList, appkey);
    var url = httpurl + '/phtill/v1/' + uri + "?" + queryList.sort().join("&") +
        "&sig=" + encodeURIComponent(sig) + "&id="+a['id'];
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
                setData(response.data);
            }
            else {
                setData(object);
            }
        },
        beforeSend: function (xhr) {
        },
        error: function (error) {
            setData(object);
            console.log('error' + error)
        },
    });
});
function setData(object) {
    // var object = JSON.parse(data)
    dataobject = object;
    var tmpstatus = ""
    if(object.status == 0)
        tmpstatus = "信息已收集";
    else if(object.status == 1)
        tmpstatus = "开票中";
    else if(object.status == 2)
        tmpstatus ="已开票";
    else if(object.status == 3)
        tmpstatus ="开票失败";
    else if(object.status == 11)
        tmpstatus = "退款待回收";
    else if(object.status == 12)
        tmpstatus = "以回收/作废";

    if(object.status == 2 || object.status == 11 || object.status == 12 || object.status == 3){
        document.getElementById('state-pt').innerHTML = tmpstatus;
        document.getElementById('already-time').innerHTML = object.invoiceTime;
    }
    else{
        document.getElementById('ald-div').style.display="none";
    }
    if(object.status == 2){
        document.getElementById('btn-submit').innerHTML = '重发电子发票'
    }
    else if(object.status == 11 || object.status == 12 || object.status == 1){
        document.getElementById('btn-submit').style.display="none";
    }
    else {
        document.getElementById('btn-submit').innerHTML = '确认修改电子发票'
    }
    document.getElementById('state-p').innerHTML = tmpstatus;
    console.log(object.money)
    document.getElementById('input-email').value = object.email;
    document.getElementById('input-number').value = object.taxNo;
    document.getElementById('input-invoice').value = object.title;
    document.getElementById('input-money').innerHTML = object.money;
    document.getElementById('input-address').value = object.address;
    document.getElementById('input-phone').value = object.tel;
    document.getElementById('input-bank').value = object.bank;
    document.getElementById('time').innerHTML = object.createTimeStr;
}
function updatesubmit(o) {
        if(dataobject.status == 0 || dataobject.status == 3){
        if (document.getElementById("input-invoice").value == "") {
            document.getElementById("input-invoice").focus()
            return;
        }
        if (document.getElementById("input-number").value == "") {
            document.getElementById("input-number").focus()
            return;
        }
        if (document.getElementById("input-email").value == "") {
            document.getElementById("input-email").focus()
            return;
        }
        if (document.getElementById("input-address").value == "") {
            document.getElementById("input-address").focus()
            return;
        }
        if (document.getElementById("input-phone").value == "") {
            document.getElementById("input-phone").focus()
            return;
        }
        if (document.getElementById("input-bank").value == "") {
            document.getElementById("input-bank").focus()
            return;
        }
        var invoice = document.getElementById("input-invoice").value;
        var number = document.getElementById("input-number").value;
        var email = document.getElementById("input-email").value;
        var address = document.getElementById("input-address").value;
        var phone = document.getElementById("input-phone").value;
        var bank = document.getElementById("input-bank").value;
        if(dataobject != ""){
            dataobject.title = invoice;
            dataobject.taxNo = number;
            dataobject.email = email;
            dataobject.address = address;
            dataobject.tel = phone;
            dataobject.bank = bank;
            console.log('http://localhost:8080/phtill/v1/invoice/update_invoice_info_by_order_no')
            var uri = "invoice/update_invoice_info_by_order_no";
            var timestamp = Date.parse(new Date()) / 1000;
            var queryList = ["appid=" + appid, "t=" + timestamp];
            queryList.push("data=" + $.md5(JSON.stringify(dataobject)))
            var sig = calculateSignature("POST", timestamp, uri, queryList, appkey);
            var url = httpurl + '/phtill/v1/' + uri + "?" + queryList.sort().join("&") + "&sig=" + encodeURIComponent(sig);
            o.setAttribute("disabled", true);
            console.log("11111" + url);
            $.ajax({
                type: 'POST',
                url: url,
                dataType: 'JSON',
                timeout: 10000,
                contentType: "application/json",
                charset: "utf-8",
                data: JSON.stringify(dataobject),
                success: function (response) {
                    console.log('success' + response.data + JSON.stringify(response))
                    o.removeAttribute("disabled");
                    if (response.ret == 0) {
                        window.location.href = "../success/success.html"
                    }
                    else if (response.ret == 4104) {
                        alert("订单不存在")
                    }
                    else if (response.ret == 4105){
                        alert("订单金额有误")
                    }
                    else if (response.ret == 4112){
                        alert("该订单已经提交")
                    }
                },
                beforeSend: function (xhr) {
                },
                error: function (error) {
                    console.log('error' + error)
                    o.removeAttribute("disabled");
                    alert("提交失败")
                },
            });
        }
    }
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