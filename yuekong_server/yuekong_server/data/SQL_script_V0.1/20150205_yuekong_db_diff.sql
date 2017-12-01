UPDATE `yuekong_db`.`remote_index` SET `remote`='remote_ac_changhong4_sanling1', `remote_map`='remote_ac_changhong4_sanling1' WHERE `id`='605';

ALTER TABLE `yuekong_db`.`city` 
ADD COLUMN `status` TINYINT NULL DEFAULT 0 AFTER `latitude`;

UPDATE `yuekong_db`.`city` SET status='1' WHERE code in ('110100', '120100', '310100', '320100', '330100', '420100', '440100', '440300', '500100', '510100', '610100');
