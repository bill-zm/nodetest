use `ucon_generic`;

CREATE TABLE `room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `user_id` varchar(32) DEFAULT NULL,
  `mobile_id` varchar(32) DEFAULT NULL,
  `room_type` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `ucon_generic`.`room`
ADD COLUMN `status` TINYINT(4) NULL COMMENT '' AFTER `room_type`,
ADD COLUMN `update_time` CHAR(20) NULL COMMENT '' AFTER `status`;