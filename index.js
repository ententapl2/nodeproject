import { createServer } from 'node:http';
import { URL } from 'node:url'
import {root, hello, methodNotAllowed, notFound} from './pageHandlers.js'

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
	const path = url.pathname;
	const method = req.method;
	
	for (let conf of pathConf) {

		if (conf.path === path) {
			conf.allowed_methods.includes(method) ? conf.handler(req, res) : methodNotAllowed(req, res);
			break;
		} 

	}
	!res.writableEnded && notFound(req, res);


});


server.listen(port, host, ()=>{
	console.log(`Server listening on http://${host}:${port}`);
});
