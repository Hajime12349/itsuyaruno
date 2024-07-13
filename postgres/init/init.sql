CREATE TABLE users (
    id TEXT NOT NULL PRIMARY KEY,
    display_name TEXT,
    icon_path TEXT,
    current_task TEXT,
    current_task_time TIMESTAMP
);
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    task_name TEXT NOT NULL,
    deadline DATE,
    total_set INTEGER NOT NULL,
    current_set INTEGER NOT NULL,
    is_complete BOOLEAN NOT NULL Default false,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE tags (tag_name TEXT NOT NULL PRIMARY KEY);
CREATE TABLE task_tags (
    tag_name TEXT NOT NULL,
    task_id INT NOT NULL,
    PRIMARY KEY (task_id, tag_name),
    FOREIGN KEY (tag_name) REFERENCES tags(tag_name) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);