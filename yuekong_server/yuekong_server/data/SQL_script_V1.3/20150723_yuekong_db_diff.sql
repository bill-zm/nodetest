CREATE SCHEMA `ucon_remote` ;

CREATE TABLE `ucon_remote`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(32) NULL,
  `status` TINYINT(4) NULL,
  `create_time` VARCHAR(20) NULL,
  `radio_type` TINYINT(4) NULL,
  `ble_mode` TINYINT(4) NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `ucon_generic`.`brand`
CHANGE COLUMN `category_id` `category_id` INT(11) NOT NULL ;

CREATE TABLE `ucon_remote`.`brand` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(32) NULL,
  `category_id` INT NULL,
  `category_name` VARCHAR(32) NULL,
  `status` TINYINT(4) NULL,
  `create_time` VARCHAR(20) NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `ucon_remote`.`city` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(10) NULL,
  `name` VARCHAR(16) NULL,
  `longitude` DOUBLE NULL,
  `latitude` DOUBLE NULL,
  `status` TINYINT(4) NULL,
  PRIMARY KEY (`id`));

  CREATE TABLE `ucon_remote`.`stb_operator` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `operator_id` VARCHAR(16) NULL,
    `operator_name` VARCHAR(32) NULL,
    `city_code` VARCHAR(10) NULL,
    `city_name` VARCHAR(16) NULL,
    `status` TINYINT(4) NULL,
    PRIMARY KEY (`id`));

CREATE TABLE `ucon_remote`.`remote_index` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category_id` INT(11) NULL,
  `category_name` VARCHAR(32) NULL,
  `brand_id` INT(11) NULL,
  `brand_name` VARCHAR(32) NULL,
  `city_code` VARCHAR(10) NULL,
  `city_name` VARCHAR(32) NULL,
  `operator_id` INT(11) NULL,
  `operator_name` VARCHAR(32) NULL,
  `protocol` VARCHAR(64) NULL,
  `remote` VARCHAR(64) NULL,
  `remote_map` VARCHAR(64) NULL,
  `radio_type` TINYINT(4) NULL,
  `ble_mode` TINYINT(4) NULL,
  `status` TINYINT(4) NULL,
  `sub_cate` TINYINT(4) NULL,
  `priority` INT(11) NULL,
  PRIMARY KEY (`id`));

