import express from "express";
import session from 'express-session';
import methodOverride from 'method-override';
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
import ModifyRouter from "./ui/router/ModifyRouter.js";
import UnitOfWorkImpl from "./data/impl/UnitOfWorkImpl.js";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import SessionStoreImpl from "./data/impl/SessionStoreImpl.js";
import Seeder from "./data/db/Seeder.js";

const port = process.env.PORT;
const __dirname =  path.dirname(fileURLToPath(import.meta.url));

const app = express();
const db = new Database(process.env.DB);
const seeder = new Seeder(db);
seeder.seedRoles([{id: 1, name: 'admin'}]);
seeder.seedUsers([{name: process.env.ADMIN_NAME, password:process.env.ADMIN_PASSWORD, roles:[{id:1}]}]);
const sessionStore = new SessionStoreImpl(db);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'ui', 'view'));
app.use(express.static(path.join(__dirname, 'ui', 'public')));
app.use(session({
  store: sessionStore,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 60 * 60 * 1000
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
const csrfHelmet = csurf();

const userQueryRepo = new UserQueryRepoImpl(db);
const userRepo = new UserRepoImpl(db);
const pollQueryRepo = new PollQueryRepoImpl(db);
const pollRepo = new PollRepoImpl(db);

const userService = new UserService(userQueryRepo);
const unitOfWork = new UnitOfWorkImpl(db);
const pollService = new PollService(pollQueryRepo, pollRepo, unitOfWork)
const homeRouter = new HomeRouter(pollService, userService);

const registerService = new RegisterService(userRepo, userQueryRepo);
const registerRouter = new RegisterRouter(registerService);

const loginService = new LoginService(userQueryRepo);
const loginRouter = new LoginRouter(loginService);
const pollRouter = new PollRouter(pollService);
const userRouter = new UserRouter(pollService, userService);
const newRouter = new NewRouter(pollService);
const modifyRouter = new ModifyRouter(pollService);
const pollSearchRouter = new PollSearchRouter(pollService);
const errorRouter = new ErrorRouter();

app.get('/register', csrfHelmet, registerRouter.getHandler);
app.post('/register', csrfHelmet, registerRouter.postHandler);

app.get('/login', csrfHelmet, loginRouter.getHandler);
app.post('/login', csrfHelmet, loginRouter.postHandler);
app.post('/logout', loginRouter.logoutGetHandler)

app.get('/', homeRouter.getHandler);
app.get('/poll', pollSearchRouter.getHandler);
app.get('/poll/:pollId', pollRouter.getHandler);
app.post('/poll/:pollId', pollRouter.postHandler);
app.delete('/poll/:pollId', pollRouter.deleteHandler);

app.get('/user/:userId', userRouter.getHandler);
app.get('/new', csrfHelmet, newRouter.getHandler);
app.post('/new', csrfHelmet, newRouter.postHandler);
app.get('/modify/:pollId', csrfHelmet, modifyRouter.getHandler);
app.put('/poll/:pollId', csrfHelmet, modifyRouter.putHandler);

app.use(errorRouter.notFoundHandler);
app.use(errorRouter.getHandler);

app.listen(port, function() {
    console.log(`Server listening on http://localhost:${port}`);
})