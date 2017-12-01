ALTER TABLE `ucon_generic`.`mobile_user`
ADD COLUMN `status` TINYINT(4) NULL COMMENT '' AFTER `sns_type`,
ADD COLUMN `update_time` VARCHAR(20) NULL COMMENT '' AFTER `status`;
