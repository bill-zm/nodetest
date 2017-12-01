ALTER TABLE `ucon_generic`.`notification`
ADD COLUMN `badge` TINYINT(4) NULL COMMENT '' AFTER `message_content`,
ADD COLUMN `silent` TINYINT(4) NULL COMMENT '' AFTER `badge`,
ADD COLUMN `sound` VARCHAR(16) NULL COMMENT '' AFTER `silent`,
ADD COLUMN `title` VARCHAR(32) NULL COMMENT '' AFTER `sound`,
ADD COLUMN `custom` TEXT NULL COMMENT '' AFTER `title`;

UPDATE `ucon_generic`.`notification` SET `badge`='1', `silent`='0', `sound`='', `title`='', `custom`='{\"type\":\"1\"}' WHERE `id`='1';
UPDATE `ucon_generic`.`notification` SET `badge`='1', `silent`='0', `sound`='', `title`='', `custom`='{\"type\":\"2\"}' WHERE `id`='2';
UPDATE `ucon_generic`.`notification` SET `badge`='1', `silent`='0', `sound`='', `title`='', `custom`='{\"type\":\"0\"}' WHERE `id`='3';
