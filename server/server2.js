const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ui.html'));
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('requestFileFromServer1', (filename) => {
        // Make a request to the first server to get the file
        axios.get(`http://localhost:3000/files/${filename}`, {
            responseType: 'arraybuffer'
        })
        .then(response => {
            const data = Buffer.from(response.data).toString('base64');
            socket.emit('fileData', { data, filename });
        })
        .catch(error => {
            socket.emit('fileData', { error: 'File not found' });
        });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(port, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});
