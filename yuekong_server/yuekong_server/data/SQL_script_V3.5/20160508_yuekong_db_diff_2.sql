ALTER TABLE `ucon_generic`.`brand`
ADD COLUMN `protector` VARCHAR(128) NULL COMMENT '' AFTER `input_source`;

ALTER TABLE `ucon_generic`.`remote_index_ii`
ADD COLUMN `protector` VARCHAR(128) NULL COMMENT '' AFTER `input_source`;

ALTER TABLE `ucon_generic`.`city`
ADD COLUMN `protector` VARCHAR(128) NULL COMMENT '' AFTER `name_tw`;

DELETE FROM `ucon_generic`.`category` WHERE `id`='11';

