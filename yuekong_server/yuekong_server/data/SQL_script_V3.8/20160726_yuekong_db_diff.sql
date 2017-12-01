ALTER TABLE `ucon_generic`.`remote`
ADD COLUMN `operator_id` VARCHAR(16) NULL AFTER `city_code`;

ALTER TABLE `ucon_generic`.`remote`
ADD COLUMN `protocol` VARCHAR(64) NULL AFTER `sirius_id`,
ADD COLUMN `remote` VARCHAR(64) NULL AFTER `protocol`,
ADD COLUMN `remote_map` VARCHAR(128) NULL AFTER `remote`;