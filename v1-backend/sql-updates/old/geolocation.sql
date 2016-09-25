UPDATE events SET longitude = NULL, latitude = NULL;

ALTER TABLE events ADD COLUMN location_updates INT NULL DEFAULT NULL;