const http = require('http');
const fs = require('fs');

let server = http.Server(requestHandler);

function requestHandler(req, res) {
    if (req.url === '/') {
        fs.readFile('dist/index.html', (err, data) => {
            if (err) throw err;
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data);
            res.end();
        });
    } else {
        let mimeType;
        let filePath = 'dist' + req.url;
        let ext = filePath.split('.');
        switch (ext[ext.length - 1]) {
            case 'js':
                mimeType = 'application/javascript';
                break;
            case 'css':
                mimeType = 'text/css';
                break;
            default:
                mimeType = 'text/plain';
                break;
        }
        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error(`${filePath} does not exist`);
                    return;
                } else {
                    throw err;
                }
            } else {
                res.writeHead(200, { 'Content-Type': mimeType });
                res.write(data);
                res.end();
            }
        });
    }
};

server.listen(8080, () => console.log('server running'));
