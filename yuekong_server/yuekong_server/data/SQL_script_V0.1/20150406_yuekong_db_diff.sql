# you must handle the following 2 SQLs manually
INSERT INTO `yuekong_db`.`category`(name, status, create_time) VALUES ('蓝牙设备', '1', '2015-04-06 10:00:00');
INSERT INTO `yuekong_db`.`brand`(name, category_id, category_name, status, create_time) VALUES ('YeeLight', '5', '蓝牙设备', '1', '2015-04-06 10:00:00');
INSERT INTO `yuekong_db`.`category`(name, status, create_time) VALUES ('WIFI设备', '1', '2015-04-06 10:00:00');
INSERT INTO `yuekong_db`.`remote_index`(category_id, category_name, brand_id, brand_name, protocol, remote, remote_map, status) VALUES ('5', '蓝牙设备', '32', 'YeeLight', 'ble_central', 'yeelight', 'yeelight', 1);