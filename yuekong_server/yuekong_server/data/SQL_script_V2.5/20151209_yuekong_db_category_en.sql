ALTER TABLE ucon_generic.category ADD name_en VARCHAR(32) NULL;

UPDATE `ucon_generic`.`category` SET `name_en`='AC' WHERE `id`='1';
UPDATE `ucon_generic`.`category` SET `name_en`='TV' WHERE `id`='2';
UPDATE `ucon_generic`.`category` SET `name_en`='STB' WHERE `id`='3';
UPDATE `ucon_generic`.`category` SET `name_en`='BOX' WHERE `id`='4';
UPDATE `ucon_generic`.`category` SET `name_en`='IPTV' WHERE `id`='5';
UPDATE `ucon_generic`.`category` SET `name_en`='DVD' WHERE `id`='6';
UPDATE `ucon_generic`.`category` SET `name_en`='FAN' WHERE `id`='7';
UPDATE `ucon_generic`.`category` SET `name_en`='AIR CLEANER' WHERE `id`='8';
UPDATE `ucon_generic`.`category` SET `name_en`='PRO' WHERE `id`='9';
UPDATE `ucon_generic`.`category` SET `name_en`='BLUETOOTH' WHERE `id`='10';
UPDATE `ucon_generic`.`category` SET `name_en`='WIFI' WHERE `id`='11';
