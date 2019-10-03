const port = process.env.PORT || 4001;

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const routes = require('./src/routes');

const udpServer = require('./src/broadcast')(port);
const app = express();
app.use(routes)

const server = http.createServer(app);
const io = socketIo(server)

const users = [];


udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

const onMovement = socket => {
    
    socket.on('move', message => {
        console.log('New Board:', message);
        socket.broadcast.emit('boardUpdate', message);
    });


};  

const onPlayerJoin = socket => {
    socket.on('log', player => {
        console.log(users)
        let chip = '';
        if(users.length === 0) {
            chip = 'X'
        } else  if(users.length === 1){
            chip = 'O'
        }
        socket.emit('log', {                
            type: 'OK',
            id: socket.id, 
            number: users.length + 1,
            board: [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
            ],
            chip               
        });
        users.push(socket.id)
        if(users.length === 2) {
            socket.emit('ready', true)
            socket.broadcast.emit('ready', true)
        }
    })
}

io.on('connection', socket => {
    console.log('New client');
    setInterval(() => {
        socket.emit('hello', 'hello from server');
    }, 1000);
    onPlayerJoin(socket);
    onMovement(socket);
    socket.on('disconnect', () => {
        users.pop();
        console.log(users)
    });
});


server.listen(port, () => console.log(`listening on http://localhost:${port}`));