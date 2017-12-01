/**
 * Created by Strawmanbobi
 * 2015-01-22
 */

// system inclusion
var express= require('express');
var app = module.exports = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// global inclusion
require('../../Infrastructure/BackEnd/configuration/constants');
var System = require('../../Infrastructure/BackEnd/utils/system_utils');
var dateUtils = require('../../Infrastructure/BackEnd/utils/date_utils');
var systemConfig = require('./configuration/system_configs');

// local inclusion
var Enums = require('./configuration/enums');
var ErrorCode = require('./configuration/error_code');
var enums = new Enums();
var errorCode = new ErrorCode();

SERVER = enums.SERVER_MAIN;

var serverListenPort = enums.APP_PRODUCTION_MODE;

console.log('Configuring Infrastructure...');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use("/", express.static(__dirname));
systemConfig.setupEnvironment();
serverListenPort = LISTEN_PORT;

var dbConn = require('../../Infrastructure/BackEnd/db/mysql/mysql_connection');

console.log("initializing MySQL connection to : " + MYSQL_DB_SERVER_ADDRESS + ":" + MYSQL_DB_NAME);
dbConn.setMySQLParameter(MYSQL_DB_SERVER_ADDRESS, MYSQL_DB_NAME, MYSQL_DB_USER, MYSQL_DB_PASSWORD);

// the following statements is automatically generated according to system configuration
var kvConn = require('../../Infrastructure/BackEnd/db/mongodb/mongodb_connection');
console.log('initializing MongoDB connection to : ' + MONGO_DB_SERVER_ADDRESS + ":" + MONGO_DB_NAME);
kvConn.setMongoDBParameter(MONGO_DB_SERVER_ADDRESS, MONGO_DB_NAME, MONGO_DB_USER, MONGO_DB_PASSWORD);

require('./routes');

// kick start the engine
System.startup(app, serverListenPort, "UCON V2.1.0");
