CREATE TABLE `ucon_generic`.`mobile_user` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `mobile_id` VARCHAR(64) NULL COMMENT '',
  `weixin_id` VARCHAR(40) NULL COMMENT '',
  `sns_type` TINYINT(4) NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '');

ALTER TABLE `ucon_generic`.`user`
DROP COLUMN `qq_id`,
ADD COLUMN `sns_type` TINYINT(4) NULL COMMENT '' AFTER `weixin_id`;