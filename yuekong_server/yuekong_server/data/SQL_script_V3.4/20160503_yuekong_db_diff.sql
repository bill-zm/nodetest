CREATE TABLE `ucon_generic`.`notification` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `message_id` INT(11) NULL COMMENT '',
  `message_content` TEXT NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '');

INSERT INTO `ucon_generic`.`notification` (`message_id`, `message_content`) VALUES ('1', '您的UCON底座已经成功升级到最新版本');
INSERT INTO `ucon_generic`.`notification` (`message_id`, `message_content`) VALUES ('2', '您的UCON遥控器已经成功升级到最新版本');
INSERT INTO `ucon_generic`.`notification` (`message_id`, `message_content`) VALUES ('3', '您的预约已经执行成功');
