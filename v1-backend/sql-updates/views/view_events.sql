
CREATE VIEW view_events AS
  SELECT *
  FROM view_all_events
  WHERE status = TRUE;

