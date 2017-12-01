ALTER TABLE `ucon_generic`.`mobile`
ADD COLUMN `longitude` DOUBLE NULL COMMENT '' AFTER `update_time`,
ADD COLUMN `latitude` DOUBLE NULL COMMENT '' AFTER `longitude`;
