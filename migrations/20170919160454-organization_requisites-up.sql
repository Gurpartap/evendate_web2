ALTER TABLE organizations
  ADD COLUMN agent_approved BOOLEAN DEFAULT FALSE;

ALTER TABLE organizations
  ADD COLUMN agent_info JSONB DEFAULT NULL;

