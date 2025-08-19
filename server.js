/** server side node.js, creates server and loads videos from folder */

const { createServer } = require('node:http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = createServer((req, res) => {
    let filePath = '.' + req.url;

    // index.html page
    if (filePath === './') {
        filePath = './index.html';

        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // api to get videos in folder
    else if (filePath === './videolist') {
        const directoryPath = 'videos'; // path to video files

        fs.readdir(directoryPath, (err, videos) => {
            if (err) {
                console.error('error reading directory:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server error reading videos');
                return;
            }
            console.log('videos in folder:', videos); 
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(videos));
        });
    }

    else {
        // const filePath = path.join(__dirname, req.url);
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.ogg': 'video/ogg'
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // read and serve all file types (to main screen)
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data);
            }
        });
    }
    
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

