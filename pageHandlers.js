import { readFileSync } from 'node:fs';

export function root(req, res) {
    const html = readFileSync("./index.html");
    res.writeHead(200, {'Content-Type':'text/html'})
    res.end(html)
}

export function hello(req, res) {
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end("Hello world\n");
}

export function notFound(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Page not found!');
}

export function methodNotAllowed(req, res) {

    res.writeHead(405, {'Content-Type': 'text/plain'});
    res.end('Method not allowed!');

}