INSERT INTO `ucon_generic`.`category` (`id`, `name`, `status`, `create_time`, `radio_type`, `ble_mode`, `applied_android_version`, `banned_android_version`, `applied_ios_version`, `banned_ios_version`, `name_en`, `name_tw`) VALUES ('11', '品牌机顶盒', '1', '2016-05-08 17:00:00', '0', '0', 'V2.0.0', 'V99.0.0', 'V2.1.0', 'V99.0.0', 'STB', '品牌機上盒');

ALTER TABLE `ucon_generic`.`category`
ADD COLUMN `protector` VARCHAR(128) NULL COMMENT '' AFTER `name_tw`;

UPDATE `ucon_generic`.`category` SET `protector`='SCT' WHERE `id`='1';
UPDATE `ucon_generic`.`category` SET `protector`='SCT' WHERE `id`='2';
UPDATE `ucon_generic`.`category` SET `protector`='SCT' WHERE `id`='3';
UPDATE `ucon_generic`.`category` SET `protector`='SCT' WHERE `id`='4';
UPDATE `ucon_generic`.`category` SET `protector`='SCT' WHERE `id`='5';
UPDATE `ucon_generic`.`category` SET `protector`='SCT' WHERE `id`='6';
UPDATE `ucon_generic`.`category` SET `protector`='SCT' WHERE `id`='7';
UPDATE `ucon_generic`.`category` SET `protector`='SCT' WHERE `id`='8';
UPDATE `ucon_generic`.`category` SET `protector`='SCT' WHERE `id`='9';
UPDATE `ucon_generic`.`category` SET `protector`='SCT' WHERE `id`='10';
UPDATE `ucon_generic`.`category` SET `protector`='T' WHERE `id`='11';
