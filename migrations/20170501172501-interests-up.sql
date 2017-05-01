CREATE TABLE auditory_interests (
  id          SERIAL PRIMARY KEY,
  tg_topic_id INT REFERENCES tg_topics (id),
  user_id     INT REFERENCES users (id),
  value       REAL      DEFAULT 0,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NULL,
  UNIQUE (user_id, tg_topic_id)
);

CREATE OR REPLACE VIEW view_organization_auditory_interests AS
  SELECT
    SUM(value) :: NUMERIC                                                                 AS value,
    tg_topic_id AS topic_id,
    tg_topics.keyword AS topic_name,
    organizations.id                                                                     AS organization_id
  FROM organizations
    INNER JOIN subscriptions ON organizations.id = subscriptions.organization_id
    INNER JOIN auditory_interests ON auditory_interests.user_id = subscriptions.user_id
    INNER JOIN tg_topics ON auditory_interests.tg_topic_id = tg_topics.id
  WHERE subscriptions.status = TRUE
        AND tg_topics.parent_id IS NULL
  GROUP BY tg_topic_id, tg_topics.keyword, organizations.id;

CREATE OR REPLACE VIEW view_user_interests AS
  SELECT
    tg_topic_id                                                                                       AS topic_id,
    tg_topics.keyword                                                                                 AS topic_name,
    user_id,
    value :: NUMERIC,
    DATE_PART('epoch', auditory_interests.created_at) :: INT                                          AS created_at,
    DATE_PART('epoch', COALESCE(auditory_interests.updated_at, auditory_interests.created_at)) :: INT AS updated_at
  FROM auditory_interests
    INNER JOIN tg_topics ON auditory_interests.tg_topic_id = tg_topics.id
  WHERE tg_topics.parent_id IS NULL;