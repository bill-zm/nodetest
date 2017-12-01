ALTER TABLE `ucon_generic`.`remote_index`
ADD COLUMN `banned_remote_version` VARCHAR(16) NULL AFTER `applied_device_version`,
ADD COLUMN `banned_device_version` VARCHAR(16) NULL AFTER `banned_remote_version`;

UPDATE `ucon_generic`.`remote_index` SET banned_remote_version = 'V99.0.0', banned_device_version = 'V99.0.0';