ALTER TABLE `ucon_generic`.`remote_index_ii`
ADD COLUMN `input_source` VARCHAR(32) NULL COMMENT '' AFTER `ble_remote_index`;

ALTER TABLE `ucon_generic`.`brand`
ADD COLUMN `input_source` VARCHAR(32) NULL COMMENT '' AFTER `name_tw`;

ALTER TABLE `ucon_generic`.`brand`
CHANGE COLUMN `input_source` `input_source` VARCHAR(128) NULL DEFAULT NULL COMMENT '' ;

ALTER TABLE `ucon_generic`.`remote_index_ii`
CHANGE COLUMN `input_source` `input_source` VARCHAR(128) NULL DEFAULT NULL COMMENT '' ;

ALTER TABLE `ucon_generic`.`admin`
ADD COLUMN `admin_type` TINYINT(4) NULL COMMENT '' AFTER `permissions`;

UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='1';
UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='2';
UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='3';
UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='6';
UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='8';
UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='9';
UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='10';
UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='11';
UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='12';
UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='13';
UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='14';
UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='15';
UPDATE `ucon_generic`.`admin` SET `admin_type`='1' WHERE `id`='16';
