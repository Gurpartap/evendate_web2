CREATE TABLE users
(
  id BIGINT PRIMARY KEY NOT NULL,
  first_name TEXT,
  last_name TEXT,
  middle_name TEXT,
  email VARCHAR(255),
  token TEXT,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP,
  avatar_url TEXT,
  vk_uid VARCHAR(50),
  facebook_uid VARCHAR(50),
  google_uid VARCHAR(50),
  show_to_friends SMALLINT DEFAULT 1,
  notify_in_browser SMALLINT,
  blurred_image_url TEXT,
  gender VARCHAR(50) DEFAULT NULL::character varying,
  avatar_url_max TEXT,
  local_avatar_filename TEXT
);
CREATE UNIQUE INDEX public_users_vk_uid1_idx ON users (vk_uid);
CREATE UNIQUE INDEX public_users_facebook_uid2_idx ON users (facebook_uid);
CREATE UNIQUE INDEX public_users_google_uid3_idx ON users (google_uid);


CREATE TYPE private_mode AS ENUM('public', 'only_friends', 'private');

ALTER TABLE users ADD COLUMN send_notifications BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN send_notifications_for_favored BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN send_notifications_for_subscriptions BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN send_notifications_new_organizations BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN send_notifications_for_friends BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN privacy_mode private_mode DEFAULT 'public';