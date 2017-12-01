ALTER TABLE `ucon_generic`.`subscription`
ADD COLUMN `remote_name` VARCHAR(16) NULL COMMENT '' AFTER `binary_version`;

UPDATE `ucon_generic`.`subscription` SET remote_name = '';