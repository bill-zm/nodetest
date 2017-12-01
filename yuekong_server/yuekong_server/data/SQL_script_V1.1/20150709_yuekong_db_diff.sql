ALTER TABLE `ucon_generic`.`subscription`
ADD COLUMN `mobile_id` VARCHAR(64) NULL AFTER `category_id`,
ADD COLUMN `user_id` VARCHAR(64) NULL AFTER `mobile_id`;
ALTER TABLE `ucon_generic`.`subscription`
ADD COLUMN `remote_no` INT(11) NULL AFTER `user_id`;
