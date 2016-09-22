--depends: tokens, stat_event_types

CREATE TABLE stat_organizations
(
  id SERIAL PRIMARY KEY NOT NULL,
  organization_id BIGINT NOT NULL,
  token_id BIGINT,
  stat_type_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  updated_at TIMESTAMP,
  CONSTRAINT stat_organizations_token_id_fkey FOREIGN KEY (token_id) REFERENCES tokens (id),
  CONSTRAINT stat_organizations_stat_type_id_fkey FOREIGN KEY (stat_type_id) REFERENCES stat_event_types (id)
);
CREATE INDEX public_stat_organizations_token_id1_idx ON stat_organizations (token_id);
CREATE INDEX public_stat_organizations_stat_type_id0_idx ON stat_organizations (stat_type_id);