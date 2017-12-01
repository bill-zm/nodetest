ALTER TABLE `yuekong_db`.`remote`
CHANGE COLUMN `device_pdsn` `rsn` VARCHAR(32) NOT NULL ;

ALTER TABLE `yuekong_db`.`remote`
ADD COLUMN `device_pdsn` VARCHAR(32) NULL AFTER `id`;

ALTER TABLE `yuekong_db`.`remote`
ADD COLUMN `category_name` VARCHAR(32) NULL AFTER `category_id`,
ADD COLUMN `brand_name` VARCHAR(32) NULL AFTER `brand_id`,
ADD COLUMN `create_type` TINYINT(4) NULL AFTER `remote_index_id`;

ALTER TABLE `yuekong_db`.`remote`
ADD COLUMN `remote_mode` MEDIUMINT(7) NULL AFTER `rsn`;

ALTER TABLE `yuekong_db`.`remote`
ADD COLUMN `remote_index_name` VARCHAR(64) NULL AFTER `remote_index_id`;