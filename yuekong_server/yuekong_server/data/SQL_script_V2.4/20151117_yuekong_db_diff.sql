ALTER TABLE `ucon_generic`.`version`
ADD COLUMN `sub_type` TINYINT(4) NULL COMMENT '' AFTER `status`;

ALTER TABLE `ucon_generic`.`version`
ADD COLUMN `purpose` TINYINT(4) NULL COMMENT '' AFTER `sub_type`;

ALTER TABLE `ucon_generic`.`version`
ADD COLUMN `dev_wlan_hash` VARCHAR(32) NULL COMMENT '' AFTER `rem_ble_ver`,
ADD COLUMN `dev_ble_hash` VARCHAR(32) NULL COMMENT '' AFTER `dev_wlan_hash`,
ADD COLUMN `rem_ble_hash` VARCHAR(32) NULL COMMENT '' AFTER `dev_ble_hash`;

ALTER TABLE `ucon_generic`.`version`
ADD COLUMN `remote_type` INT(16) NULL COMMENT '' AFTER `sub_type`;

ALTER TABLE `ucon_generic`.`brand`
ADD COLUMN `name_en` VARCHAR(64) NULL COMMENT '' AFTER `priority`;
