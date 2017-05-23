ALTER TABLE tokens ADD COLUMN "model" TEXT DEFAULT NULL;
ALTER TABLE tokens ADD COLUMN "os_version" TEXT DEFAULT NULL;

DROP VIEW view_users;

CREATE VIEW view_users AS
  SELECT
    users.id,
    users.local_avatar_filename,
    (CASE
     WHEN users.local_avatar_filename IS NOT NULL
       THEN 'https://evendate.io/user_images/default/' || users.local_avatar_filename
     ELSE users.avatar_url
     END
    ) AS avatar_url,
    (CASE
     WHEN users.local_avatar_filename IS NOT NULL
       THEN 'https://evendate.io/user_images/blurred/' || users.local_avatar_filename
     ELSE NULL
     END
    ) AS blurred_img_url,
    users.email,
    users.vk_uid,
    users.facebook_uid,
    users.google_uid,
    users.first_name,
    users.last_name,
    users.middle_name,
    users.gender,
    users.token,
    users.show_to_friends,
    users.blurred_image_url,
    users.avatar_url AS original_avatar_url
  FROM users;



CREATE TABLE stat_users
(
  id                   SERIAL PRIMARY KEY NOT NULL,
  user_id BIGINT NOT NULL,
  token_id BIGINT,
  stat_type_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP,
  FOREIGN KEY (token_id) REFERENCES tokens(id),
  FOREIGN KEY (stat_type_id) REFERENCES stat_event_types (id)
);

INSERT INTO stat_event_types(name, entity, type_code, created_at)
    VALUES ('Просмотр подписок пользователя', 'friend', 'view_subscriptions', NOW());

INSERT INTO stat_event_types(name, entity, type_code, created_at)
    VALUES ('Просмотр действий пользователя', 'friend', 'view_actions', NOW());

INSERT INTO stat_event_types(name, entity, type_code, created_at)
    VALUES ('Просмотр события из ленты пользователя', 'friend', 'view_event_from_user', NOW());


