ALTER TABLE `ucon_generic`.`remote_index`
ADD COLUMN `priority` INT(11) NULL COMMENT '' AFTER `sub_cate`;

ALTER TABLE `ucon_remote`.`remote_index`
ADD COLUMN `priority` INT(11) NULL COMMENT '' AFTER `sub_cate`;

UPDATE `ucon_generic`.`remote_index` SET `priority` = 999;