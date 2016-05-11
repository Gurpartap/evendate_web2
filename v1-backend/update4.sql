INSERT INTO notification_types(id, type, timediff, text)
    VALUES(14, 'notification-one-day-registration-close', -1, 'Остался один день до конца регистрации на {title}');

CREATE TABLE vk_groups(
    id                SERIAL PRIMARY KEY NOT NULL,
    gid INT NOT NULL UNIQUE,
    name TEXT,
    screen_name VARCHAR(255),
    description TEXT,
    photo TEXT
);


CREATE TABLE vk_users_subscriptions(
    id                SERIAL PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    vk_group_id INT NOT NULL,
    FOREIGN KEY (vk_group_id) REFERENCES vk_groups(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE (user_id, vk_group_id)
);

DROP VIEW view_organizations CASCADE;

/*VIEW*/
CREATE OR REPLACE VIEW view_organizations AS
    SELECT DISTINCT
        organizations.id :: INT,
        organizations.description,
        organizations.id :: INT                                                AS oid,
        organizations.images_domain || 'organizations_images/backgrounds/medium/' || organizations.background_medium_img_url AS background_medium_img_url,
        organizations.images_domain || 'organizations_images/backgrounds/small/' || organizations.background_small_img_url  AS background_small_img_url,
        organizations.images_domain || 'organizations_images/logos/medium/' || organizations.img_medium_url            AS img_medium_url,
        organizations.images_domain || 'organizations_images/logos/small/' || organizations.img_small_url             AS img_small_url,
        organizations.site_url,
        organizations.name,
        organizations.type_id :: INT,
        organizations.images_domain || 'organizations_images/logos/large/' || organizations.img_url                   AS img_url,
        organizations.images_domain || 'organizations_images/backgrounds/large/' || organizations.background_img_url        AS background_img_url,
        TRUE                                                                   AS status,
        organizations.short_name,
        organization_types.name                                                AS type_name,
        organizations.default_address,
        organization_types."order" :: INT                                      AS organization_type_order,
        organization_types."id" :: INT                                         AS organization_type_id,
        DATE_PART(
            'epoch',
            organizations.updated_at) :: INT                                   AS updated_at,
        DATE_PART(
            'epoch',
            organizations.created_at) :: INT                                   AS created_at,
        (
            SELECT COUNT(
                       id) :: INT AS subscribed_count
            FROM
                subscriptions
            WHERE
                subscriptions.status
                =
                TRUE
                AND
                subscriptions.organization_id
                =
                organizations.id
        )                                                                      AS subscribed_count,

        organizations.vk_url_path,
        organizations.facebook_url_path
    FROM organizations
        INNER JOIN organization_types ON organization_types.id = organizations.type_id AND organizations.status = TRUE
    WHERE organizations.status = TRUE;