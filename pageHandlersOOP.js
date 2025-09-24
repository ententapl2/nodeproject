import { readFileSync } from 'node:fs';

class PageHandler {

    constructor(req, res) {
        this.req = req;
        this.res = res;
        this.ended = false;
    }

    root() {
        if (!this.ended) {
            const html = readFileSync("./index.html");
            this.res.writeHead(200, {'Content-Type':'text/html'})
            this.res.end("<html></html>");
        }
    }

    hello() {
        if (!this.ended) {
            this.res.writeHead(200, {'Content-Type':'text/plain'});
            this.res.end("Hello world\n");
        }
    }

    notFound() {
        if (!this.ended) {
            this.res.writeHead(404, {'Content-Type': 'text/plain'});
            this.res.end('Page not found!');
        }
    }

    methodNotAllowed() {
        if (!this.ended) {
            res.writeHead(405, {'Content-Type': 'text/plain'});
            res.end('Method not allowed!');
        }

    }

}