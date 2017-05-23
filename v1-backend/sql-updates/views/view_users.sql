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
