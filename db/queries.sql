CREATE DATABASE SocialBuzz;
USE SocialBuzz;

CREATE TABLE users (
  username VARCHAR(20) PRIMARY KEY,
  firstName VARCHAR(30) NOT NULL,
  lastName VARCHAR(30) NOT NULL,
  emailAddress VARCHAR(50) NOT NULL,
  statusText TEXT,
  password VARCHAR(250) NOT NULL,
  profilePhoto VARCHAR(255),
  coverPhoto VARCHAR(255),
  dateCreated DATETIME DEFAULT GETDATE(),
  dateUpdated DATE DEFAULT CAST(GETDATE() AS DATE),
  numberOfFollowers INT DEFAULT 0,
  numberOfFollowing INT DEFAULT 0,
  numberOfPosts INT DEFAULT 0
);


CREATE TABLE posts (
  post_id VARCHAR(255) PRIMARY KEY,
  author VARCHAR(20) NOT NULL,
  text TEXT,
  image VARCHAR(255),
  dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
  numberOfLikes INT DEFAULT 1,
  numberOfComments INT DEFAULT 0,
  FOREIGN KEY (author) REFERENCES users(username)
);


CREATE TABLE comments (
  comment_id VARCHAR(255) PRIMARY KEY,
  author VARCHAR(20) NOT NULL,
  post_id VARCHAR(255) NOT NULL,
  comment_text TEXT,
  dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
  lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author) REFERENCES users(username),
  FOREIGN KEY (post_id) REFERENCES posts(post_id)
);

CREATE TABLE follows (
  followed VARCHAR(20) REFERENCES users(username),
  follower VARCHAR(20) REFERENCES users(username)
);


CREATE VIEW post_feeds AS
SELECT
  p.post_id,
  p.author,
  p.text,
  p.image,
  p.dateCreated AS post_dateCreated,
  p.lastUpdated AS post_lastUpdated,
  p.numberOfLikes,
  p.numberOfComments AS post_numberOfComments,
  c.comment_id,
  c.author AS comment_author,
  c.comment_text,
  c.dateCreated AS comment_dateCreated,
  c.lastUpdated AS comment_lastUpdated
FROM
  posts p
  LEFT JOIN comments c ON p.post_id = c.post_id;

select * from post_feeds;


