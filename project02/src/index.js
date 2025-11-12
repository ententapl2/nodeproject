import express from "express";
import session from 'express-session';
import path from "path";
import { fileURLToPath } from "url";
import RegisterRouter from "./ui/router/RegisterRouter.js";
import RegisterService from "./app/service/RegisterService.js";
import UserRepoImpl from "./data/impl/UserRepoImpl.js";
import UserQueryRepoImpl from "./data/query/UserQueryRepoImpl.js";
import Database from "./data/db/Database.js";
import LoginService from "./app/service/LoginService.js";
import LoginRouter from "./ui/router/LoginRouter.js";
import UserService from "./app/service/UserService.js";
import PollService from "./app/service/PollService.js";
import PollQueryRepoImpl from "./data/query/PollQueryRepoImpl.js";
import HomeRouter from "./ui/router/HomeRouter.js";
import PollRouter from "./ui/router/PollRouter.js";
import PollRepoImpl from "./data/impl/PollRepoImpl.js";
import UserRouter from "./ui/router/UserRouter.js";
import NewRouter from "./ui/router/NewRouter.js";
import PollSearchRouter from "./ui/router/PollSearchRouter.js";
import ErrorRouter from "./ui/router/ErrorRouter.js";


const port = 8000;
const __dirname =  path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'ui', 'view'));
app.use(express.static(path.join(__dirname, 'ui', 'public')));
app.use(session({
  secret: `z&,L#mD~,Q#O]T4&&01N!gB?)GFUT7ch~6')/JDoKL/Kb?e4<#7]QI6*#~@l}R7`,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 1000 // 1h
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const db = new Database('Umfragen.db');
const userQueryRepo = new UserQueryRepoImpl(db);
const userRepo = new UserRepoImpl(db);
const pollQueryRepo = new PollQueryRepoImpl(db);
const pollRepo = new PollRepoImpl(db);

const userService = new UserService(userQueryRepo);
const pollService = new PollService(pollQueryRepo, pollRepo)
const homeRouter = new HomeRouter(pollService, userService);

const registerService = new RegisterService(userRepo, userQueryRepo);
const registerRouter = new RegisterRouter(registerService);

const loginService = new LoginService(userQueryRepo);
const loginRouter = new LoginRouter(loginService);
const pollRouter = new PollRouter(pollService);
const userRouter = new UserRouter(pollService, userService);
const newRouter = new NewRouter(pollService);
const pollSearchRouter = new PollSearchRouter();
const errorRouter = new ErrorRouter();

app.get('/register', registerRouter.getHandler);
app.post('/register', registerRouter.postHandler);

app.get('/login', loginRouter.getHandler);
app.post('/login', loginRouter.postHandler);
app.post('/logout', loginRouter.logoutGetHandler)

app.get('/', homeRouter.getHandler);
app.get('/poll', pollSearchRouter.getHandler);
app.get('/poll/:pollId', pollRouter.getHandler);
app.post('/poll/:pollId', pollRouter.postHandler);
app.delete('/poll/:pollId', pollRouter.deleteHandler);

app.get('/user/:userId', userRouter.getHandler);
app.get('/new', newRouter.getHandler);
app.post('/new', newRouter.postHandler);

app.use(errorRouter.render404);
app.use(errorRouter.render404);
app.use(errorRouter.render401);
app.use(errorRouter.render406);

app.listen(port, function() {
    console.log(`Server listening on http://localhost:${port}`);
})