ALTER TABLE `ucon_generic`.`remote_instance`
CHANGE COLUMN `mobile_id` `mobile_id` VARCHAR(64) NULL DEFAULT NULL ;

ALTER TABLE `ucon_generic`.`device_instance`
CHANGE COLUMN `mobile_id` `mobile_id` VARCHAR(64) NULL DEFAULT NULL ;
