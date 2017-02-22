const http = require('http');
const fs = require('fs');

let server = http.Server(requestHandler);

function requestHandler(req, res) {
	if(req.url === '/') {
		fs.readFile('dist/index.html', (err, data) => {
			if(err) throw err;
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.write(data);
			res.end();	
		});
	} else if(req.url === '/bundle.js') {
		fs.readFile('dist/bundle.js', (err, data) => {
			if(err) throw err;
			res.writeHead(200, {'Content-Type': 'application/javascript' });
			res.write(data);
			res.end();
		});
	} else if(req.url === '/style.css') {
		fs.readFile('dist/style.css', (err, data) => {
			if(err) throw err;
			res.writeHead(200, { 'Content-Type': 'text/css' });
			res.write(data);
			res.end();
		});
	} else {
		res.writeHead(302, { 'Location': '/' });
		res.end();
	}
};

server.listen(8080, () => console.log('server running'));

	
