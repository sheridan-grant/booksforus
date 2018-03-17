CREATE TABLE user (
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
user_id INTEGER REFERENCES user(user_id),
book_id INTEGER REFERENCES book(book_id)
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
  user_id      INTEGER REFERENCES user(user_id)
);

CREATE TABLE comment_replies (
  parent_comment_id INTEGER REFERENCES comment(comment_id),
  child_comment_id  INTEGER REFERENCES comment(comment_id),
  PRIMARY KEY(parent_comment_id, child_comment_id)
);

INSERT INTO user (username, password) values
  ('Grant', 'Grant');

INSERT INTO author (name) values
  ('Brandon Sanderson'), ('Brent Weeks');

INSERT INTO book (title, description, score, author_id) values
  ('Mistborn', 'Mistborn is about a revolution.', 0, 1),
  ('The Well of Ascension', 'The aftermath of the revolution.', 0, 1),
  ('The Black Prism', 'A land ruled by color is falling apart.', 0, 2),
  ('The Way of the Sahdows', 'The story of the greatest assassin.', 0, 2);
