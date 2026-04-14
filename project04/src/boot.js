import fs from "fs";
import { randomBytes } from "crypto";

const envPath = './src/.env';
const genereateSecret =  () => randomBytes(32).toString('base64url');

if (!fs.existsSync(envPath)) {
    const template = `
PORT = 8000
DB = Test.db
ADMIN_NAME = Administrator

SECRET = ${genereateSecret()}
PEPPER = ${genereateSecret()}
    
    `.trim();
    fs.writeFileSync(envPath, template);
    console.warn('Nie utworzono pliku konfiguracyjnego! Utworzono domyślny');
}