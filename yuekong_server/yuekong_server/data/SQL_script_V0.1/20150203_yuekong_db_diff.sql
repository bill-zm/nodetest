ALTER TABLE `yuekong_db`.`category` 
CHANGE COLUMN `name` `name` VARCHAR(32) NOT NULL ;

ALTER TABLE `yuekong_db`.`brand` 
CHANGE COLUMN `name` `name` VARCHAR(32) NOT NULL ,
CHANGE COLUMN `category_name` `category_name` VARCHAR(32) NULL DEFAULT NULL ;

CREATE TABLE `yuekong_db`.`remote_index` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category_id` INT NOT NULL,
  `category_name` VARCHAR(32) NULL,
  `brand_id` INT NULL,
  `brand_name` VARCHAR(32) NULL,
  `city_code` VARCHAR(32) NULL,
  `city_name` VARCHAR(16) NULL,
  `ir_codemap` VARCHAR(64) NULL,
  PRIMARY KEY (`id`));
  
ALTER TABLE `yuekong_db`.`remote_index` 
CHANGE COLUMN `ir_codemap` `remote_map` VARCHAR(64) NULL DEFAULT NULL ;