use `ucon_generic`;

UPDATE `remote` SET binary_version = 1;

UPDATE `subscription` SET binary_version = 1;

DELETE FROM remote_index_ii WHERE category_id = 1 AND protocol <> 'new_ac';