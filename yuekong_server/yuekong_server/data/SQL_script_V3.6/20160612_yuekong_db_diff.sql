ALTER TABLE `ucon_generic`.`remote_instance`
DROP COLUMN `room_name`,
DROP COLUMN `room_id`;

ALTER TABLE `ucon_generic`.`remote`
ADD COLUMN `room_id` INT(11) NULL COMMENT '' AFTER `sub_cate`,
ADD COLUMN `room_name` VARCHAR(20) NULL COMMENT '' AFTER `room_id`;

ALTER TABLE `ucon_generic`.`remote`
ADD COLUMN `sirius_id` VARCHAR(32) NULL COMMENT '' AFTER `room_name`;

ALTER TABLE `ucon_generic`.`remote`
CHANGE COLUMN `remote_instance_id` `remote_instance_id` INT(11) NULL DEFAULT 0 COMMENT '' ;
