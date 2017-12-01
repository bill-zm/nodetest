CREATE TABLE `ucon_generic`.`remote_relationship` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `remote_id` INT NULL,
  `remote_map` VARCHAR(64) NULL,
  `related_remote_id` INT NULL,
  `related_remote_map` VARCHAR(64) NULL,
  PRIMARY KEY (`id`));
