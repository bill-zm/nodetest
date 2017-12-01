CREATE TABLE `ucon_generic`.`push_message` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `from_peer` VARCHAR(32) NULL COMMENT '',
  `to_peer` VARCHAR(32) NULL COMMENT '',
  `to_group` VARCHAR(32) NULL COMMENT '',
  `push_type` TINYINT(4) NULL COMMENT '',
  `message` TEXT NULL COMMENT '',
  `status` TINYINT(4) NULL COMMENT '',
  `update_time` CHAR(20) NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '');

ALTER TABLE `ucon_generic`.`remote`
ADD COLUMN `ble_tag104` TINYINT(4) NULL COMMENT '' AFTER `ble_sub_category_name`,
ADD COLUMN `ble_target_mac` VARCHAR(16) NULL COMMENT '' AFTER `ble_tag104`,
ADD COLUMN `ble_target_name` VARCHAR(32) NULL COMMENT '' AFTER `ble_target_mac`;