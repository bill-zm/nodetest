ALTER TABLE `ucon_generic`.`remote_instance`
CHANGE COLUMN `identifier` `identifier` VARCHAR(64) NULL DEFAULT NULL ;

ALTER TABLE `ucon_generic`.`remote`
ADD COLUMN `identifier` VARCHAR(64) NULL AFTER `remote_number`;
