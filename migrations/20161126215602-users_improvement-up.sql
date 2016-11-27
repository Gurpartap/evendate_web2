CREATE TABLE users_followings(
  user_id INT,
  following_id INT,
  status BOOLEAN DEFAULT TRUE,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (following_id) REFERENCES users(id),

);