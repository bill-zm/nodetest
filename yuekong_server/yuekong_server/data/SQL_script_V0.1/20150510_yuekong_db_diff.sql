CREATE TABLE `yuekong_db`.`device_instance` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `pdsn` VARCHAR(64) NULL,
  `name` VARCHAR(32) NULL,
  `status` TINYINT(4) NULL,
  `create_time` CHAR(20) NULL,
  `ip_address` VARCHAR(32) NULL,
  `version` VARCHAR(16) NULL,
  `mobile_id` VARCHAR(32) NULL,
  PRIMARY KEY (`id`));
