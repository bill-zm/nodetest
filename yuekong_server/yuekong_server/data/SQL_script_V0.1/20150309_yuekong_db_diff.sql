ALTER TABLE `yuekong_db`.`remote`
DROP COLUMN `code_14`,
DROP COLUMN `key_14`,
DROP COLUMN `code_13`,
DROP COLUMN `key_13`,
DROP COLUMN `code_12`,
DROP COLUMN `key_12`,
DROP COLUMN `code_11`,
DROP COLUMN `key_11`,
DROP COLUMN `code_10`,
DROP COLUMN `key_10`,
DROP COLUMN `code_9`,
DROP COLUMN `key_9`,
DROP COLUMN `code_8`,
DROP COLUMN `key_8`,
DROP COLUMN `code_7`,
DROP COLUMN `key_7`,
DROP COLUMN `code_6`,
DROP COLUMN `key_6`,
DROP COLUMN `code_5`,
DROP COLUMN `key_5`,
DROP COLUMN `code_4`,
DROP COLUMN `key_4`,
DROP COLUMN `code_3`,
DROP COLUMN `key_3`,
DROP COLUMN `code_2`,
DROP COLUMN `key_2`,
DROP COLUMN `code_1`,
DROP COLUMN `key_1`,
DROP COLUMN `code_0`,
DROP COLUMN `key_0`,
ADD COLUMN `remote_code` TEXT NULL AFTER `status`;

CREATE TABLE IF NOT EXISTS `yuekong_db`.`remote_instance` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(32) NULL,
  `rsn` VARCHAR(32) NULL,
  `is_bound` TINYINT(4) NULL,
  `status` TINYINT(4) NULL,
  `mobile_id` VARCHAR(32) NULL,
  `user_open_id` VARCHAR(72) NULL,
  `user_name` VARCHAR(32) NULL,
  `mac_address` VARCHAR(32) NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `yuekong_db`.`remote`
ADD COLUMN `remote_instance_id` INT NOT NULL AFTER `remote_code`;

ALTER TABLE `yuekong_db`.`remote`
DROP COLUMN `remote_mode`;

ALTER TABLE `yuekong_db`.`remote`
ADD COLUMN `mac_address` VARCHAR(32);