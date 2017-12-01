CREATE TABLE `ucon_remote`.`ir_protocol` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `name` VARCHAR(32) NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '');

  ALTER TABLE `ucon_remote`.`ir_protocol`
  ADD COLUMN `status` TINYINT(4) NULL COMMENT '' AFTER `name`;

UPDATE `ucon_remote`.`city` SET `status` = `1`;

ALTER TABLE `ucon_remote`.`remote_index`
ADD COLUMN `priority` INT(11) NULL COMMENT '' AFTER `sub_cate`;


