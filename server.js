const http = require('http');
const path = require('path');
const fs = require('fs');

let server = http.Server(requestHandler);

function requestHandler(req, res) {
    let filePath = 'dist' + req.url;
    if (req.url === '/') filePath = 'dist/index.html';
    let extName = path.extname(filePath);
    console.log(extName);
    let resHeader;
    switch (extName) {
        case '.html':
            resHeader = { 'Content-Type': 'text/html' };
            break;
        case '.js':
            resHeader = { 'Content-Type': 'application/javascript' };
            break;
        case '.css':
            resHeader = { 'Content-Type': 'text/css' };
            break;
        case '.zip':
            resHeader = { 'Content-Type': 'application/octet-stream' };
            break;
        default:
            resHeader = { 'Location': '/' };
            break;
    }
    let stream = fs.createReadStream(filePath);

    stream.on('error', (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error(`${filePath} does not exist.`);
            } else {
                throw err;
            }
            res.writeHead(304, resHeader);
            res.end();
        }
    });
    
    res.writeHead(200, resHeader)
    stream.pipe(res);
}

server.listen(8080, () => console.log('Server listening at localhost:8080'));
