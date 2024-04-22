CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  deleted_at TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS convo (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  deleted_at TEXT,
  user_id INTEGER,
  FOREIGN KEY(user_id) REFERENCES user(id)
) STRICT;


CREATE TABLE IF NOT EXISTS `message` (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  convo_id INTEGER NOT NULL,
  role TEXT NOT NULL, 
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  deleted_at TEXT,
  FOREIGN KEY (convo_id) REFERENCES convo (id),
  CHECK ( role = 'user' OR role = 'assistant' )
) STRICT;