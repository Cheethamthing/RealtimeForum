-- 004_create_comments_table_up.sql
CREATE TABLE IF NOT EXISTS COMMENTS (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
	PostID INTEGER,
	Username TEXT,
	Body TEXT,
	CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
	Likes INTEGER,
	Dislikes INTEGER,
	WhoLiked TEXT,
	WhoDisliked TEXT,
	FOREIGN KEY (PostID) REFERENCES POSTS(PostID),
	FOREIGN KEY (Username) REFERENCES USERS(Username),
    FOREIGN KEY (Likes) REFERENCES COMMENTLIKES(Likes),
    FOREIGN KEY (Dislikes) REFERENCES COMMENTLIKES(Dislikes),
    FOREIGN KEY (WhoLiked) REFERENCES COMMENTLIKES(WhoLiked),
    FOREIGN KEY (WhoDisliked) REFERENCES COMMENTLIKES(WhoDisliked)
);
