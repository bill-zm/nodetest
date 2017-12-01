INSERT INTO `ucon_generic`.`room` (`name`, `user_id`, `mobile_id`, `room_type`, `status`, `update_time`) VALUES ('客厅', '0', '0', '0', '1', '2016-06-07 08:00:00');
INSERT INTO `ucon_generic`.`room` (`name`, `user_id`, `mobile_id`, `room_type`, `status`, `update_time`) VALUES ('主卧室', '0', '0', '0', '1', '2016-06-07 08:00:00');
INSERT INTO `ucon_generic`.`room` (`name`, `user_id`, `mobile_id`, `room_type`, `status`, `update_time`) VALUES ('客卧室', '0', '0', '0', '1', '2016-06-07 08:00:00');
INSERT INTO `ucon_generic`.`room` (`name`, `user_id`, `mobile_id`, `room_type`, `status`, `update_time`) VALUES ('餐厅', '0', '0', '0', '1', '2016-06-07 08:00:00');
INSERT INTO `ucon_generic`.`room` (`name`, `user_id`, `mobile_id`, `room_type`, `status`, `update_time`) VALUES ('书房', '0', '0', '0', '1', '2016-06-07 08:00:00');
INSERT INTO `ucon_generic`.`room` (`name`, `user_id`, `mobile_id`, `room_type`, `status`, `update_time`) VALUES ('卫生间', '0', '0', '0', '1', '2016-06-07 08:00:00');
INSERT INTO `ucon_generic`.`room` (`name`, `user_id`, `mobile_id`, `room_type`, `status`, `update_time`) VALUES ('厨房', '0', '0', '0', '1', '2016-06-07 08:00:00');

ALTER TABLE `ucon_generic`.`remote_instance`
ADD COLUMN `room_id` INT(11) NULL COMMENT '' AFTER `version`,
ADD COLUMN `room_name` VARCHAR(20) NULL COMMENT '' AFTER `room_id`;

ALTER TABLE `ucon_generic`.`remote`
CHANGE COLUMN `rsn` `rsn` VARCHAR(32) NULL COMMENT '' ;
