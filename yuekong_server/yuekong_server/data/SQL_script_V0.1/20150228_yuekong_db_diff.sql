CREATE TABLE IF NOT EXISTS `yuekong_db`.`subscription` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sub_time` CHAR(20) NULL,
  `pdsn` VARCHAR(32) NULL,
  `remote_id` INT NULL,
  `remote_keys` VARCHAR(128) NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `yuekong_db`.`subscription`
  CHANGE COLUMN `pdsn` `device_pdsn` VARCHAR(32) NULL DEFAULT NULL ;

ALTER TABLE `yuekong_db`.`subscription`
ADD COLUMN `status` TINYINT(4) NULL AFTER `remote_keys`;