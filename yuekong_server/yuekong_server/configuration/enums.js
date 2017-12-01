/**
 * Created by Strawmanbobi
 * 2014-08-30
 */

function Enums() {
    this.APP_PRODUCTION_MODE = "production";
    this.APP_DEVELOPMENT_MODE = "development";
    this.APP_USERDEBUG_MODE = "userdebug";
    this.APP_INTERNATIONAL_MODE = "int";

    this.SERVER_MAIN = 0;

    // TODO: BAAS, share enums between backend and front end
    this.ITEM_INVALID = 0;
    this.ITEM_VALID = 1;
    this.ITEM_VERIFY = 2;
    this.ITEM_UPDATED = 3; // for device only

    this.DEVICE_INVALID = 0;
    this.DEVICE_VALID = 1;
    this.DEVICE_EXCEPTION = 2;

    this.CITY_NORMAL = 0;
    this.CITY_COVERED = 1;

    this.CATEGORY_AC = 1;
    this.CATEGORY_TV = 2;
    this.CATEGORY_STB = 3;
    this.CATEGORY_NW = 4;
    this.CATEGORY_IPTV = 5;
    this.CATEGORY_DVD = 6;
    this.CATEGORY_FAN = 7;
    this.CATEGORY_PROJECTOR = 8;
    this.CATEGORY_STEREO = 9;
    this.CATEGORY_LIGHT_BULB = 10;
    this.CATEGORY_BSTB = 11;
    this.CATEGORY_CLEANING_ROBOT = 12;
    this.CATEGORY_AIR_CLEANER = 13;
    this.CATEGORY_DYSON = 14;

    this.REMOTE_NOT_BOUND = 0;
    this.REMOTE_BOUND = 1;

    this.CREATE_TYPE_DIY = 0;
    this.CREATE_TYPE_DOWNLOAD = 1;

    this.VERSION_TYPE_DEVICE = 0;
    this.VERSION_TYPE_REMOTE = 1;
    this.VERSION_TYPE_IOS = 2;
    this.VERSION_TYPE_ANDROID = 3;

    this.VERSION_PURPOSE_OAD = 0;
    this.VERSION_PURPOSE_UPD = 1;
    this.VERSION_PURPOSE_FAC = 2;

    this.VERSION_ST_UCON = 0;
    this.VERSION_ST_REM = 1;

    // remote with EEPROM storage, Simplified Chinese, UCON_REMOTE
    this.VERSION_RT_0 = 0;

    this.COME_FROM_DEVICE = 0;
    this.COME_FROM_PC_SUITE = 1;
    this.COME_FROM_WEBSITE = 2;
    this.COME_FROM_UPDATE_BOARD = 3;
    this.COME_FROM_APP_ANDROID = 4;
    this.COME_FROM_APP_IOS = 5;

    this.LANGUAGE_CN = 0;
    this.LANGUAGE_EN = 1;
    this.LANGUAGE_TW = 2;

    this.STAT_TYPE_REMOTE_INSTANCE_ACTIVE = 0;
    this.STAT_TYPE_DEVICE_ACTIVE = 1;
    this.STAT_TYPE_REMOTE_ACTIVE = 2;
    this.STAT_TYPE_REMOTE_BY_CATEGORY = 3;
    this.STAT_TYPE_REMOTE_BY_CITY = 4;
    this.STAT_TYPE_UPDATE_RECORD = 5;
    this.STAT_TYPE_BRAND = 6;

    this.SWITCH_ON = 1;
    this.SWITCH_OFF = 0;

    this.SWITCH_TARGET_DEVICE = 0;
    this.SWITCH_TARGET_IOS_APP = 1;
    this.SWITCH_TARGET_ANDROID_APP = 2;

    this.REMOTE_INSTANCE_STATUS_B = 1;
    this.REMOTE_INSTANCE_STATUS_A = 2;

    this.REMOTE_INSTANCE_TYPE_UCON = 1;
    this.REMOTE_INSTANCE_TYPE_REMOTE = 2;

    this.JPUSH_DEVICE_TYPE_IOS = 0;
    this.JPUSH_DEVICE_TYPE_ANDROID = 1;
    this.JPUSH_DEVICE_TYPE_BOTH = 2;

    this.JPUSH_DEST_TYPE_BROADCAST = 0;
    this.JPUSH_DEST_TYPE_PEER = 1;
    this.JPUSH_DEST_TYPE_GROUP = 2;

    this.JPUSH_PUSH_TYPE_MESSAGE = 0;
    this.JPUSH_PUSH_TYPE_NOTIFICATION = 1;

    this.SNS_TYPE_WEIXIN = 0;
    this.SNS_TYPE_QQ = 1;
    this.SNS_TYPE_FACEBOOK = 2;
    this.SNS_TYPE_WHATSAPP = 3;

    this.ROOM_TYPE_SYSTEM = 0;
    this.ROOM_TYPE_CUSTOM = 1;
}

module.exports = Enums;