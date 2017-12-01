CREATE TABLE `ucon_generic`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `name` VARCHAR(40) NULL COMMENT '',
  `weixin_id` VARCHAR(40) NULL COMMENT '',
  `qq_id` VARCHAR(40) NULL COMMENT '',
  `avatar_url` VARCHAR(512) NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '');

ALTER TABLE `ucon_generic`.`device_instance`
ADD COLUMN `user_open_id` INT NULL COMMENT '' AFTER `mobile_id`,
ADD COLUMN `user_name` VARCHAR(40) NULL COMMENT '' AFTER `user_open_id`;

ALTER TABLE `ucon_generic`.`user`
ADD COLUMN `update_time` VARCHAR(20) NULL COMMENT '' AFTER `avatar_url`;

ALTER TABLE `ucon_generic`.`user`
ADD COLUMN `status` TINYINT(4) NULL COMMENT '' AFTER `update_time`;