/**
 * Created by kardi on 15.04.2016.
 */

var sql = require('sql');


sql.setDialect('postgres');

module.exports = {
    users: sql.define({
        name: 'users',
        columns: [
            'id',
            'first_name',
            'last_name',
            'middle_name',
            'email',
            'token',
            'created_at',
            'updated_at',
            'avatar_url',
            'vk_uid',
            'facebook_uid',
            'google_uid',
            'show_to_friends',
            'notify_in_browser',
            'blurred_image_url',
            'local_avatar_filename',
            'gender',
            'avatar_url_max'
        ]
    }),
    vk_posts: sql.define({
        name: 'vk_posts',
        columns: [
            'id',
            'creator_id',
            'event_id',
            'image_path',
            'message',
            'group_id'
        ]
    }),
    users_interests: sql.define({
        name: 'users_interests',
        columns: [
            'id',
            'user_id',
            'city',
            'education_university',
            'education_university_name',
            'education_faculty',
            'education_faculty_name',
            'education_graduation',
            'occupation_id',
            'occupation_name',
            'relation',
            'personal_political',
            'personal_smoking',
            'personal_alcohol',
            'interests',
            'movies',
            'tv',
            'books',
            'games',
            'network_type',
            'about'
        ]
    }),
    users_interests_aggregated: sql.define({
        name: 'users_interests_aggregated',
        columns: [
            'user_id',
            'aggregated_text',
            'aggregated_tsquery'
        ]
    }),
    vk_groups: sql.define({
        name: 'vk_groups',
        columns: [
            'id',
            'gid',
            'name',
            'screen_name',
            'description',
            'photo'
        ]
    }),
    vk_users_subscriptions: sql.define({
        name: 'vk_users_subscriptions',
        columns: [
            'id',
            'user_id',
            'vk_group_id'
        ]
    }),
    vk_sign_in: sql.define({
        name: 'vk_sign_in',
        columns: [
            'id',
            'user_id',
            'uid',
            'access_token',
            'expires_in',
            'secret',
            'created_at',
            'updated_at',
            'photo_50',
            'photo_100',
            'photo_max_orig'
        ]
    }),
    google_sign_in: sql.define({
        name: 'google_sign_in',
        columns: [
            'id',
            'user_id',
            'google_id',
            'access_token',
            'expires_in',
            'etag',
            'created_at',
            'updated_at',
            'cover_photo_url'
        ]
    }),
    tokens: sql.define({
        name: 'tokens',
        columns: [
            'id',
            'user_id',
            'token',
            'created_at',
            'updated_at',
            'token_type',
            'expires_on',
            'device_token',
            'client_type',
            'device_name'
        ]
    }),
    facebook_sign_in: sql.define({
        name: 'facebook_sign_in',
        columns: [
            'id',
            'user_id',
            'uid',
            'access_token',
            'expires_in',
            'created_at',
            'updated_at'
        ]
    }),
    organizations: sql.define({
        name: 'organizations',
        columns: [
            'id',
            'img_url',
            'background_img_url',
            'background_medium_img_url',
            'background_small_img_url',
            'img_medium_url',
            'img_small_url'
        ]
    }),
    stat_notifications: sql.define({
        name: 'stat_notifications',
        columns: [
            'id',
            'event_notification_id',
            'token_id',
            'description',
            'created_at',
            'updated_at',
            'click_time',
            'message_id',
            'received'
        ]
    }),
    stat_users_notifications: sql.define({
        name: 'stat_users_notifications',
        columns: [
            'id',
            'user_notification_id',
            'token_id',
            'description',
            'created_at',
            'updated_at',
            'click_time',
            'received',
            'message_id'
        ]
    }),
    view_notifications: sql.define({
        name: 'view_notifications',
        columns: [
            'uuid',
            'user_id',
            'event_id',
            'notification_time',
            'status',
            'notification_type_id',
            'notification_type',
            'done',
            'sent_time',
            'created_at',
            'updated_at'
        ]
    }),
    view_users_notifications_devices: sql.define({
        name: 'view_users_notifications_devices',
        columns: [
            'id',
            'token',
            'user_id',
            'created_at',
            'updated_at',
            'token_type',
            'expires_on',
            'device_token',
            'client_type',
            'device_name',
            'refresh_token',
            'uuid',
            'user_notification_id',
            'notify_in_browser'
        ]
    }),
    users_notifications: sql.define({
        name: 'users_notifications',
        columns: [
            'id',
            'user_id',
            'event_id',
            'notification_type_id',
            'created_at',
            'updated_at',
            'notification_time',
            'status',
            'done',
            'sent_time',
            'uuid'
        ]
    }),
    view_users_notifications: sql.define({
        name: 'view_users_notifications',
        columns: [
            'id',
            'user_id',
            'event_id',
            'created_at',
            'updated_at',
            'notification_time',
            'status',
            'done',
            'sent_time',
            'uuid',
            'notification_type_id',
            'organization_id',
            'title',
            'short_name',
            'notification_suffix',
            'image_square_vertical_url',
            'image_square_horizontal_url',
            'notification_type_name',
            'notification_type_text'
        ]
    }),
    view_auto_notifications: sql.define({
        name: 'view_auto_notifications',
        columns: [
            'id',
            'event_id',
            'notification_type_id',
            'notification_time',
            'created_at',
            'updated_at',
            'status',
            'done',
            'new_status',
            'new_done',
            'organization_id',
            'title',
            'short_name',
            'notification_suffix',
            'image_square_vertical_url',
            'image_square_horizontal_url',
            'notification_type_name',
            'notification_type_text'
        ]
    }),
    view_auto_favored_devices: sql.define({
        name: 'view_auto_favored_devices',
        columns: [
            'id',
            'token',
            'user_id',
            'created_at',
            'updated_at',
            'token_type',
            'expires_on',
            'device_token',
            'client_type',
            'device_name',
            'refresh_token',
            'uuid',
            'event_id',
            'notify_in_browser'
        ]
    }),
    subscriptions: sql.define({
        name: 'subscriptions',
        columns: [
            'id',
            'user_id',
            'organization_id',
            'status'
        ]
    }),
    events_notifications: sql.define({
        name: 'events_notifications',
        columns: [
            'id',
            'event_id',
            'notification_type_id',
            'notification_time',
            'created_at',
            'updated_at',
            'status',
            'done'
        ]
    }),
    view_auto_notifications_devices: sql.define({
        name: 'view_auto_notifications_devices',
        columns: [
            'id',
            'token',
            'user_id',
            'created_at',
            'updated_at',
            'token_type',
            'expires_on',
            'device_token',
            'client_type',
            'device_name',
            'refresh_token',
            'organization_id',
            'uuid',
            'notify_in_browser'
        ]
    }),
    view_events: sql.define({
        name: 'view_events',
        columns: [
            'id',
            'title',
            'creator_id',
            'description',
            'detail_info_url',
            'begin_time',
            'end_time',
            'latitude',
            'longitude',
            'location',
            'min_price',
            'public_at',
            'registration_required',
            'registration_till',
            'is_free',
            'is_same_time',
            'organization_id',
            'link',
            'status',
            'image_vertical_url',
            'image_horizontal_url',
            'image_vertical_large_url',
            'image_horizontal_large_url',
            'image_square_vertical_url',
            'image_square_horizontal_url',
            'image_horizontal_medium_url',
            'image_vertical_medium_url',
            'image_vertical_small_url',
            'image_horizontal_small_url',
            'vk_image_url',
            'organization_logo_medium_url',
            'organization_logo_large_url',
            'organization_logo_small_url',
            'organization_name',
            'organization_type_name',
            'organization_short_name',
            'nearest_event_date',
            'first_event_date',
            'last_event_date',
            'created_at',
            'updated_at',
            'favored_users_count'
        ]
    }),
    events: sql.define({
        name: 'events',
        columns: [
            'id',
            'creator_id',
            'organization_id',
            'title',
            'description',
            'location',
            'location_uri',
            'event_start_date',
            'event_type_id',
            'notifications_schema_json',
            'created_at',
            'updated_at',
            'latitude',
            'longitude',
            'event_end_date',
            'image_vertical',
            'detail_info_url',
            'begin_time',
            'end_time',
            'image_horizontal',
            'location_object',
            'dates_range',
            'images_domain',
            'status',
            'fts',
            'registration_required',
            'registration_till',
            'image_vertical_resized',
            'image_horizontal_resized',
            'public_at',
            'location_updates',
            'is_free'
        ]
    })
};