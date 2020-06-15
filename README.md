<p align=center>
  <img width="500" src="https://i.imgur.com/bvRuZzu.png"/>
  <br>
  <span><strong>OBS Audio Switcher</strong> It is a tool that works together with OBS to add the functionality of changing scenes using audio levels. </span><br />
<img src="https://img.shields.io/badge/NodeJS-10.13.0-green"> 
<img src="https://img.shields.io/badge/License-MIT-blue">
<a href="http://girlazo.com"><img src="https://img.shields.io/badge/Website-up-green"></a>
<img src="https://img.shields.io/badge/Version-1.0.0-blue">
</p>

<p align="center">
  <a href="#installation">Installation</a>
    &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#configuration">Configuration</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#usage">Usage</a>
  
</p>

## Installation

**NOTE**: NodeJS 10.13.0 or higher is required.

```bash
# clone the repo
$ git clone https://github.com/EsteveSegura/SwitchSceneOnAudioOBS.git

# change the working directory to insta-growth
$ cd SwitchSceneOnAudioOBS

# install NodeJS & npm & WebSocketServer if they are not installed

# install the requirements
$ npm install
```

## Configuration
Before running the application we need to **open our OBS** with the <a href="https://obsproject.com/forum/resources/obs-websocket-remote-control-obs-studio-from-websockets.466/">OBSWebSocket</a> plugin installed and the following plugin configuration *(To access this menu we can do it via Tools -> WebSocket Server Settings)*
<div align=center>
  <img width=300 src="https://i.imgur.com/HhMDG0l.png"/>
</div>

<span style="color:red; font-weight: bold;">IT IS VERY IMPORTANT </span>to have OBS open, with port **4444** configured and the password must be set to **secret** in our web socket server options, before running this software 

## Usage
**Now we are ready to run the software**. In the terminal, within the path indicated in the upper section, we are ready to proceed and run the program.
``` bash
$ cd src
$ node index
```

This process will create a website that works to manage the audio inputs and the microphones, their respective scenes, and the limit to switch between scenes. **We can access the administrator panel by entering the following URL <a href="http: //localhost:3000">http://localhost:3000</a>**

## License
MIT © SwitchSceneOnAudioOBS