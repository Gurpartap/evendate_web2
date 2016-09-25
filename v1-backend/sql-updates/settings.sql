CREATE TYPE private_mode AS ENUM('public', 'only_friends', 'private');

ALTER TABLE users ADD COLUMN send_notifications BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN send_notifications_for_favored BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN send_notifications_for_subscriptions BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN send_notifications_new_organizations BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN send_notifications_for_friends BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN privacy_mode private_mode DEFAULT 'public';