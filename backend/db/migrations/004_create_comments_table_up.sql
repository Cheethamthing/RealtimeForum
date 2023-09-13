-- 004_create_comments_table_up.sql
CREATE TABLE IF NOT EXISTS COMMENTS (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
	FOREIGN KEY (PostID) REFERENCES POSTS(PostID),
	FOREIGN KEY (Username) REFERENCES USERS(Username),
	Body TEXT,
	CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
	Likes INTEGER,
	Dislikes INTEGER,
	WhoLiked TEXT,
	WhoDisliked TEXT
);
