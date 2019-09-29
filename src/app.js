const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const routes = require('./routes');


const port = process.env.PORT || 4001;
const app = express();
app.use(routes)

const server = http.createServer(app);
const io = socketIo(server)


const onMovement = socket => {
    
    socket.on('move', message => {
        console.log('New Board:', message);
        socket.broadcast.emit('boardUpdate', message);
    });
};  

const onPlayerJoin = socket => {
    socket.on('log', player => {
        socket.emit('log', {                
            type: 'OK',
            id: socket.id,                
        });
        const usersInRoom = io.of('/').in('boardUpdate').clients();
        console.log(usersInRoom);
    })
}

io.on('connection', socket => {
    console.log('New client');
    setInterval(() => {
        socket.emit('hello', 'hello from server');
    }, 1000);
    onPlayerJoin(socket);
    onMovement(socket);
    socket.on('disconnect', () => console.log('Client disconnected'));
});


server.listen(port, () => console.log(`listening on http://localhost:${port}`));