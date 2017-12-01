/**
 * Created by strawmanbobi
 * 2015-03-02
 */

var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
require('../../../Infrastructure/BackEnd/configuration/constants');

var StbOperator = require('../model/stb_operator_dao.js');

var Enums = require('../configuration/enums.js');
var ErrorCode = require('../configuration/error_code.js');
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;

var enums = new Enums();
var errorCode = new ErrorCode();

exports.listOperatorsWorkUnit = function (cityCode, from, count, UA, callback) {
    var lang = enums.LANGUAGE_CN;
    var conditions;

    if (UA.indexOf("IN") > -1) {
        lang = enums.LANGUAGE_EN;
    } else if (UA.indexOf("TW") > -1) {
        lang = enums.LANGUAGE_TW;
    }

    if (UA.indexOf("SIRIUS") > -1) {
        conditions = {
            city_code: cityCode,
            status: enums.ITEM_VALID,
            operator_id: orm.lt('8000000')
        }
    } else {
        conditions = {
            city_code: cityCode,
            status: enums.ITEM_VALID
        };
    }

    StbOperator.listStbOperators(conditions, from, count, "id", function(listOperatorsErr, operators) {
        if (errorCode.SUCCESS.code == listOperatorsErr.code && operators.length > 0) {
            for (var i = 0; i < operators.length; i++) {
                var operator = operators[i];
                if (lang == enums.LANGUAGE_TW) {
                    operator.operator_name = operator.operator_name_tw;
                }
            }
        }

        callback(listOperatorsErr, operators);
    });
};