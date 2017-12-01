ALTER TABLE `ucon_generic`.`subscription`
ADD COLUMN `remote_index_type` TINYINT(4) NULL AFTER `status`,
ADD COLUMN `pure_kies` VARCHAR(1024) NULL AFTER `remote_index_type`;
