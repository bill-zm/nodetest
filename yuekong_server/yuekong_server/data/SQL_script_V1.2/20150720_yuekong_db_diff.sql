ALTER TABLE `ucon_generic`.`remote_instance`
ADD COLUMN `remote_pdsn` VARCHAR(32) NULL AFTER `device_pdsn`;

ALTER TABLE `ucon_generic`.`remote`
ADD COLUMN `remote_pdsn` VARCHAR(45) NULL AFTER `device_pdsn`;

