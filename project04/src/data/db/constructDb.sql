BEGIN TRANSACTION;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS user(

    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL

);

CREATE TABLE IF NOT EXISTS userSession(
    id TEXT PRIMARY KEY,
    userId INTEGER,
    data TEXT NOT NULL,
    expires INTEGER, 

    FOREIGN KEY(userId) REFERENCES user(id) 
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS userSessionExpiresIndex 
ON userSession(expires);

CREATE TABLE IF NOT EXISTS role(

    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE

); 

CREATE TABLE IF NOT EXISTS privilege(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
); -- unsued in this version of application

CREATE TABLE IF NOT EXISTS rolePrivilege(
    roleId INTEGER NOT NULL,
    privilegeId INTEGER NOT NULL,

    UNIQUE(roleId, privilegeId),
    FOREIGN KEY(roleId) REFERENCES role(id) 
        ON DELETE CASCADE,
    FOREIGN KEY(privilegeId) REFERENCES privilege(id) 
        ON DELETE CASCADE
); -- unused in this version of application

CREATE TABLE IF NOT EXISTS userRole(
    userId INTEGER NOT NULL,
    roleId INTEGER NOT NULL,

    UNIQUE(userId, roleId),
    FOREIGN KEY(userId) REFERENCES user(id) 
        ON DELETE CASCADE,
    FOREIGN KEY(roleId) REFERENCES role(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS poll(

    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    description TEXT,
    authorId INTEGER,
    publicationDate INTEGER,

    CHECK(LENGTH(question) BETWEEN 1 AND 100),
    CHECK(LENGTH(description) <= 800),  
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

CREATE TRIGGER IF NOT EXISTS deleteVotesAfterOptionModification 
AFTER UPDATE ON option 
FOR EACH ROW 
WHEN NEW.name != OLD.name
BEGIN
    DELETE FROM vote
    WHERE vote.optionId = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS deleteExpiredSession 
AFTER INSERT ON userSession 
FOR EACH ROW 
WHEN NEW.expires IS NOT NULL AND NEW.expires <= unixepoch() 
BEGIN 
    DELETE FROM userSession 
    WHERE 
        userSession.expires IS NOT NULL AND 
        userSession.expires < unixepoch();
END;

COMMIT;