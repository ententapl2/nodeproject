import { createServer } from 'node:http';
import { URL } from 'node:url'
import {root, hello} from './pageHandlers.js'

const port = 8000;
const host = 'localhost';
const pathConf = [
	{
		path:'/',
		allowed_methods:['GET'],
		handler: root
	}, {
		path:'/hello',
		allowed_methods:['GET'],
		handler:hello
	}
]

const server = createServer((req, res) => {

	const url = new URL(`http://${host}${req.url}`);
	const path = url.pathname
	const method = req.method 
	

	if (!res.writableEnded) {
		
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end('Page not found!');

	}


});


server.listen(port, host, ()=>{
	console.log(`Server listening on http://${host}:${port}`);
});
