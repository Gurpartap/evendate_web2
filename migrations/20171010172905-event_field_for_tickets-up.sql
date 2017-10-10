ALTER TABLE stat_users_notifications
    ADD COLUMN push_response TEXT DEFAULT NULL;

ALTER TABLE stat_notifications
    ADD COLUMN push_response TEXT DEFAULT NULL;

ALTER TABLE stat_notifications_recommendations
    ADD COLUMN push_response TEXT DEFAULT NULL;

