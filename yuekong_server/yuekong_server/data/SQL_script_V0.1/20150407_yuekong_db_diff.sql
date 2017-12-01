ALTER TABLE `yuekong_db`.`category`
ADD COLUMN `radio_type` TINYINT(4) NULL AFTER `create_time`,
ADD COLUMN `ble_mode` TINYINT(4) NULL AFTER `radio_type`;

ALTER TABLE `yuekong_db`.`remote_index`
ADD COLUMN `radio_type` TINYINT(4) NULL AFTER `remote_map`,
ADD COLUMN `ble_mode` TINYINT(4) NULL AFTER `radio_type`;

UPDATE `yuekong_db`.`category` SET `radio_type`='0', `ble_mode`='0' WHERE `id`<>'9';
UPDATE `yuekong_db`.`category` SET `radio_type`='1', `ble_mode`='0' WHERE `id`='9';

UPDATE `yuekong_db`.`remote_index` SET `radio_type`='0', `ble_mode`='0' WHERE `category_id`<>'9';
UPDATE `yuekong_db`.`remote_index` SET `radio_type`='1', `ble_mode`='0' WHERE `category_id`='9';