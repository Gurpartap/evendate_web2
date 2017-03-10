CREATE EXTENSION cube;
CREATE EXTENSION earthdistance;

ALTER TABLE cities
  ADD COLUMN latitude FLOAT;
ALTER TABLE cities
  ADD COLUMN longitude FLOAT;

UPDATE cities
SET updated_at = NOW(), latitude = 55.7558, longitude = 37.6173
WHERE id = 1;


UPDATE cities
SET updated_at = NOW(), latitude = 51.5924, longitude = 45.9608
WHERE id = 2;

SELECT (point(cities.longitude, cities.latitude) <@> point(37.48598, 55.42485)) AS distance FROM
cities;