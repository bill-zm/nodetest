use `ucon_generic`;

CREATE TABLE `ucon_generic`.`admin` (
  `id` INT NOT NULL AUTO_INCREMENT COMMENT '',
  `user_name` VARCHAR(64) NOT NULL COMMENT '',
  `password` VARCHAR(32) NULL COMMENT '',
  PRIMARY KEY (`id`)  COMMENT '');

INSERT INTO `ucon_generic`.`admin` (`user_name`, `password`) VALUES ('strawmanbobi@yuekong.com.cn', '8654CC19DF98DEBB2E8BAA4034C59C27');
INSERT INTO `ucon_generic`.`admin` (`user_name`, `password`) VALUES ('zhangengui@yuekong.com.cn', '25D55AD283AA400AF464C76D713C07AD');
INSERT INTO `ucon_generic`.`admin` (`user_name`, `password`) VALUES ('xiang@yuekong.com.cn', '25D55AD283AA400AF464C76D713C07AD');
