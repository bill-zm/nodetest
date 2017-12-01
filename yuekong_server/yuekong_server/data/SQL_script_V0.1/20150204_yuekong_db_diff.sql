UPDATE `yuekong_db`.`category` SET id = 1 WHERE id = 8;
UPDATE `yuekong_db`.`category` SET id = 2 WHERE id = 9;
UPDATE `yuekong_db`.`category` SET id = 3 WHERE id = 10;
UPDATE `yuekong_db`.`category` SET id = 4 WHERE id = 11;
UPDATE `yuekong_db`.`brand` SET category_id = 1 WHERE category_id = 8;
UPDATE `yuekong_db`.`brand` SET category_id = 2 WHERE category_id = 9;
UPDATE `yuekong_db`.`brand` SET category_id = 3 WHERE category_id = 10;
UPDATE `yuekong_db`.`brand` SET category_id = 4 WHERE category_id = 11;

ALTER TABLE `yuekong_db`.`remote_index`
ADD COLUMN `status` TINYINT NULL AFTER `remote_map`;

ALTER TABLE `yuekong_db`.`remote_index` 
ADD COLUMN `protocol` VARCHAR(64) NULL AFTER `city_name`,
ADD COLUMN `remote` VARCHAR(64) NULL AFTER `protocol`;
