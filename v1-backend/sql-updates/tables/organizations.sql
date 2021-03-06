CREATE TABLE organizations
(
  id SERIAL PRIMARY KEY NOT NULL,
  name TEXT,
  type_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP,
  img_url TEXT,
  description VARCHAR(600),
  short_name VARCHAR(50) NOT NULL,
  background_img_url VARCHAR(500),
  site_url VARCHAR(255),
  background_medium_img_url VARCHAR(500),
  background_small_img_url VARCHAR(500),
  img_medium_url VARCHAR(500),
  img_small_url VARCHAR(500),
  default_address TEXT,
  notification_suffix TEXT,
  vk_url_path VARCHAR(255),
  facebook_url_path VARCHAR(255),
  images_domain VARCHAR(50) DEFAULT 'http://evendate.io/'::character varying,
  status BOOLEAN DEFAULT true NOT NULL,
  new_status BOOLEAN DEFAULT true NOT NULL,
  fts TSVECTOR,
  vk_url VARCHAR(255),
  facebook_url VARCHAR(255),
  state_id INTEGER DEFAULT 1,
  creator_id INTEGER,
  email VARCHAR(255),
  telegram_bot_token VARCHAR(255) DEFAULT NULL::character varying,
  CONSTRAINT organizations_type_id_fkey FOREIGN KEY (type_id) REFERENCES organization_types (id),
  CONSTRAINT organizations_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES users (id)
);
CREATE INDEX public_organizations_type_id0_idx ON organizations (type_id);
CREATE INDEX fts_index_organizations ON organizations (fts);