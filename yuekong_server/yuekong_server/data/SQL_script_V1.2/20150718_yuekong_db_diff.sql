CREATE TABLE `ucon_generic`.`version` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `version_type` TINYINT(4) NULL,
  `version` VARCHAR(20) NULL,
  `com_version` VARCHAR(20) NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `ucon_generic`.`version`
ADD COLUMN `update_time` VARCHAR(20) NULL AFTER `com_version`,
ADD COLUMN `uploader` VARCHAR(32) NULL AFTER `update_time`,
ADD COLUMN `comment` VARCHAR(512) NULL AFTER `uploader`;

ALTER TABLE `ucon_generic`.`version`
CHANGE COLUMN `version` `dev_wlan_ver` VARCHAR(20) NULL DEFAULT NULL ,
CHANGE COLUMN `com_version` `dev_ble_ver` VARCHAR(20) NULL DEFAULT NULL ,
ADD COLUMN `rem_ble_ver` VARCHAR(20) NULL DEFAULT NULL AFTER `dev_ble_ver`;

ALTER TABLE `ucon_generic`.`version`
ADD COLUMN `status` TINYINT(4) NULL AFTER `comment`;