
ALTER TABLE events DROP COLUMN registration_locally;
ALTER TABLE events DROP COLUMN registration_limit_count;
ALTER TABLE events DROP COLUMN registration_approvement_required;

DROP TABLE registration_form_fields CASCADE ;
DROP TABLE users_registrations CASCADE ;
DROP TABLE registration_info CASCADE ;
DROP TABLE registration_field_types CASCADE ;
