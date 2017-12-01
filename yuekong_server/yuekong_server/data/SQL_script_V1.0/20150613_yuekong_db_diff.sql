ALTER TABLE `ucon_generic`.`subscription`
CHANGE COLUMN `pure_kies` `pure_keys` VARCHAR(1024) NULL DEFAULT NULL ;

ALTER TABLE `ucon_generic`.`remote_index`
ADD COLUMN `sub_cate` TINYINT(4) NULL AFTER `status`;

update `ucon_generic`.`remote_index` set sub_cate = '0';

#set some AC remote of NEC code deprecated
update `ucon_generic`.`remote_index` set status = '0' where remote_map like '%remote_ac_aux_nec6122%';
update `ucon_generic`.`remote_index` set status = '0' where remote_map like '%remote_ac_chunlan_nec6122%';
update `ucon_generic`.`remote_index` set status = '0' where remote_map like '%remote_ac_geli_m50560%';
update `ucon_generic`.`remote_index` set status = '0' where remote_map like '%remote_ac_geli_nec6122%';
update `ucon_generic`.`remote_index` set status = '0' where remote_map like '%remote_ac_haier_nec6122%';
update `ucon_generic`.`remote_index` set status = '0' where remote_map like '%remote_ac_kelong_nec6122%';
update `ucon_generic`.`remote_index` set status = '0' where remote_map like '%remote_ac_meidi1_nec6122%';
update `ucon_generic`.`remote_index` set status = '0' where remote_map like '%remote_ac_meidi2_nec6122%';
update `ucon_generic`.`remote_index` set status = '0' where remote_map like '%remote_ac_meidi3_nec6122%';

#set some AC remote of NEC code sub_cate = 1
update `ucon_generic`.`remote_index` set sub_cate = '1' where remote_map like '%remote_ac_kelong1_nec6122%';
update `ucon_generic`.`remote_index` set sub_cate = '1' where remote_map like '%remote_ac_zhigao_nec6122%';