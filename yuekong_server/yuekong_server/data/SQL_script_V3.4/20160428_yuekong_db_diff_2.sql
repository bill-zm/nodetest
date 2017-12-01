ALTER TABLE `ucon_generic`.`remote`
CHANGE COLUMN `ble_target_mac` `ble_target_mac` VARCHAR(20) NULL DEFAULT NULL COMMENT '' ;

ALTER TABLE `ucon_generic`.`subscription`
CHANGE COLUMN `ble_target_mac` `ble_target_mac` VARCHAR(20) NULL DEFAULT NULL COMMENT '' ;

ALTER TABLE `ucon_generic`.`brand`
DROP COLUMN `ble_sub_category_name`,
DROP COLUMN `ble_sub_category`;

ALTER TABLE `ucon_generic`.`remote`
DROP COLUMN `ble_sub_category_name`,
DROP COLUMN `ble_sub_category`,
ADD COLUMN `radio_type` TINYINT(4) NULL COMMENT '' AFTER `ble_target_name`;

ALTER TABLE `ucon_generic`.`remote_index_ii`
DROP COLUMN `ble_sub_category_name`,
DROP COLUMN `ble_sub_category`;

ALTER TABLE `ucon_generic`.`subscription`
DROP COLUMN `ble_sub_category_name`,
DROP COLUMN `ble_sub_category`,
ADD COLUMN `radio_type` TINYINT(4) NULL COMMENT '' AFTER `ble_target_name`;

