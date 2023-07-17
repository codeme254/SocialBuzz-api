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
  dateUpdated DATE DEFAULT CAST(GETDATE() AS DATE)
);



INSERT INTO users (username, firstName, lastName, emailAddress, statusText, password, profilePhoto, coverPhoto)
VALUES ('john_doe', 'John', 'Doe', 'john.doe@example.com', 'Active user', 'password123', 'https://example.com/john_doe.jpg', 'https://example.com/john_doe_cover.jpg');

INSERT INTO users (username, firstName, lastName, emailAddress, statusText, password, profilePhoto, coverPhoto)
VALUES ('jane_smith', 'Jane', 'Smith', 'jane.smith@example.com', 'New user', 'securepass456', 'https://example.com/jane_smith.jpg', 'https://example.com/jane_smith_cover.jpg');
