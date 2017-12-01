use `ucon_generic`;

INSERT INTO remote_index_ii (category_id, category_name, brand_id, brand_name, protocol, remote, remote_map, radio_type, ble_mode, status, sub_cate, priority, applied_remote_version, applied_device_version, banned_remote_version, banned_device_version) VALUES ('4', '网络盒子', '27', '小米盒子', 'mibox-r8', 'remote_nw_xiaomi', 'ykir_mibox-r8_remote_nw_xiaomi', '0', '0', '1', '0', '10', 'V1.4.0', 'V1.4.0', 'V99.0.0', 'V99.0.0');

INSERT INTO remote_index_ii (category_id, category_name, brand_id, brand_name, protocol, remote, remote_map, radio_type, ble_mode, status, sub_cate, priority, applied_remote_version, applied_device_version, banned_remote_version, banned_device_version) VALUES ('4', '网络盒子', '27', '小米盒子', 'mibox-r6', 'remote_nw_xiaomi2', 'ykir_mibox-r6_remote_nw_xiaomi2', '0', '0', '1', '0', '1', 'V1.4.0', 'V1.4.0', 'V99.0.0', 'V99.0.0');

INSERT INTO remote_index_ii (category_id, category_name, brand_id, brand_name, protocol, remote, remote_map, radio_type, ble_mode, status, sub_cate, priority, applied_remote_version, applied_device_version, banned_remote_version, banned_device_version) VALUES ('4', '网络盒子', '27', '小米盒子', 'mibox-r3', 'remote_nw_xiaomi3', 'ykir_mibox-r3_remote_nw_xiaomi3', '0', '0', '1', '0', '5', 'V1.4.0', 'V1.4.0', 'V99.0.0', 'V99.0.0');

UPDATE brand SET name = 'Apple TV', priority = '0' WHERE id = 72;

UPDATE remote_index_ii SET priority = '30' WHERE brand_id = 72 AND priority = '10';