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

INSERT INTO users (username, firstName, lastName, emailAddress, statusText, password, profilePhoto, coverPhoto)
VALUES ('john_doe', 'John', 'Doe', 'john.doe@example.com', 'Active user', 'password123', 'https://example.com/john_doe.jpg', 'https://example.com/john_doe_cover.jpg');

INSERT INTO users (username, firstName, lastName, emailAddress, statusText, password, profilePhoto, coverPhoto)
VALUES ('jane_smith', 'Jane', 'Smith', 'jane.smith@example.com', 'New user', 'securepass456', 'https://example.com/jane_smith.jpg', 'https://example.com/jane_smith_cover.jpg');


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

SELECT * FROM comments;

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

SELECT 
    p.post_id,
    p.author,
    p.text,
    p.image,
    p.dateCreated,
    p.lastUpdated,
    p.numberOfLikes,
    p.numberOfComments,
    u.firstName,
    u.lastName,
    u.username,
    u.profilePhoto
INTO postsPopulated
FROM
    posts p
JOIN
    users u ON p.author = u.username;

SELECT * FROM postsPopulated;
