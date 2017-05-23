CREATE TABLE events
(
  id BIGINT PRIMARY KEY NOT NULL,
  title TEXT,
  description TEXT,
  location TEXT,
  location_uri TEXT,
  event_start_date TIMESTAMP,
  notifications_schema_json TEXT,
  creator_id BIGINT NOT NULL,
  organization_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP,
  latitude REAL,
  longitude REAL,
  event_end_date TIMESTAMP,
  image_vertical VARCHAR(255),
  event_type_id BIGINT,
  detail_info_url TEXT,
  begin_time TIME,
  end_time TIME,
  image_horizontal VARCHAR(255),
  location_object TEXT,
  dates_range BOOLEAN DEFAULT false NOT NULL,
  images_domain VARCHAR(50) DEFAULT 'http://evendate.io/'::character varying,
  status BOOLEAN DEFAULT true NOT NULL,
  registration_required BOOLEAN DEFAULT false NOT NULL,
  registration_till TIMESTAMP,
  public_at TIMESTAMP,
  is_free BOOLEAN DEFAULT true NOT NULL,
  min_price INTEGER,
  new_status BOOLEAN DEFAULT true NOT NULL,
  image_vertical_resized TEXT,
  image_horizontal_resized TEXT,
  disabled BOOLEAN DEFAULT false NOT NULL,
  canceled BOOLEAN DEFAULT false NOT NULL,
  model TEXT,
  os_version TEXT,
  fts TSVECTOR,
  CONSTRAINT events_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES users (id),
  CONSTRAINT events_event_type_id_fkey FOREIGN KEY (event_type_id) REFERENCES event_types (id)
);
CREATE INDEX public_events_creator_id0_idx ON events (creator_id);
CREATE INDEX public_events_organization_id1_idx ON events (organization_id);
CREATE INDEX public_events_event_type_id2_idx ON events (event_type_id);
CREATE INDEX fts_index ON events (fts);

ALTER TABLE events ADD COLUMN location_updates INT NULL DEFAULT NULL;