ALTER TABLE `ucon_generic`.`category`
CHANGE COLUMN `applied_version` `applied_android_version` VARCHAR(20) NULL DEFAULT NULL COMMENT '' ,
CHANGE COLUMN `banned_version` `banned_android_version` VARCHAR(20) NULL DEFAULT NULL COMMENT '' ,
ADD COLUMN `applied_ios_version` VARCHAR(20) NULL COMMENT '' AFTER `banned_android_version`,
ADD COLUMN `banned_ios_version` VARCHAR(20) NULL COMMENT '' AFTER `applied_ios_version`;

UPDATE `ucon_generic`.`category` SET `applied_ios_version`='V1.0.0', `banned_ios_version`='V99.0.0' WHERE `id`='1';
UPDATE `ucon_generic`.`category` SET `applied_ios_version`='V1.0.0', `banned_ios_version`='V99.0.0' WHERE `id`='2';
UPDATE `ucon_generic`.`category` SET `applied_ios_version`='V1.0.0', `banned_ios_version`='V99.0.0' WHERE `id`='3';
UPDATE `ucon_generic`.`category` SET `applied_ios_version`='V1.0.0', `banned_ios_version`='V99.0.0' WHERE `id`='4';
UPDATE `ucon_generic`.`category` SET `applied_ios_version`='V1.5.3', `banned_ios_version`='V99.0.0' WHERE `id`='5';
UPDATE `ucon_generic`.`category` SET `applied_ios_version`='V2.0.1', `banned_ios_version`='V99.0.0' WHERE `id`='6';
UPDATE `ucon_generic`.`category` SET `applied_ios_version`='V1.8.5', `banned_ios_version`='V99.0.0' WHERE `id`='7';
UPDATE `ucon_generic`.`category` SET `applied_ios_version`='V1.8.5', `banned_ios_version`='V99.0.0' WHERE `id`='8';
UPDATE `ucon_generic`.`category` SET `applied_ios_version`='V1.8.5', `banned_ios_version`='V99.0.0' WHERE `id`='9';
UPDATE `ucon_generic`.`category` SET `applied_android_version`='V2.5.0', `applied_ios_version`='V2.5.0', `banned_ios_version`='V99.0.0' WHERE `id`='10';
UPDATE `ucon_generic`.`category` SET `applied_ios_version`='V99.0.0', `banned_ios_version`='V99.0.0' WHERE `id`='11';
