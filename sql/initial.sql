CREATE TABLE users (
  user_id  SERIAL PRIMARY KEY,
  username TEXT,
  password TEXT
);

CREATE TABLE author (
  author_id SERIAL PRIMARY KEY,
  name      TEXT
);

CREATE TABLE book (
  book_id     SERIAL PRIMARY KEY,
  title       TEXT,
  description TEXT,
  score       INTEGER,
  author_id   INTEGER REFERENCES author(author_id)
);

CREATE TABLE favorite_books_list (
user_id INTEGER REFERENCES users(user_id),
book_id INTEGER REFERENCES book(book_id),
PRIMARY KEY(user_id, book_id)
);

CREATE TABLE book_comment (
  book_id    INTEGER REFERENCES book(book_id),
  comment_id INTEGER REFERENCES comment(comment_id),
  PRIMARY KEY(book_id, comment_id)
);

CREATE TABLE comment (
  comment_id   SERIAL PRIMARY KEY,
  comment_text TEXT,
  user_id      INTEGER REFERENCES users(user_id)
);

CREATE TABLE comment_replies (
  parent_comment_id INTEGER REFERENCES comment(comment_id),
  child_comment_id  INTEGER REFERENCES comment(comment_id),
  PRIMARY KEY(parent_comment_id, child_comment_id)
);
