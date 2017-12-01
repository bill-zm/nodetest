ALTER TABLE `ucon_generic`.`brand`
ADD COLUMN `priority` INT(7) NULL AFTER `create_time`;

ALTER TABLE `ucon_generic`.`remote_index`
ADD COLUMN `applied_remote_version` VARCHAR(16) NULL AFTER `priority`,
ADD COLUMN `applied_device_version` VARCHAR(16) NULL AFTER `applied_remote_version`;

#set applicable version for ucon_generic.remote_index
UPDATE `ucon_generic`.`remote_index` SET applied_remote_version = 'V1.0.0', applied_device_version = 'V1.0.0';

#set brand priority for ucon_generic.brand
UPDATE `ucon_generic`.`brand` SET priority = 999;

#update brand priority for AC and added some AC brand
UPDATE `ucon_generic`.`brand` SET `priority`='1' WHERE `id`='4';
UPDATE `ucon_generic`.`brand` SET `priority`='2' WHERE `id`='9';
UPDATE `ucon_generic`.`brand` SET `priority`='3' WHERE `id`='5';
UPDATE `ucon_generic`.`brand` SET `priority`='4' WHERE `id`='6';
UPDATE `ucon_generic`.`brand` SET `priority`='5' WHERE `id`='11';
INSERT INTO `ucon_generic`.`brand` (`id`, `name`, `category_id`, `category_name`, `status`, `create_time`, `priority`) VALUES ('84', '大金', '1', '空调', '1', '2015-08-20 14:30:00', '6');
UPDATE `ucon_generic`.`brand` SET `priority`='7' WHERE `id`='1';
INSERT INTO `ucon_generic`.`brand` (`id`, `name`, `category_id`, `category_name`, `status`, `create_time`, `priority`) VALUES ('85', '松下', '1', '空调', '1', '2015-08-20 14:30:00', '8');
INSERT INTO `ucon_generic`.`brand` (`id`, `name`, `category_id`, `category_name`, `status`, `create_time`, `priority`) VALUES ('86', '格兰仕', '1', '空调', '1', '2015-08-20 14:30:00', '9');
UPDATE `ucon_generic`.`brand` SET `priority`='9' WHERE `id`='10';


UPDATE `ucon_generic`.`brand` SET `priority`='1' WHERE `id`='17';
UPDATE `ucon_generic`.`brand` SET `priority`='2' WHERE `id`='22';
UPDATE `ucon_generic`.`brand` SET `priority`='3' WHERE `id`='15';
UPDATE `ucon_generic`.`brand` SET `priority`='4' WHERE `id`='25';
UPDATE `ucon_generic`.`brand` SET `priority`='5' WHERE `id`='18';
UPDATE `ucon_generic`.`brand` SET `priority`='6' WHERE `id`='14';
UPDATE `ucon_generic`.`brand` SET `priority`='7' WHERE `id`='13';
UPDATE `ucon_generic`.`brand` SET `priority`='8' WHERE `id`='23';
UPDATE `ucon_generic`.`brand` SET `priority`='9' WHERE `id`='19';
UPDATE `ucon_generic`.`brand` SET `priority`='10' WHERE `id`='24';

UPDATE `ucon_generic`.`brand` SET `priority`='1' WHERE `id`='27';
DELETE FROM `ucon_generic`.`brand` WHERE `id`='28';
DELETE FROM `ucon_generic`.`brand` WHERE `id`='30';
UPDATE `ucon_generic`.`brand` SET `priority`='2' WHERE `id`='53';
UPDATE `ucon_generic`.`brand` SET `priority`='3' WHERE `id`='29';
UPDATE `ucon_generic`.`brand` SET `priority`='4' WHERE `id`='45';
UPDATE `ucon_generic`.`brand` SET `priority`='5' WHERE `id`='31';
UPDATE `ucon_generic`.`brand` SET `priority`='6' WHERE `id`='34';
UPDATE `ucon_generic`.`brand` SET `priority`='7' WHERE `id`='57';
UPDATE `ucon_generic`.`brand` SET `priority`='8' WHERE `id`='69';
UPDATE `ucon_generic`.`brand` SET `priority`='9' WHERE `id`='52';
UPDATE `ucon_generic`.`brand` SET `priority`='10' WHERE `id`='58';
UPDATE `ucon_generic`.`brand` SET `priority`='11' WHERE `id`='64';
UPDATE `ucon_generic`.`brand` SET `priority`='12' WHERE `id`='42';
