CREATE TABLE IF NOT EXISTS REGISTRATION (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    age INTEGER,
    gender TEXT,
    firstName TEXT,
    lastName TEXT,
    email TEXT,
    password TEXT
);


CREATE TABLE IF NOT EXISTS POSTS (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT,
	img TEXT,
	body TEXT,
	categories Text,
	creationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
	likes INTEGER,
	dislikes INTEGER,
	whoLiked TEXT,
	whoDisliked TEXT
);

CREATE TABLE IF NOT EXISTS COMMENTS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    postID INTEGER,
	username TEXT,
	body TEXT,
	creationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
	likes INTEGER,
	dislikes INTEGER,
	whoLiked TEXT,
	whoDisliked TEXT
);

CREATE TABLE IF NOT EXISTS COOKIES (
    sessionID TEXT NULL,
    userID TEXT NOT NULL,
    creationDate DATETIME DEFAULT CURRENT_TIMESTAMP
);
