CREATE TABLE organization_registrations(
  id          SERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ                 DEFAULT NOW(),
  email TEXT,
  site_url TEXT DEFAULT NULL,

);

CREATE TABLE email_types(

);

CREATE TABLE emails(

);


