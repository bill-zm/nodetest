/**
 * Created by Strawmanbobi
 * 2014-08-30
 */

function ErrorCode() {
    this.SUCCESS = {
        code: 0,
        cause: "成功"
    };
    this.FAILED = {
        code: -1,
        cause: "网络故障，请稍后再试"
    };
    this.WRONG_ENV = {
        code: -2,
        cause: "错误的运行环境配置"
    }

    // Common error
    this.AUTHENTICATION_FAILURE = {
        code: 1,
        cause: "用户验证失败，请重新登录"
    };
    this.INVALID_CATEGORY = {
        code: 2,
        cause: "不存在的电器品类"
    };
    this.INVALID_BRAND = {
        code: 3,
        cause: "不存在的品牌"
    };
    this.INVALID_PARAMETER = {
        code: 4,
        cause: "参数错误"
    };

    // ERROR for DEVICE
    this.DEVICE_ALREADY_REGISTERED = {
        code: 50,
        cause: "该设备已经注册"
    };
    this.DEVICE_VALIDATING_FAILED = {
        code: 51,
        cause: "请求注册的是非法设备"
    };
    this.DEVICE_NOT_FOUND = {
        code: 52,
        cause: "设备没有找到"
    };

    // ERROR for remote
    this.CATEGORY_NOT_FOUND = {
        code: 100,
        cause: "该电器类型不存在"
    };
    this.BRAND_NOT_FOUND = {
        code: 101,
        cause: "该品牌不存在"
    };

    // ERROR for mobile
    this.MOBILE_NOT_FOUND = {
        code: 150,
        cause: "移动终端未找到"
    };

    // ERROR for remote
    this.REMOTE_INDEX_NOT_FOUND = {
        code: 200,
        cause: "遥控器类型未找到"
    };
    this.REMOTE_NOT_FOUND = {
        code: 201,
        cause: "遥控器未找到"
    };
    this.MULTIPLE_REMOTE_MATCHED = {
        code: 202,
        cause: "匹配到多个遥控器"
    };
    this.REMOTE_BIN_DOWNLOAD_FAILURE = {
        code: 203,
        cause: "遥控器码表下载失败"
    };
    this.REMOTE_INSTANCE_NOT_FOUND = {
        code: 204,
        cause: "没有配置过任何遥控器"
    };
    this.REMOTE_INFO_NOT_FETCHED = {
        code: 205,
        cause: "无法获取遥控器信息"
    };
    this.VERSION_BINARY_DOWNLOAD_FAILURE = {
        code: 206,
        cause: "版本下载失败"
    };
}

module.exports = ErrorCode;