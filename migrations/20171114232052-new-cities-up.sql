CREATE OR REPLACE VIEW view_cities AS
  SELECT
    id,
    en_name,
    local_name,
    cities.timediff_seconds,
    country_id,
    (SELECT COUNT(id)
     FROM organizations
     WHERE city_id = cities.id AND organizations.status = TRUE) AS organizations_count,
    DATE_PART(
        'epoch',
        cities.updated_at) :: INT  AS updated_at,
    DATE_PART(
        'epoch',
        cities.created_at) :: INT  AS created_at
  FROM cities
  WHERE status = TRUE;
