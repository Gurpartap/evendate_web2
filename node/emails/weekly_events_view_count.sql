SELECT
  COUNT(stat_events.id) :: INT             AS value,
  DATE_PART('epoch', ts.time_value) :: INT AS time_value
FROM stat_events
  INNER JOIN events ON events.id = stat_events.event_id
  AND events.organization_id = $3
  INNER JOIN stat_event_types ON stat_events.stat_type_id = stat_event_types.id
                                 AND stat_event_types.entity = 'event'
                                 AND stat_event_types.type_code = 'view_detail'

  RIGHT OUTER JOIN (SELECT *
                    FROM generate_series(to_timestamp($2, 'YYYY-MM-DD'),
                                         to_timestamp($1, 'YYYY-MM-DD'), '-1 days')) AS ts(time_value)
    ON stat_events.created_at BETWEEN (ts.time_value - INTERVAL '1 days') AND ts.time_value
GROUP BY ts.time_value
ORDER BY ts.time_value;