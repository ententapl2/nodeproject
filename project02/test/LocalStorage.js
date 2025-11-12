import PollQueryRepoImpl from "../src/data/query/PollQueryRepoImpl.js";
import Database from "../src/data/db/Database.js";
import PollRepoImpl from "../src/data/impl/PollRepoImpl.js";
import UserRepoImpl from "../src/data/impl/UserRepoImpl.js";
import Poll from "../src/domain/model/Poll.js";
import User from "../src/domain/model/User.js";
import UserQueryRepoImpl from "../src/data/query/UserQueryRepoImpl.js";

function ersteTest() {

    const db = new Database('test.db');
    db.execute("DELETE FROM user;")
    db.execute("DELETE FROM poll;");

    const impl =  new UserRepoImpl(db);
    impl.addUser(new User(
        1,
        'User',
        'password'
    ));


    impl.deleteUser(1);
    const users = impl.getUsersSortedByMostPolls();
    users.forEach(element => {
        console.log(element.id, element.name, element.password);
    });

}


function zweiteTest() {

    const db = new Database('test.db');
    db.execute('DELETE FROM user;');
    db.execute('DELETE FROM poll;');
    db.execute("INSERT INTO user VALUES(1, 'User', 'hash');");


    const impl = new PollRepoImpl(db);
    impl.addPoll(new Poll(
        1,
        'Ankieta',
        'Opis',
        new User(
            1,
            'User'
        ),
        [],
        [],
        Date.now()
    ))
    db.execute("INSERT INTO option VALUES(1, '1', 'opcja');");

    const poll = impl.getPoll(1);
    const polls = impl.getPollsSortedByLatestDate();
    impl.getPoll(1);

    const s = `EXPLAIN QUERY PLAN SELECT 
            poll.id AS [poll.id], 
            poll.question AS [poll.question],
            poll.description AS [poll.description],
            user.id AS [user.id],
            user.name AS [user.name],
            option.id AS [option.id],
            option.name AS [option.name],
            poll.publicationDate AS [poll.publicationDate],
            vote.optionId AS [vote.optionId], 
            vote.userId AS [vote.userId],
            vote.publicationDate AS [vote.publicationDate] 
        FROM (
            SELECT
                id 
            FROM 
                poll 
            ORDER BY 
                poll.publicationDate 
            DESC 
            LIMIT 10
        ) AS latestPolls
             
        JOIN poll ON poll.id = latestPolls.id 
        LEFT JOIN user ON user.id = poll.authorId  
        LEFT JOIN option ON option.pollId = poll.id 
        LEFT JOIN vote ON vote.pollId = poll.id 
        ORDER BY 
            poll.publicationDate 
        DESC, 
            option.id 
        ASC;`
    console.log(db.query(s));
    console.log('f');

}

function dritteTest() {

    const db = new Database('test.db');
    db.execute("DELETE FROM user;")
    db.execute("DELETE FROM poll;");

    const userImpl =  new UserRepoImpl(db);
    const pollImpl = new PollRepoImpl(db);

    userImpl.addUser(new User(
        1,
        'User',
        'password'
    ));
    userImpl.modifyUser(new User(
        1,
        'User extended',
        'password'
    ));
    pollImpl.addPoll(new Poll(
        1,
        'Ankieta',
        'Opis',
        new User(
            1,
            'User'
        ),
        [],
        [],
        Date.now()
    ));
    pollImpl.modifyPoll(new Poll(
        1,
        'Ankieta',
        'Opis rozszerzony',
        new User(
            1,
            'User'
        ),
        [],
        [],
        Date.now()
    ));
    db.execute("INSERT INTO option VALUES(1, '1', 'opcja');");
    //userImpl.deleteUser(1);
    const r = db.query('SELECT * FROM user');

}

function vierteTest() {

    const db = new Database('test.db');
    const impl = new PollQueryRepoImpl(db);
    dritteTest();
    const ra = impl.getPollsSummaryByMostVotes(1, 0);
    console.log(ra);

}

function funfteTest() {

    const db = new Database('test.db');
    const impl = new UserQueryRepoImpl(db);
    dritteTest();
    const ra = impl.getUsersByMostPolls(1, 0);
    console.log(ra);

}

function sechsteTest() {

    const db = new Database('test.db');
    const impl = new PollQueryRepoImpl(db);
    dritteTest();
    db.execute('INSERT INTO vote VALUES(1, 1, 1, 1)');

    const ra = impl.getPoll(1);
    console.log(ra);

}

function siebteTest() {

    const db = new Database('test.db');
    const impl = new PollQueryRepoImpl(db);
    dritteTest();
    db.execute('INSERT INTO vote VALUES(1, 1, 1, 1)');

    const ra = impl.getPollsSummary(1);
    console.log(ra);

}


it('poll database test', siebteTest);