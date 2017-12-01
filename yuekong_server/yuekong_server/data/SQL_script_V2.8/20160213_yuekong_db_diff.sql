ALTER TABLE `ucon_generic`.`remote_index_ii`
ADD COLUMN `binary_md5` CHAR(32) NULL COMMENT '' AFTER `city_name_tw`;

UPDATE `ucon_generic`.`category` SET `name_en`='PROJECTOR', `name_tw`='投影儀' WHERE `id`='8';
UPDATE `ucon_generic`.`category` SET `name_en`='STEREO' WHERE `id`='9';
UPDATE `ucon_generic`.`category` SET `name_tw`='WIFI設備' WHERE `id`='11';

INSERT INTO `ucon_generic`.`ir_protocol` (`name`, `status`) VALUES ('dvb_pan_7051_samsung', '1');

