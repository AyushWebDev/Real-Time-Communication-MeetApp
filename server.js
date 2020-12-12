const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const users = []; 

const socketToRoom = {};

io.on('connection', socket => {
    socket.on("join room", ({roomID,name}) => {
        console.log('New user Connected!!');
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);
        socket.emit('message',{name:'admin',text:`${name},welcome to room`});
        console.log(`name=${name} connected`);
        // socket.broadcast.to(roomID).emit('message',{name:'admin',text:`${name} has joined!`});

        socket.emit("all users", usersInThisRoom);
    });

    socket.on('sendMessage',({message,name,roomID},callback)=>{
        users[roomID].forEach(id => {
            io.to(id).emit('message',{name:name,text:message});
        });
        
        
        callback();
      });


    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('canvas-data',(data)=> {
        socket.broadcast.emit('canvas-data',data);
    })

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});

server.listen(8000, () => console.log(`server is running on port 8000`));