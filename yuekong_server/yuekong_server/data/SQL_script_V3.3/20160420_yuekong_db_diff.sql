ALTER TABLE `ucon_generic`.`brand`
ADD COLUMN `ble_sub_category` INT(11) NULL COMMENT '' AFTER `name_tw`;

ALTER TABLE `ucon_generic`.`brand`
ADD COLUMN `ble_sub_category_name` VARCHAR(32) NULL COMMENT '' AFTER `ble_sub_category`;

ALTER TABLE `ucon_generic`.`remote_index_ii`
ADD COLUMN `ble_sub_category` INT(11) NULL COMMENT '' AFTER `ble_remote_index`,
ADD COLUMN `ble_sub_category_name` VARCHAR(32) NULL COMMENT '' AFTER `ble_sub_category`;

ALTER TABLE `ucon_generic`.`remote`
ADD COLUMN `ble_sub_category` INT(11) NULL COMMENT '' AFTER `binary_version`,
ADD COLUMN `ble_sub_category_name` VARCHAR(32) NULL COMMENT '' AFTER `ble_sub_category`;

UPDATE `ucon_generic`.`category` SET `id`='24', `radio_type`='1', `name_en`='BLE Device' WHERE `id`='10';
UPDATE `ucon_generic`.`category` SET `id`='25', `radio_type`='2', `name_en`='WIFI Device' WHERE `id`='11';
INSERT INTO `ucon_generic`.`category` (`name`, `status`, `create_time`, `radio_type`, `ble_mode`, `applied_android_version`, `banned_android_version`, `applied_ios_version`, `banned_ios_version`, `name_en`, `name_tw`) VALUES ('433M设备', '2', '2016-04-20 11:00:00', '3', '0', 'V99.0.0', 'V99.0.0', 'V99.0.0', 'V99.0.0', '433M Device', '433M設備');
INSERT INTO `ucon_generic`.`category` (`name`, `status`, `create_time`, `radio_type`, `ble_mode`, `applied_android_version`, `banned_android_version`, `applied_ios_version`, `banned_ios_version`, `name_en`, `name_tw`) VALUES ('Zigbee设备', '2', '2016-04-20 11:00:00', '4', '0', 'V99.0.0', 'V99.0.0', 'V99.0.0', 'V99.0.0', 'Zigbee Device', 'Zigbee設備');
INSERT INTO `ucon_generic`.`category` (`id`, `name`, `status`, `create_time`, `radio_type`, `ble_mode`, `applied_android_version`, `banned_android_version`, `applied_ios_version`, `banned_ios_version`, `name_en`, `name_tw`) VALUES ('10', '灯具', '1', '2016-04-20 19:00:00', '0', '0', 'V2.0.0', 'V99.0.0', 'V2.1.0', 'V99.0.0', 'Light', '燈具');

UPDATE `ucon_generic`.`category` SET `id`='26' WHERE `id`='12';
UPDATE `ucon_generic`.`category` SET `id`='27' WHERE `id`='13';
