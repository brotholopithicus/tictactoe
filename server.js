const http = require('http');
const path = require('path');
const fs = require('fs');

let server = http.Server((req, res) => {
    req.on('error', (err) => {
        console.error(err);
        res.statusCode = 400;
        res.end();
    });
    res.on('error', (err) => console.error(err));
    if (req.method === 'GET') {
        let filePath = 'dist' + req.url;
        if (req.url === '/') filePath = 'dist/index.html';
        let readStream = fs.createReadStream(filePath);
        readStream.on('error', (err) => {
            if (err.code === 'ENOENT') {
                console.error(`${filePath} does not exist.`);
            } else {
                throw err;
            }
            res.writeHead(304, { 'Location': '/' });
            res.end();
        });
        let resHeaders;
        let extName = path.extname(filePath);
        let stats = fs.statSync(filePath);
        switch (extName) {
            case '.zip':
                resHeaders = {
                    'Content-Type': 'application/octet-stream',
                    'Content-Length': stats.size
                }
                break;
            case '.html':
                resHeaders = { 'Content-Type': 'text/html' };
                break;
            case '.js':
                resHeaders = { 'Content-Type': 'application/javascript' };
                break;
            case '.css':
                resHeaders = { 'Content-Type': 'text/css' };
                break;
            default:
                resHeaders = { 'Content-Type': 'text/plain' };
                break;

        }
        res.writeHead(200, resHeaders);
        readStream.pipe(res);
    }
});

server.listen(8080, () => console.log('Server listening at localhost:8080'));
