
ALTER TABLE `ucon_generic`.`push_message`
ADD COLUMN `dest_type` TINYINT(4) NULL COMMENT '' AFTER `push_type`;

ALTER TABLE `ucon_generic`.`subscription`
ADD COLUMN `ble_sub_category` INT(11) NULL COMMENT '' AFTER `ble_target_name`,
ADD COLUMN `ble_sub_category_name` VARCHAR(32) NULL COMMENT '' AFTER `ble_sub_category`;
