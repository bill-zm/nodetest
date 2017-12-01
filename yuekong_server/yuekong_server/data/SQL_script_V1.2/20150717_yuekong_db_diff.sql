ALTER TABLE `ucon_generic`.`device`
ADD COLUMN `com_version` VARCHAR(16) NULL AFTER `version`;

ALTER TABLE `ucon_generic`.`device_instance`
ADD COLUMN `com_version` VARCHAR(16) NULL AFTER `version`;

ALTER TABLE `ucon_generic`.`remote`
ADD COLUMN `update_time` VARCHAR(20) NULL AFTER `identifier`;

ALTER TABLE `ucon_generic`.`remote_instance`
ADD COLUMN `update_time` VARCHAR(20) NULL AFTER `identifier`;