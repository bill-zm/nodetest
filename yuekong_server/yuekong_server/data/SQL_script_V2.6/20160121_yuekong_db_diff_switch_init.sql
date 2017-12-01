use `ucon_generic`;

CREATE TABLE `ucon_generic`.`switch` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `uda_switch` TINYINT(4) NULL COMMENT '',
  `oad_switch` TINYINT(4) NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '');

INSERT INTO `ucon_generic`.`switch` (`uda_switch`, `oad_switch`) VALUES ('1', '1');
