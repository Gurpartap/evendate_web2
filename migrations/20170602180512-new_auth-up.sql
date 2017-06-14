ALTER TABLE users ADD UNIQUE (vk_uid);

DROP INDEX public_facebook_sign_in_uid0_idx;
DROP INDEX public_vk_sign_in_uid0_idx;
DROP INDEX public_google_sign_in_google_id0_idx;

ALTER TABLE vk_posts ADD COLUMN post_id INTEGER;