const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const OBSWebSocket = require('obs-websocket-js');

const obs = new OBSWebSocket();
obs.connect({ address: 'localhost:4444', password: 'secret' });

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('./public'));

slave = {}
master = {}

io.on('connection', (socket) => {
    socket.on('audioInput', (body) => {
        setValues(body)


    });
});

function setValues(val) {
    if (val.id == "slave") {
        slave = val
    }
    if (val.id == "master") {
        master = val
    }
}

function changeScene() {
    if(master.volume > slave.volume){
        obs.send('SetCurrentScene', { 'scene-name': master.scene });
    }else{
        if (master.volume > 3) {
            obs.send('SetCurrentScene', { 'scene-name': master.scene });
        }
    
        if (slave.volume > 3) {
            obs.send('SetCurrentScene', { 'scene-name': slave.scene });
        }

    }
}

setInterval(() => {
    changeScene()
}, 300);

server.listen(3000/*3000*/, () => {
    console.log('DeliriumCG')
});