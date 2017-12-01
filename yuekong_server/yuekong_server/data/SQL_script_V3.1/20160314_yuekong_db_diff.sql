use `ucon_generic`;

ALTER TABLE `ucon_generic`.`device_instance`
CHANGE COLUMN `user_open_id` `user_open_id` VARCHAR(72) NULL DEFAULT NULL COMMENT '' ,
CHANGE COLUMN `user_name` `user_name` VARCHAR(32) NULL DEFAULT NULL COMMENT '' ;
