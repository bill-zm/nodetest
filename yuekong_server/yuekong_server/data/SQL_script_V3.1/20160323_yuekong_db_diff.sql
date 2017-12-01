ALTER TABLE `ucon_generic`.`remote_instance`
ADD COLUMN `version` VARCHAR(16) NULL COMMENT '' AFTER `remote_instance_status`;
