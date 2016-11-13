DROP TABLE recommendations_organizations;
DROP TABLE recommendations_events;
ALTER TABLE users_interests DROP COLUMN interests_tsquery;


DROP VIEW view_users_organizations;
DROP VIEW view_users_events;
