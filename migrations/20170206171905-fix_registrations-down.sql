ALTER TABLE users_registrations DROP COLUMN organization_approvement_status_id;

DROP TABLE organization_approvement_statuses;

DROP TABLE ticket_types CASCADE;