const http = require('http');
const express = require('express');

const app = express();

const server = http.createServer(app);
const port = 3000;

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`);
})

// socket io
const io = require('socket.io')(server)

const users = {}

io.on('connection', (socket) => {
    socket.on("new-user-join", (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('user-connected', username);
        io.emit("user-list", users);
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', user = users[socket.id]);
        delete users[socket.id]
        io.emit("user-list", users);
    });
    socket.on('message', (data) => {
        socket.broadcast.emit('message', { user: data.user, msg: data.msg });
    })

})


server.listen(port, () => {
    console.log(`server is running on port ${port}`);
})