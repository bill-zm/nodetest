ALTER TABLE `ucon_generic`.`mobile`
DROP COLUMN `mobile_number`,
DROP COLUMN `ip_address`,
DROP COLUMN `sskey`,
DROP COLUMN `ssid`,
DROP COLUMN `pid`,
CHANGE COLUMN `pdsn` `mobile_id` VARCHAR(64) NOT NULL COMMENT '' ,
CHANGE COLUMN `device_version` `push_type` TINYINT(4) NOT NULL COMMENT '' ,
ADD COLUMN `app_type` TINYINT(4) NULL COMMENT '' AFTER `mobile_id`,
ADD COLUMN `conversation_id` VARCHAR(32) NULL COMMENT '' AFTER `push_type`,
DROP INDEX `deveice_id` ;

ALTER TABLE `ucon_generic`.`mobile`
CHANGE COLUMN `create_time` `update_time` CHAR(20) NOT NULL COMMENT '' ;
