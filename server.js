const express = require('express');
const app = express();
server = require('http').createServer(app),
io = require('socket.io').listen(server);
const port = process.env.PORT || 3000
server.listen(port);
console.log(`server is now listening on port ${port}`)
usernames = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

io.sockets.on('connection', (socket) => {
    console.log('socket connected.....');

    socket.on('new user', function(data, callback){
        if(usernames.indexOf(data) != -1){
            callback(false)
        }else {
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
        }
    });

    //update usernames

    function updateUsernames() {
        io.sockets.emit('usernames', usernames);
    }

    // Send Message

    socket.on('send message', (data) => {
        io.sockets.emit('new message', {msg: data, user:socket.username});
    });

    // Disconnect 

    socket.on('disconnect', function(data){
        if(!socket.username){
            return;
        }
        usernames.splice(usernames.indexOf(socket.username), 1);
        updateUsernames();
    });
})