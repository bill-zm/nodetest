use `ucon_generic`;

CREATE TABLE `update_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `src_remote_version` varchar(20) DEFAULT NULL,
  `dest_remote_version` varchar(20) DEFAULT NULL,
  `remote_update_status` tinyint(4) DEFAULT NULL,
  `src_device_version` varchar(20) DEFAULT NULL,
  `dest_device_version` varchar(20) DEFAULT NULL,
  `device_update_status` tinyint(4) DEFAULT NULL,
  `updater_id` varchar(32) DEFAULT NULL,
  `updater_type` tinyint(4) DEFAULT NULL,
  `target_pdsn` varchar(16) DEFAULT NULL,
  `update_time` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

ALTER TABLE `ucon_generic`.`update_record`
CHANGE COLUMN `target_pdsn` `target_identifier` VARCHAR(64) NULL DEFAULT NULL COMMENT '' ;


