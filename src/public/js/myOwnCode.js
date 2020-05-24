let socket = io.connect('http://localhost:3000/');

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);

let devicesAvailable = []
let select = document.getElementById("selectDevice");
let btnPick = document.getElementById("pick");
let panel = document.getElementById("panel");
let typeSelected = document.getElementById("actualId");
let sceneSelected = document.getElementById("scene");
let actualOpt = ""

navigator.mediaDevices.enumerateDevices().then(function (devices) {
    devices.forEach(function (device) {
        devicesAvailable.push({
            'kind': device.kind,
            'lablel': device.label,
            'deviceId': device.deviceId
        })

        let opt = device.kind + ": " + device.label;
        let el = document.createElement("option");
        el.textContent = opt;
        el.value = device.deviceId;
        select.appendChild(el);

    });
    console.log(devicesAvailable)
}).catch(function (err) {
    console.log(err.name + ": " + err.message);
});

function getNewOption() {
    actualOpt = select.value
}

function startStream() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: { deviceId: { exact: actualOpt } } }, function (stream) {
            vuMeter(stream)
            panel.remove()
        }, function (err) {
            console.warn(err)
        });
    }
}

function vuMeter(streamdata) {
    let audioContextVar = new AudioContext();
    let analyser = audioContextVar.createAnalyser();
    let microphone = audioContextVar.createMediaStreamSource(streamdata);
    let javascriptNode = audioContextVar.createScriptProcessor(2048, 1, 1);
    console.log(analyser)
    analyser.smoothingTimeConstant = 0.8;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(javascriptNode);
    javascriptNode.connect(audioContextVar.destination);

    let canvasContext = $("#canvas")[0].getContext("2d");
    javascriptNode.onaudioprocess = function () {
        console.log("process")
        let array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;

        let length = array.length;
        for (let i = 0; i < length; i++) {
            values += (array[i]);
        }

        let average = values / length;
        let actualVolume = Math.round(average - 40)
        console.log(actualVolume);
        sendSocketData(actualVolume, typeSelected.value,sceneSelected.value)
        canvasContext.clearRect(0, 0, 150, 300);
        canvasContext.fillStyle = '#BadA55';
        canvasContext.fillRect(0, 300 - average, 150, 300);
        canvasContext.fillStyle = '#262626';
        canvasContext.font = "48px impact";
        canvasContext.fillText(Math.round(average - 40), -2, 300);

    }
}
//
function sendSocketData(volume, id, sceneTyped) {
    let objData = { 'volume': volume, 'id': id, 'scene':sceneTyped }
    socket.emit('audioInput', (objData));
}