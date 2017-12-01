ALTER TABLE `ucon_generic`.`remote_instance`
ADD COLUMN `remote_instance_type` TINYINT(4) NULL COMMENT '' AFTER `update_time`,
ADD COLUMN `remote_instance_status` TINYINT(4) NULL COMMENT '' AFTER `remote_instance_type`;
