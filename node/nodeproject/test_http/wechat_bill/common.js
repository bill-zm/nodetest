jQuery.support.cors = true;
var appid = 6;
var appkey = "d9f0eedae61e422fcfcb5eb32df29311";//"hmachash1随机生成的key"

var httpurl = "http://120.55.47.19:8080";//"ip_grep_flag";//
var openId = "openId";
var pageRootPath = "/webConsole/src/";
var POST = "POST";
var GET = "GET";
var detailData = [];
// 各个角色的roleId
var ROLE_SYSTEM_ADMIN = 100000;   // 系统管理员
var ROLE_COMMON_ADMIN = 10000;  // 普通管理员
var ROLE_COMMON_USER = 1000;  // 普通用户

/**测试服务器**/
var consoleHost = "http://101.132.105.150:8080/phtill/v1/";//"http://www.ucon.cn/phtill/v1/";//
var URI_CONSOLE_LOGIN = "auth/login";
var URI_AUTH_ADD_VER = "auth/add_ver";
var URI_AUTH_LIST_VER = "auth/list_ver";
var URI_AUTH_DEL_VER = "auth/del_ver";

var URI_STORE_LIST = "store/list";
var URI_STORE_INFO = "store/info";
var URI_STORE_EDIT = "store/edit";
var URI_STORE_ADD = "store/add";
var URI_STORE_DEL = "store/del";
var URI_FILE_UPLOAD = "file/upload";
var URI_ORDER_LIST = "order/cur_order_list";
var URI_ORDER_REFUND = "order/refund";
var URI_ORDER_REFUND_LIST = "order/order_refund_list";

/**测试服务器2*
 var consoleHost = "http://192.168.1.252:8080/";//180:8080/yuekong/"//
 var URI_CONSOLE_LOGIN = "yuekong/admin/admin_login";
 var URI_RGG =  "yuekong/admin/add_admin";
 var URI_NEWS_SEARCH = "yuekong2/news/search_news";
 var URI_NEWS_ADD = "yuekong2/news/add_news";
 var URI_NEWS_CURRENT_LIST = "yuekong2/news/news_list";
 var URI_NEWS_DEL_FROM_UCON = "yuekong2/news/del_news";
 var URI_NEWS_HISTROY = "yuekong2/news/news_his_list";

 var URI_JOURNEY_LIST = "yuekong2/schedule/schedule_list";
 var URI_JOURNEY_ADD = "yuekong2/schedule/add_schedule";
 var URI_FILE_UPLOAD = "yuekong2/file/upload_file";
 var URI_DEVICES_STATUS = "yuekong2/room/room/devices_status";
 var ROOM_DEVICE_INFO_LIST = "yuekong2/room/room_device_info_list";
 var ROOM_DEVICE_RELEASE="yuekong2/room/device_release";*/


var STATUS_CREATE = 0;//支付创建
var ORDER_STATUS_PAYED = 1;//支付成功
var STATUS_PAYED_ERROR = 2;//支付失败
var STATUS_REFUND_REQ = 20;//退款请求中
var STATUS_REFUND_ING = 21;//退款中，交易状态为：未确认收货（额度尚未记账）
var STATUS_REFUND_OK = 22;//退款成功，交易状态为：交易关闭，额度未扣除，请核实花呗消费明细
var STATUS_REFUND_ERROR = 23;//退款失败

var timestamp = Date.parse(new Date()) / 1000;

// 根据安全Token来生成签名
// method:  HTTP方法的类型
// uri:     请求url的uri
// queryList:
function calculateSignature(method, timestamp, uri, queryList, secKey) {
  var canonicalizedResource = uri + "?" + queryList.sort().join("&");
  var str = method.toUpperCase() + "\n" + appkey + "\n" + timestamp + "\n" + canonicalizedResource;
  console.log("srcstr=[" + str + "]");
  console.log("key=" + secKey);
  var sha1Result = CryptoJS.HmacSHA1(str, secKey);
  console.log("sha1Result[" + sha1Result + "]");
  var strSign = sha1Result.toString(CryptoJS.enc.Base64);
  console.log("strSign[" + strSign + "]");
  return strSign
}
