/**
 * Created by strawmanbobi on 14-10-17.
 */

require('../../../Infrastructure/BackEnd/configuration/constants');
var Enums = require('./enums');
var enums = new Enums();

global.WEB_SERVER_ADDRESS = "";
global.OPEN_WX_APP_SECRET = "";

exports.setupEnvironment = function () {
    var env = process.env.NODE_ENV || 'development';
    ENV = env;
    if (undefined == typeof env || null == env || "" == env || enums.APP_PRODUCTION_MODE == env) {
        console.log("configuring MySQL db connection ability...");
        MYSQL_DB_SERVER_ADDRESS = "rdsnnm1j217ct1f6h6djj.mysql.rds.aliyuncs.com";
        MYSQL_DB_NAME = "ucon_generic";
        MYSQL_DB_USER = "uconrds";
        MYSQL_DB_PASSWORD = "ucon923";

        console.log("configuring MongoDB kv connection ability...");
        MONGO_DB_SERVER_ADDRESS = "dds-bp190128661748b42.mongodb.rds.aliyuncs.com:3717";
        MONGO_DB_NAME = "admin";
        MONGO_DB_USER = "root";
        MONGO_DB_PASSWORD = "ucon1002";

        console.log("configuring kv storage ability...");
        OSS_HOST = "oss-cn-hangzhou.aliyuncs.com";
        OSS_PORT = "80";
        OSS_APP_ID = "f6bWxSdkNyu9FlyC";
        OSS_APP_SECRET = "nO2bzv8yETA6TwPsYNFlYpWRT867Zg";

        console.log("configuring cache ability...");
        MEMCACHED_HOST = "4bb06857646b4914.m.cnhzaliqshpub001.ocs.aliyuncs.com";
        MEMCACHED_PORT = "11211";
        MEMCACHED_SASL_USER = "4bb06857646b4914";
        MEMCACHED_SASL_PASSWORD = "NJucontech923";

        console.log("configuring external server connection ability...");
        LISTEN_PORT = "8200";
        WEB_SERVER_ADDRESS = "api.yuekong.com.cn:80";

        console.log("configuring security parameters...");
        APP_KEY = "d6119900556c4c1e629fd92d";
        APP_TOKEN = "fcac5496cba7a12b3bae34abf061f526";
        OPEN_WX_APP_SECRET = "d6b9715281976c0ddd66eb1294f4548c";

        console.log("configuring push credential");
        PUSH_APP_KEY = "b5e8e6123de67977dcb9813a";
        PUSH_APP_SECRET = "38c6aecde1c7f82c741b4a2a";

        console.log("configuring OSS direct download bucket name");
        OSS_DIR_DOWN_PATH = "yuekong-code-ii-rel";

        FILE_TEMP_PATH = "/root/rc_binary";
    } else if (enums.APP_DEVELOPMENT_MODE == env) {
        console.log("configuring MySQL db connection ability...");
        MYSQL_DB_SERVER_ADDRESS = "127.0.0.1";
        MYSQL_DB_NAME = "ucon_generic";
        MYSQL_DB_USER = "root";
        MYSQL_DB_PASSWORD = "root";

        console.log("configuring MongoDB kv connection ability...");
        MONGO_DB_SERVER_ADDRESS = "127.0.0.1";
        MONGO_DB_NAME = "yuekong_remote_code";
        MONGO_DB_USER = "yuekong";
        MONGO_DB_PASSWORD = "yuekong";

        console.log("configuring kv storage ability...");
        OSS_HOST = "oss-cn-hangzhou.aliyuncs.com";
        OSS_PORT = "80";
        OSS_APP_ID = "f6bWxSdkNyu9FlyC";
        OSS_APP_SECRET = "nO2bzv8yETA6TwPsYNFlYpWRT867Zg";

        console.log("configuring cache ability...");
        MEMCACHED_HOST = "127.0.0.1";
        MEMCACHED_PORT = "11211";
        MEMCACHED_SASL_USER = "";
        MEMCACHED_SASL_PASSWORD = "";

        console.log("configuring external server connection ability...");
        LISTEN_PORT = "8200";
        WEB_SERVER_ADDRESS = "192.168.1.170:8081";

        console.log("configuring security parameters...");
        APP_KEY = "d6119900556c4c1e629fd92d";
        APP_TOKEN = "fcac5496cba7a12b3bae34abf061f526";
        OPEN_WX_APP_SECRET = "d6b9715281976c0ddd66eb1294f4548c";

        console.log("configuring push credential");
        PUSH_APP_KEY = "b5e8e6123de67977dcb9813a";
        PUSH_APP_SECRET = "38c6aecde1c7f82c741b4a2a";

        console.log("configuring OSS direct download bucket name");
        OSS_DIR_DOWN_PATH = "yuekong-code-ii-debug";

        FILE_TEMP_PATH = "D:/rc_binary";
    } else if (enums.APP_USERDEBUG_MODE == env) {
        console.log("configuring MySQL db connection ability...");
        MYSQL_DB_SERVER_ADDRESS = "rm-bp11c9w1bz8q47zzx.mysql.rds.aliyuncs.com";
        MYSQL_DB_NAME = "ucon_generic";
        MYSQL_DB_USER = "uconrds";
        MYSQL_DB_PASSWORD = "ucon923";

        console.log("configuring MongoDB kv connection ability...");
        MONGO_DB_SERVER_ADDRESS = "127.0.0.1";
        MONGO_DB_NAME = "yuekong_remote_code";
        MONGO_DB_USER = "yuekong";
        MONGO_DB_PASSWORD = "yuekong";

        console.log("configuring kv storage ability...");
        OSS_HOST = "oss-cn-hangzhou.aliyuncs.com";
        OSS_PORT = "80";
        OSS_APP_ID = "T82nbipHSESmHzd8";
        OSS_APP_SECRET = "SOweQ8UVwCwPr2NC8EC89EOeKJc5Um";

        console.log("configuring cache ability...");
        MEMCACHED_HOST = "127.0.0.1";
        MEMCACHED_PORT = "11211";
        MEMCACHED_SASL_USER = "";
        MEMCACHED_SASL_PASSWORD = "";

        console.log("configuring external server connection ability...");
        LISTEN_PORT = "8200";
        WEB_SERVER_ADDRESS = "121.41.109.117:8081";

        console.log("configuring security parameters...");
        APP_KEY = "d6119900556c4c1e629fd92d";
        APP_TOKEN = "fcac5496cba7a12b3bae34abf061f526";
        OPEN_WX_APP_SECRET = "d6b9715281976c0ddd66eb1294f4548c";

        console.log("configuring push credential");
        PUSH_APP_KEY = "b5e8e6123de67977dcb9813a";
        PUSH_APP_SECRET = "38c6aecde1c7f82c741b4a2a";

        console.log("configuring OSS direct download bucket name");
        OSS_DIR_DOWN_PATH = "yuekong-code-ii-debug";

        FILE_TEMP_PATH = "/root/rc_binary";
    } else if (enums.APP_INTERNATIONAL_MODE == env) {
        console.log("configuring MySQL db connection ability...");
        MYSQL_DB_SERVER_ADDRESS = "localhost";
        MYSQL_DB_NAME = "ucon_generic";
        MYSQL_DB_USER = "root";
        MYSQL_DB_PASSWORD = "root";

        console.log("configuring MongoDB kv connection ability...");
        MONGO_DB_SERVER_ADDRESS = "127.0.0.1";
        MONGO_DB_NAME = "yuekong_remote_code";
        MONGO_DB_USER = "yuekong";
        MONGO_DB_PASSWORD = "yuekong";

        console.log("configuring kv storage ability...");
        OSS_HOST = "oss-cn-hangzhou.aliyuncs.com";
        OSS_PORT = "80";
        OSS_APP_ID = "T82nbipHSESmHzd8";
        OSS_APP_SECRET = "SOweQ8UVwCwPr2NC8EC89EOeKJc5Um";

        console.log("configuring cache ability...");
        MEMCACHED_HOST = "127.0.0.1";
        MEMCACHED_PORT = "11211";
        MEMCACHED_SASL_USER = "";
        MEMCACHED_SASL_PASSWORD = "";

        console.log("configuring external server connection ability...");
        LISTEN_PORT = "8200";
        WEB_SERVER_ADDRESS = "210.61.12.155:80";

        console.log("configuring security parameters...");
        APP_KEY = "d6119900556c4c1e629fd92d";
        APP_TOKEN = "fcac5496cba7a12b3bae34abf061f526";
        OPEN_WX_APP_SECRET = "d6b9715281976c0ddd66eb1294f4548c";

        console.log("configuring push credential");
        PUSH_APP_KEY = "b5e8e6123de67977dcb9813a";
        PUSH_APP_SECRET = "38c6aecde1c7f82c741b4a2a";

        console.log("configuring OSS direct download bucket name");
        OSS_DIR_DOWN_PATH = "yuekong-code-ii-rel";

        FILE_TEMP_PATH = "/root/rc_binary";
    } else {
        console.log("runtime mode err : " + env);
    }
};