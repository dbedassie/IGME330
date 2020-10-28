/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import {setupCanvas, draw, ctx} from './canvas.js';

const drawParams = {
    showGradient    :   false,
    showBars        :   true,
    showCircles     :   true,
    showNoise       :   false,
    showInvert      :   false,
    showEmboss      :   false,
    screenShake     :   false,
    showParticles   :   true,
    screenShake     :   false,
    showLines       :   true
};

let averageLoudness;
let highshelf = false, lowshelf = false;
let time;

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/TeenageRomance.mp3"
});

function init(){
    audio.setupWebAudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupCanvas(canvasElement, audio.analyserNode);
	setupUI(canvasElement);
    time = document.querySelector('#timeSlider');
    loop();
}

function setupUI(canvasElement){
  // A - hookup fullscreen button
  const fsButton = document.querySelector("#fsButton");
    const playButton = document.querySelector('#playButton');
  // add .onclick event to button
  fsButton.onclick = e => {
    console.log("init called");
    utils.goFullscreen(canvasElement);
  };
	
    playButton.onclick = e => {
        console.log('audioCtx.state before = ${audio.audioCtx.state}');
        
        // check if context is in suspended state (autoplay policy)
        if (audio.audioCtx.state == "suspended")
            {
                audio.audioCtx.resume();
            }
        console.log('audioCtx.state before = ${audio.audioCtx.state}');
        if (e.target.dataset.playing == "no")
            {
                // if track is currently paused, play it
                audio.playCurrentSound();
                e.target.dataset.playing = "yes"; // our CSS will set the text to "Pause"
            }
        else    // If track IS playing, pause it
            {
                audio.pauseCurrentSound();
                e.target.dataset.playing = "no"; // our CSS will set the text to "Play"
            }
    };
    
    // Hookup volume slider & label
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");
    
    // add .oninput event to slider
    volumeSlider.oninput = e => {
        // set the gain
        audio.setVolume(e.target.value);
        
        //update value of label to match value of slider
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));
    };
    
    // set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));
    
    // Hookup track <select>
    let trackSelect = document.querySelector('#trackSelect');
    
    // add .onchange event to <select>
    trackSelect.onchange = e => {
        audio.loadSoundFile(e.target.value);
        // pause the current track if it is playing
        if (playButton.dataset.playing = "yes")
            {
                playButton.dispatchEvent(new MouseEvent("click"));
            }
    };
    
    let upload = document.querySelector('#upload');
    upload.onchange = e => {
        const files = e.target.files;
        audio.loadSoundFile(URL.createObjectURL(files[0]));
        
        if(playButton.dataset.playing = "yes")
            {
                playButton.dispatchEvent(new MouseEvent("click"));
            }
    }
    
    let hsCB = document.querySelector('#hsCB');
    hsCB.checked = highshelf;
    
    let lsCB = document.querySelector('#lsCB');
    lsCB.checked = lowshelf;
    
    hsCB.onchange = e => {
        highshelf = e.target.checked;
        audio.toggleHighshelf(highshelf);
            
    }
    
    lsCB.onchange = e => {
        lowshelf = e.target.checked;
        audio.toggleLowshelf(lowshelf);
    }
    
    let gradientCB = document.querySelector('#gradientCB');
    gradientCB.checked = drawParams.showGradient;
    gradientCB.onchange = e => {
        if(gradientCB.checked)
            {
                drawParams.showGradient = true;
            }
        else
            {
                drawParams.showGradient = false;
            }
    }
    
    let waveformCB = document.querySelector('#waveCB');
    waveformCB.checked = drawParams.showLines;
    waveformCB.onchange = e => {
        drawParams.showLines = e.target.checked;
    }
    
    let barsCB = document.querySelector('#barsCB');
    barsCB.checked = drawParams.showBars;
    barsCB.onchange = e => {
        if(barsCB.checked)
            {
                drawParams.showBars = true;
            }
        else
            {
                drawParams.showBars = false;
            }
    }
    
    let circlesCB = document.querySelector('#circlesCB');
    circlesCB.checked = drawParams.showCircles;
    circlesCB.onchange = e => {
        if(circlesCB.checked)
            {
                drawParams.showCircles = true;
            }
        else
            {
                drawParams.showCircles = false;
            }
    }
    
    let noiseCB = document.querySelector('#noiseCB');
    noiseCB.checked = drawParams.showNoise;
    noiseCB.onchange = e => {
        if(noiseCB.checked)
            {
                drawParams.showNoise = true;
            }
        else
            {
                drawParams.showNoise = false;
            }
    }
        
    let invertCB = document.querySelector('#invertCB');
    invertCB.checked = drawParams.showInvert;
    invertCB.onchange = e => {
        if(invertCB.checked)
            {
                drawParams.showInvert = true;
            }
        else
            {
                drawParams.showInvert = false;
            }
        }
    
    let embossCB = document.querySelector('#embossCB');
    embossCB.checked = drawParams.showEmboss;
    embossCB.onchange = e => {
        if(embossCB.checked)
            {
                drawParams.showEmboss = true;
            }
        else
            {
                drawParams.showEmboss = false;
            }
    }
    
    let partCB = document.querySelector('#partCB');
    partCB.checked = drawParams.showParticles;
    partCB.onchange = e => {
        if(partCB.checked)
            {
                drawParams.showParticles = true;
            }
        else
            {
                drawParams.showParticles = false;
            }
    }
    
    let shakeCB = document.querySelector('#shakeCB');
    shakeCB.checked = drawParams.screenShake;
    shakeCB.onchange = e => {
        if(shakeCB.checked)
            {
                drawParams.screenShake = true;
            }
        else
            {
                drawParams.screenShake = false;
            }
    }
    
    
} // end setupUI

//Screen shake: https://stackoverflow.com/questions/28023696/html-canvas-animation-which-incorporates-a-shaking-effect

let shakeDuration = 100;
let shakeStartTime = 0;
let shakeIntensity = 1;

function preShake() {
  if (shakeStartTime == -1) return;
  let dt = Date.now() - shakeStartTime;
  if (dt > shakeDuration) {
      shakeStartTime = -1; 
      return;
  }
  let easingCoef = dt / shakeDuration;
  let easing = (Math.pow(easingCoef - 1, 3) + 1) * shakeIntensity;
  ctx.save();  
  let dx = easing * (Math.cos(dt * 0.1) + Math.cos( dt * 0.3115)) * 15;
  let dy = easing * (Math.sin(dt * 0.05) + Math.sin(dt * 0.057113)) * 15;
  ctx.translate(dx, dy);  
}

function postShake() {
  if (shakeStartTime ==-1) return;
  ctx.restore();
}

function startShake(intensity) {
   shakeStartTime=Date.now();
    shakeIntensity = intensity;
}

function loop()
    {
        requestAnimationFrame(loop);
        preShake();
        draw(drawParams);
        postShake();
        let audioData = new Uint8Array(audio.analyserNode.fftSize/2);

        audio.analyserNode.getByteFrequencyData(audioData);


        let totalLoudness =  audioData.reduce((total,num) => total + num);
        averageLoudness = totalLoudness/(audio.analyserNode.fftSize/2);
        
        if(time != audio.element.duration)
            {
                time.max = audio.element.duration;
            }
        time.value = audio.element.currentTime;
        
    }

export {init, averageLoudness, startShake};