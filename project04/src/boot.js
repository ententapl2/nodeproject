import fs from "fs";
import { randomBytes } from "crypto";

const envPath = './.env';
const generateSecret =  () => randomBytes(32).toString('hex');

if (!fs.existsSync(envPath)) {
    const template = `
PORT = 8000
DB = Umfragen.db
ADMIN_NAME = Administrator

SECRET = ${generateSecret()}
PEPPER = ${generateSecret()}
    
    `.trim();
    fs.writeFileSync(envPath, template);
    console.warn('Nie utworzono pliku konfiguracyjnego! Utworzono domyślny');
}