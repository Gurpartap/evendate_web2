CREATE OR REPLACE VIEW view_users_count
  AS SELECT COUNT(id) AS count FROM users;


DROP VIEW view_r1d;

CREATE OR REPLACE VIEW view_r1d
AS
  SELECT COUNT(id)::FLOAT / (SELECT count FROM view_users_count)  AS r1d
  FROM users
  WHERE id IN
        (SELECT DISTINCT user_id
         FROM users
           INNER JOIN log_requests ON users.id = log_requests.user_id
         WHERE log_requests.created_at :: DATE = (users.created_at + INTERVAL '1 day') :: DATE
         GROUP BY user_id);

CREATE OR REPLACE VIEW view_r7d
AS
  SELECT COUNT(id)::FLOAT / (SELECT count FROM view_users_count)  AS r1d
  FROM users
  WHERE id IN
        (SELECT DISTINCT user_id
         FROM users
           INNER JOIN log_requests ON users.id = log_requests.user_id
         WHERE log_requests.created_at :: DATE = (users.created_at + INTERVAL '7 day') :: DATE
         GROUP BY user_id);


CREATE OR REPLACE VIEW view_r28d
AS
  SELECT COUNT(id)::FLOAT / (SELECT count FROM view_users_count)  AS r1d
  FROM users
  WHERE id IN
        (SELECT DISTINCT user_id
         FROM users
           INNER JOIN log_requests ON users.id = log_requests.user_id
         WHERE log_requests.created_at :: DATE = (users.created_at + INTERVAL '28 day') :: DATE
         GROUP BY user_id);


SELECT ts.time_value::DATE, COUNT(users.id)::FLOAT
 FROM generate_series('2016-03-01 00:00:01'::TIMESTAMP, NOW(), '1 DAY') AS ts(time_value)
  LEFT JOIN users ON users.created_at::DATE = ts.time_value::DATE
  LEFT JOIN log_requests ON users.id = log_requests.user_id AND log_requests.created_at::DATE = ts.time_value + INTERVAL '1 DAY'
GROUP BY ts.time_value;