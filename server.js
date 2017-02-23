const http = require('http');
const path = require('path');
const fs = require('fs');

let server = http.Server(requestHandler);

function requestHandler(req, res) {
    let filePath = 'dist' + req.url;
    if (req.url === '/') filePath = 'dist/index.html';
    let extName = path.extname(filePath);
    let contentType;
    switch (extName) {
        case '.html':
            contentType = 'text/html';
            break;
        case '.js':
            contentType = 'application/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error(`${filePath} does not exist.`);
                return;
            } else {
                throw err;
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(data);
            res.end();
        }
    });
}

server.listen(8080, () => console.log('Server listening at localhost:8080'));
