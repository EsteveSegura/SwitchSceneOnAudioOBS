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


//Convert this in iterables and dynamic elemnts
slave1 = {}
slave2 = {}
slave3 = {}
slave4 = {}
slave5 = {}
master = {}

io.on('connection', (socket) => {
    socket.on('audioInput', (body) => {
        setValues({ 'volume': parseInt(body.volume), 'id': body.id, 'scene': body.scene, 'limit': parseInt(body.limit)})
        console.log({ 'volume': parseInt(body.volume), 'id': body.id, 'scene': body.scene, 'limit': parseInt(body.limit)})

    });
});

function setValues(val) {
    if (val.id == "slave-1") {
        slave1 = val
    }
    if (val.id == "slave-2") {
        slave2 = val
    }
    if (val.id == "slave-3") {
        slave3 = val
    }
    if (val.id == "slave-4") {
        slave4 = val
    }
    if (val.id == "slave-5") {
        slave5 = val
    }
    if (val.id == "master") {
        master = val
    }
}

function changeScene() {
    if (master.volume > parseInt(master.limit)) {
        obs.send('SetCurrentScene', { 'scene-name': master.scene });
    } else {
        if (master.volume > parseInt(master.limit)) {
            obs.send('SetCurrentScene', { 'scene-name': master.scene });
        }

        if (slave1.volume > parseInt(slave1.limit)) {
            obs.send('SetCurrentScene', { 'scene-name': slave1.scene });
        }

        if (slave2.volume > parseInt(slave2.limit)) {
            obs.send('SetCurrentScene', { 'scene-name': slave2.scene });
        }

        if (slave3.volume > parseInt(slave3.limit)) {
            obs.send('SetCurrentScene', { 'scene-name': slave3.scene });
        }

        if (slave4.volume > parseInt(slave4.limit)) {
            obs.send('SetCurrentScene', { 'scene-name': slave4.scene });
        }

        if (slave5.volume > parseInt(slave5.limit)) {
            obs.send('SetCurrentScene', { 'scene-name': slave5.scene });
        }
    }
}

setInterval(() => {
    changeScene()
}, 300);

server.listen(3000/*3000*/, () => {
    console.log('OBS Audio Switch')
});