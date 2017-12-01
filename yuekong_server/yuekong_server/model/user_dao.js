/**
 * Created by strawmanbobi
 * 2016-03-01
 */

// global inclusion
var orm = require('../../../Infrastructure/BackEnd/node_modules/orm');
var dbOrm = require('../../../Infrastructure/BackEnd/db/mysql/mysql_connection').mysqlDB;
var logger = require('../../../Infrastructure/BackEnd/logging/logger4js').helper;
var dateUtils = require('../../../Infrastructure/BackEnd/utils/date_utils.js');

// local inclusion
var ErrorCode = require('../configuration/error_code');
var errorCode = new ErrorCode();

var Enums = require('../configuration/enums');
var enums = new Enums();

var User = dbOrm.define('user',
    {
        id: Number,
        name: String,
        weixin_id: String,
        sns_type: Number,
        avatar_url: String,
        update_time: String,
        status: Number
    },
    {
        cache: false
    }
);

User.createUser = function(user, callback) {
    var date = dateUtils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
    var newUser = new User({
        name: user.name,
        weixin_id: user.weixin_id,
        sns_type: user.sns_type,
        avatar_url: user.avatar_url,
        update_time: date,
        status: enums.ITEM_VALID
    });
    newUser.save(function(error, createdUser) {
        if(error) {
            logger.error('failed to create user : ' + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info('succeeded to create user');
            callback(errorCode.SUCCESS, createdUser);
        }
    });

};

User.findUserByConditions = function(conditions, callback) {
    User.find(conditions)
        .run(function (error, users) {
            if (error) {
                logger.error("find user error : " + error);
                callback(errorCode.FAILED, null);
            } else {
                logger.info("find user successfully, length of users = " + users.length);
                callback(errorCode.SUCCESS, users);
            }
        });
};

User.listUsers = function(conditions, from, count, sortField, callback) {
    if("id" == sortField && 0 != from) {
        conditions.id = orm.gt(from);
        User.find(conditions).limit(parseInt(count)).orderRaw("?? ASC", [sortField])
            .run(function (listUsersErr, users) {
                if (listUsersErr) {
                    logger.error("list users error : " + listUsersErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list users successfully");
                    callback(errorCode.SUCCESS, users);
                }
            });
    } else {
        User.find(conditions).limit(parseInt(count)).offset(parseInt(from)).orderRaw("?? ASC", [sortField])
            .run(function (listUsersErr, users) {
                if (listUsersErr) {
                    logger.error("list users error : " + listUsersErr);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info("list users successfully");
                    callback(errorCode.SUCCESS, users);
                }
            });
    }
};

User.getUserByID = function(userID, callback) {
    User.get(userID, function(error, user) {
        if (error) {
            logger.error("get user by ID error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("get user by ID successfully");
            callback(errorCode.SUCCESS, user);
        }
    });
};

User.findUserByConditions = function(conditions, callback) {
    User.find(conditions, function(error, users) {
        if (error) {
            logger.error("find user by conditions error : " + error);
            callback(errorCode.FAILED, null);
        } else {
            logger.info("find user by conditions successfully");
            callback(errorCode.SUCCESS, users);
        }
    });
};

User.updateUserByID = function(userID, newUser, callback) {
    User.get(userID, function(error, user) {
        if (error) {
            logger.error("get user by ID error in update user : " + error);
            callback(errorCode.FAILED, null);
        } else {
            for(var p in user) {
                if(null != newUser[p]) {
                    user[p] = newUser[p];
                }
            }
            user.save(function(error, updatedUser) {
                if(error) {
                    logger.error('failed to update user in update user : ' + error);
                    callback(errorCode.FAILED, null);
                } else {
                    logger.info('succeeded to update user');
                    callback(errorCode.SUCCESS, updatedUser);
                }
            });
        }
    });
};

module.exports = User;