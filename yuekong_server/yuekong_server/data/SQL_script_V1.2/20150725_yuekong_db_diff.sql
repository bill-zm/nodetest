ALTER TABLE `ucon_generic`.`device`
ADD COLUMN `ssid` VARCHAR(32) NULL AFTER `com_version`,
ADD COLUMN `password` VARCHAR(24) NULL AFTER `ssid`;
