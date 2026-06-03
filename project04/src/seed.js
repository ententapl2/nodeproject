import PollService from "./app/service/PollService.js";
import Database from "./data/db/Database.js";
import PollRepoImpl from "./data/impl/PollRepoImpl.js";
import UnitOfWorkImpl from "./data/impl/UnitOfWorkImpl.js";
import PollQueryRepoImpl from "./data/query/PollQueryRepoImpl.js";

const db = new Database(process.env.DB);
const pollRepo = new PollRepoImpl(db);
const pollQueryRepo = new PollQueryRepoImpl(db);
const unitOfWork = new UnitOfWorkImpl(db);

const pollService = new PollService(pollQueryRepo, pollRepo, unitOfWork);

const polls = [
    {
        question: 'SONDAŻ POPARCIA PARTII POLITYCZNYCH',
        description: 'Nie dotyczy partii niszowych',
        options: ['PiS', 'KO', 'Lewica', 'Konfederacja', 'PSL', 'Polska 2050']
    }, 
    {
        question: 'Z jakiej usługi korzystasz najczęściej?',
        description: '',
        options: ['Google Drive', 'Onedrive', 'Dropbox', 'Poczta', 'SMS']
    },
    {
        question: 'Które urlopy lubisz najbardziej?',
        description: 'Nie wybieraj jeśli z nich nie korzystałeś', 
        options: ['Wypoczynkowy', 'macierzyński', 'ojcowski', 'adopcyjny', 'szkoleniowy', 'na dziecko do lat 14', 'z powodu siły wyższej', 'bezpłatny']
    },
    {
        question: 'Z której przeglądarki najchętniej korzystasz?',
        description: '',
        options: ['Google Chrome', 'Microsoft Edge', 'Firefox', 'Opera']
    },
    {
        question: 'Jaki przedmiot rozszerzałeś na maturze?',
        description: 'Można zagłosować jeśli jeszcze nie rozszerzałeś, ale zamierzasz',
        options: ['Matematyka', 'Język polski', 'Język angielski', 'Wiedza o społeczeństwie']
    },
    {
        question: 'Które rozwiazanie wybierzesz spośród poniższych?',
        description: '',
        options: ['Facebook Reels', 'Inne', 'Instagram Reels', 'Youtube shorts', 'Roblox Moments', 'TikTok']
    },
    {
        question: 'Którą telewizję oglądasz najczęściej',
        description: 'Wybrano te najpopularniejsze',
        options: ['Polsat', 'Republika', 'TVP', 'TVN']
    }, 
    {
        question: 'Czego nauczyłeś się na zajęciach Programowania Zaawansowanych Aplikacji Webowych',
        description: 'Nie oceniaj przez pryzmat D. Kleina',
        options: ['Niczego', 'EJS', 'Node', 'NPM', 'Bezpieczeństwa', 'Algorytmów']
    }
];

polls.forEach(poll => {
    pollService.createPoll(
        poll.question,
        poll.description,
        poll.options,
        1,
    );
});