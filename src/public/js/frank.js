'use strict';

var videoElement = document.querySelector('video');
var audioSelect = document.querySelector('select#audioSource');
var videoSelect = document.querySelector('select#videoSource');

audioSelect.onchange = getStream;

getStream().then(getDevices).then(gotDevices)
setInterval(() => {
    Singleton.getInstance()
    //vuMeter()
    console.log(window.stream)
}, 3000);
function getDevices() {
    return navigator.mediaDevices.enumerateDevices();
}

function gotDevices(deviceInfos) {
    window.deviceInfos = deviceInfos; // make available to console
    console.log('Available input and output devices:', deviceInfos);
    for (const deviceInfo of deviceInfos) {
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
            option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
            audioSelect.appendChild(option);
        }
    }
}

function getStream() {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    const audioSource = audioSelect.value;
    const constraints = {
        audio: { deviceId: audioSource ? { exact: audioSource } : undefined }
    };


    return navigator.mediaDevices.getUserMedia(constraints).
        then(gotStream).catch(handleError);
}

function gotStream(stream) {

    window.stream = stream; // make stream available to console
    audioSelect.selectedIndex = [...audioSelect.options].findIndex(option => option.text === stream.getAudioTracks()[0].label);

}

function handleError(error) {
    console.error('Error: ', error);
}

function vuMeter() {
    console.log("CONSOLE")
    let streamdata = window.stream
    console.log(streamdata.getTracks())
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
    let array = 0
    let values = 0
    let length = 0
    let average = 0
    javascriptNode.onaudioprocess = function () {
        console.log("process")
        array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        values = 0;

        length = array.length;
        for (let i = 0; i < length; i++) {
            values += (array[i]);
        }

        average = values / length;

        //console.log(Math.round(average - 40));

        canvasContext.clearRect(0, 0, 150, 300);
        canvasContext.fillStyle = '#BadA55';
        canvasContext.fillRect(0, 300 - average, 150, 300);
        canvasContext.fillStyle = '#262626';
        canvasContext.font = "48px impact";
        canvasContext.fillText(Math.round(average - 40), -2, 300);

    } // end fn stream
}
let audioContextVar = 0
let analyser = 0
let microphone = 0
let javascriptNode = 0
setTimeout(() => {
     audioContextVar = new AudioContext();
     analyser = audioContextVar.createAnalyser();
     microphone = audioContextVar.createMediaStreamSource(window.stream);
     javascriptNode = audioContextVar.createScriptProcessor(2048, 1, 1);
}, 2000);
var Singleton = (function () {
    var instance;


    function createInstance() {
        var object = new Object("I am the instance");

        console.log("CONSOLE")
        //let streamdata = 
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

            //console.log(Math.round(average - 40));

            canvasContext.clearRect(0, 0, 150, 300);
            canvasContext.fillStyle = '#BadA55';
            canvasContext.fillRect(0, 300 - average, 150, 300);
            canvasContext.fillStyle = '#262626';
            canvasContext.font = "48px impact";
            canvasContext.fillText(Math.round(average - 40), -2, 300);

        } // end fn stream
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();