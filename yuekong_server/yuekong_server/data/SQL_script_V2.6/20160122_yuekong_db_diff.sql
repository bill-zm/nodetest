use `ucon_generic`;

ALTER TABLE `ucon_generic`.`switch`
ADD COLUMN `target_device` TINYINT(4) NULL COMMENT '' AFTER `oad_switch`;

UPDATE `ucon_generic`.`switch` SET `target_device`='0' WHERE `id`='1';
INSERT INTO `ucon_generic`.`switch` (`uda_switch`, `oad_switch`, `target_device`) VALUES ('1', '1', '1');
INSERT INTO `ucon_generic`.`switch` (`uda_switch`, `oad_switch`, `target_device`) VALUES ('1', '1', '2');
