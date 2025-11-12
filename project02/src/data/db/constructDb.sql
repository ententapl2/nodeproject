BEGIN TRANSACTION;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS user(

    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL

);

CREATE TABLE IF NOT EXISTS poll(

    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    description TEXT,
    authorId INTEGER,
    publicationDate INTEGER,

    FOREIGN KEY(authorId) REFERENCES user(id) 
        ON DELETE SET NULL

);

CREATE TABLE IF NOT EXISTS option(

    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pollId INTEGER NOT NULL,
    name TEXT NOT NULL,

    UNIQUE(pollId, name),
    FOREIGN KEY(pollId) REFERENCES poll(id)
        ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS vote(

    pollId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    optionId INTEGER NOT NULL,
    publicationDate INTEGER NOT NULL,

    FOREIGN KEY(pollId) REFERENCES poll(id)
        ON DELETE CASCADE,
    FOREIGN KEY(userID) REFERENCES user(id) 
        ON DELETE CASCADE,
    FOREIGN KEY(optionId) REFERENCES option(id)
        ON DELETE CASCADE,

    UNIQUE(userId, optionId)

);

COMMIT;