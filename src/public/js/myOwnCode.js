let socket = io.connect('http://localhost:3000/');

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia);

let devicesAvailable = []
let select = document.getElementById("selectDevice");
let btnPick = document.getElementById("pick");
let selectPanel = document.getElementById("removable-element");
let typeSelected = document.getElementById("actualId");
let sceneSelected = document.getElementById("scene");
let sliderValue = document.getElementById("range-value");
let slider = document.getElementById("RangeDb");
let titleSlave = document.getElementById("slave-name");
let actualOpt = ""
let dbLimit = -25

console.log(titleSlave)
if(titleSlave != null){
    titleSlave.innerHTML = `Slave-${getParameterByName("slave")}`;
}

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

function getVol(val){
    sliderValue.innerHTML = val;
    dbLimit = val
    console.log(val)
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function startStream() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: { deviceId: { exact: actualOpt } } }, function (stream) {
            vuMeter(stream)
            selectPanel.remove()
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
        sendSocketData(actualVolume, typeSelected.value, sceneSelected.value)
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
    
    let objData = { 'volume': volume, 'id': getParameterByName("slave") != null ? `${id}-${getParameterByName("slave")}` : `${id}`, 'scene': sceneTyped, 'limit': parseInt(dbLimit) }
    socket.emit('audioInput', (objData));
}