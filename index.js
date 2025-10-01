import { createServer } from 'node:http';
import { URL } from 'node:url'
import {root, hello, methodNotAllowed, notFound, favicon} from './pageHandlers.js'
import { config } from 'node:process';

const port = 8000;
const host = 'localhost';
const pathConf = [
	 {
		path:'/favicon.ico',
		allowed_methods:['GET'],
		handler:favicon
	},
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

		if (conf.path === path.replace((/^(?!\/$)(.*)\/$/) ,'$1')) {
			conf.allowed_methods.includes(method) ? conf.handler(req, res) : methodNotAllowed(req, res);
			break;
		} 

	}
	!res.writableEnded && notFound(req, res);


});


server.listen(port, host, ()=>{
	console.log(`Server listening on http://${host}:${port}`);
});
