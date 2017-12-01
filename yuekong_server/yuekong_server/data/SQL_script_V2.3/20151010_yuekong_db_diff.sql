ALTER TABLE `ucon_generic`.`category`
ADD COLUMN `applied_version` VARCHAR(20) NULL COMMENT '' AFTER `ble_mode`,
ADD COLUMN `banned_version` VARCHAR(20) NULL COMMENT '' AFTER `applied_version`;

UPDATE `ucon_generic`.`category` SET `applied_version`='V1.0.0', `banned_version`='V99.0.0' WHERE `id`='1';
UPDATE `ucon_generic`.`category` SET `applied_version`='V1.0.0', `banned_version`='V99.0.0' WHERE `id`='2';
UPDATE `ucon_generic`.`category` SET `applied_version`='V1.0.0', `banned_version`='V99.0.0' WHERE `id`='3';
UPDATE `ucon_generic`.`category` SET `applied_version`='V1.0.0', `banned_version`='V99.0.0' WHERE `id`='4';
UPDATE `ucon_generic`.`category` SET `applied_version`='V1.5.3', `banned_version`='V99.0.0' WHERE `id`='5';
UPDATE `ucon_generic`.`category` SET `applied_version`='V99.0.0', `banned_version`='V99.0.0' WHERE `id`='6';
UPDATE `ucon_generic`.`category` SET `applied_version`='V99.0.0', `banned_version`='V99.0.0' WHERE `id`='7';
UPDATE `ucon_generic`.`category` SET `applied_version`='V99.0.0', `banned_version`='V99.0.0' WHERE `id`='8';
UPDATE `ucon_generic`.`category` SET `applied_version`='V99.0.0', `banned_version`='V99.0.0' WHERE `id`='9';
UPDATE `ucon_generic`.`category` SET `applied_version`='V99.0.0', `banned_version`='V99.0.0' WHERE `id`='10';
UPDATE `ucon_generic`.`category` SET `applied_version`='V99.0.0', `banned_version`='V99.0.0' WHERE `id`='11';
