INSERT INTO `ucon_generic`.`city` (`code`, `name`, `longitude`, `latitude`, `status`, `name_tw`, `protector`) VALUES ('900000', '台湾', '0', '0', '1', '臺灣', 'T');
INSERT INTO `ucon_generic`.`city` (`code`, `name`, `longitude`, `latitude`, `status`, `name_tw`, `protector`) VALUES ('900100', '台湾', '0', '0', '1', '臺灣', 'T');

INSERT INTO `ucon_generic`.`stb_operator` (`operator_name`, `city_code`, `city_name`, `status`, `operator_name_tw`) VALUES ('板桥大无畏宽带', '900100', '台湾', '1', '板橋大無畏寬頻');
INSERT INTO `ucon_generic`.`stb_operator` (`operator_name`, `city_code`, `city_name`, `status`, `operator_name_tw`) VALUES ('大新店宽带', '900100', '台湾', '1', '大新店寬頻');
INSERT INTO `ucon_generic`.`stb_operator` (`operator_name`, `city_code`, `city_name`, `status`, `operator_name_tw`) VALUES ('凯擘宽带', '900100', '台湾', '1', '凱擘寬頻');
INSERT INTO `ucon_generic`.`stb_operator` (`operator_name`, `city_code`, `city_name`, `status`, `operator_name_tw`) VALUES ('台湾大宽带', '900100', '台湾', '1', '台灣大寬頻');
INSERT INTO `ucon_generic`.`stb_operator` (`operator_name`, `city_code`, `city_name`, `status`, `operator_name_tw`) VALUES ('台湾宽带TBC', '900100', '台湾', '1', '台灣寬頻TBC');
INSERT INTO `ucon_generic`.`stb_operator` (`operator_name`, `city_code`, `city_name`, `status`, `operator_name_tw`) VALUES ('新永安', '900100', '台湾', '1', '新永安');
INSERT INTO `ucon_generic`.`stb_operator` (`operator_name`, `city_code`, `city_name`, `status`, `operator_name_tw`) VALUES ('中华电信MOD', '900100', '台湾', '1', '中華電信MOD');
INSERT INTO `ucon_generic`.`stb_operator` (`operator_name`, `city_code`, `city_name`, `status`, `operator_name_tw`) VALUES ('中嘉BB宽带', '900100', '台湾', '1', '中嘉BB寬頻');

UPDATE `ucon_generic`.`city` SET `name`='中国-台湾', `name_tw`='中華-臺灣' WHERE `id`='3381';
UPDATE `ucon_generic`.`city` SET `name`='中国-台湾', `name_tw`='中華-臺灣' WHERE `id`='3382';

UPDATE `ucon_generic`.`stb_operator` SET `operator_id`='tw01' WHERE `id`='805';
UPDATE `ucon_generic`.`stb_operator` SET `operator_id`='tw02' WHERE `id`='806';
UPDATE `ucon_generic`.`stb_operator` SET `operator_id`='tw03' WHERE `id`='807';
UPDATE `ucon_generic`.`stb_operator` SET `operator_id`='tw04' WHERE `id`='808';
UPDATE `ucon_generic`.`stb_operator` SET `operator_id`='tw05' WHERE `id`='809';
UPDATE `ucon_generic`.`stb_operator` SET `operator_id`='tw06' WHERE `id`='810';
UPDATE `ucon_generic`.`stb_operator` SET `operator_id`='tw07' WHERE `id`='811';
UPDATE `ucon_generic`.`stb_operator` SET `operator_id`='tw08' WHERE `id`='812';

INSERT INTO `ucon_generic`.`category` (`id`, `name`, `status`, `create_time`, `radio_type`, `ble_mode`, `applied_android_version`, `banned_android_version`, `applied_ios_version`, `banned_ios_version`, `name_en`, `name_tw`, `protector`) VALUES (11, '机顶盒', '1', '2016-05-10 14:00:00', '0', '0', 'V2.0.0', 'V99.0.0', 'V2.1.0', 'V99.0.0', 'BSTB', '機上盒', 'ST');

ALTER TABLE `ucon_generic`.`remote`
ADD COLUMN `sub_cate` TINYINT(4) NULL COMMENT '' AFTER `radio_type`;

ALTER TABLE `ucon_generic`.`subscription`
ADD COLUMN `sub_cate` TINYINT(4) NULL COMMENT '' AFTER `radio_type`;