ALTER TABLE `ucon_generic`.`subscription`
ADD COLUMN `ble_tag104` TINYINT(4) NULL COMMENT '' AFTER `remote_status`,
ADD COLUMN `ble_target_mac` VARCHAR(16) NULL COMMENT '' AFTER `ble_tag104`,
ADD COLUMN `ble_target_name` VARCHAR(32) NULL COMMENT '' AFTER `ble_target_mac`;

ALTER TABLE `ucon_generic`.`remote_index_ii`
ADD COLUMN `ble_remote_index` TEXT NULL COMMENT '' AFTER `binary_md5`;

