/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams = {
    showGradient    :   false,
    showBars        :   true,
    showCircles     :   true,
    showNoise       :   false,
    showInvert      :   false,
    showEmboss      :   false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/New Adventure Theme.mp3"
});

function init(){
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebAudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    canvas.setupCanvas(canvasElement, audio.analyserNode);
	setupUI(canvasElement);
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
} // end setupUI

function loop(){
/* NOTE: This is temporary testing code that we will delete in Part II */
	requestAnimationFrame(loop);
    canvas.draw(drawParams);
	// 1) create a byte array (values of 0-255) to hold the audio data
	// normally, we do this once when the program starts up, NOT every frame
	//let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
	
	// 2) populate the array of audio data *by reference* (i.e. by its address)
	//audio.analyserNode.getByteFrequencyData(audioData);
	
	// 3) log out the array and the average loudness (amplitude) of all of the frequency bins
		//console.log(audioData);
		
		//console.log("-----Audio Stats-----");
		//let totalLoudness =  audioData.reduce((total,num) => total + num);
		//let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
		//let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
		//let maxLoudness =  Math.max(...audioData); // ditto!
		// Now look at loudness in a specific bin
		// 22050 kHz divided by 128 bins = 172.23 kHz per bin
		// the 12th element in array represents loudness at 2.067 kHz
		//let loudnessAt2K = audioData[11]; 
		//console.log(`averageLoudness = ${averageLoudness}`);
		//console.log(`minLoudness = ${minLoudness}`);
		//console.log(`maxLoudness = ${maxLoudness}`);
		//console.log(`loudnessAt2K = ${loudnessAt2K}`);
		//console.log("---------------------");
}

export {init};