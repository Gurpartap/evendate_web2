CREATE TABLE counties(
  id SERIAL PRIMARY KEY,
  en_name VARCHAR(255),
  local_name  VARCHAR(255),
  language VARCHAR(255),
  language_short VARCHAR(10),
  created_at      TIMESTAMPTZ                 DEFAULT NOW(),
  updated_at      TIMESTAMPTZ
);

INSERT INTO counties(id, en_name, local_name, language, language_short) VALUES
  (1, 'Russia', 'Россия', 'Русский', 'ru_ru');

CREATE TABLE cities(
  id SERIAL PRIMARY KEY,
  en_name TEXT,
  local_name TEXT,
  timediff VARCHAR(10),
  country_id INT,
  created_at      TIMESTAMPTZ                 DEFAULT NOW(),
  updated_at      TIMESTAMPTZ,
  FOREIGN KEY (country_id) REFERENCES counties(id)
);

INSERT INTO cities (id, en_name, local_name, timediff, country_id)
    VALUES (1, 'Moscow', 'Москва', '+03:00', 1);

ALTER TABLE organizations ADD COLUMN city_id INT DEFAULT 1;
ALTER TABLE organizations ADD FOREIGN KEY (city_id) REFERENCES cities(id);

