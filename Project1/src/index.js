"use strict";
const canvasWidth = 1200, canvasHeight = 800;
let canvas, ctx;

let n = 0;
    
let divergence = 138;
let c = 5;
let pedalSize = 3;
let speed = 10;
let maxSize = 100;
        
let h = 0;
    
// Mouse variables for phyllos
let clickPosX, clickPosY;
    
// Slider variables
let speedSlider, speedOutput;
let divergenceSlider, divergenceOutput;
let paddingSlider, paddingOutput;
let maxParticlesSlider, maxParticlesOutput;

let drawingCircles = [];
let phylloIndex = 0;
    
window.onload = init;

function init(){
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
        
    //Pedal size
    speedSlider = document.getElementById("speedRange");
    speedOutput = document.getElementById("speed");
    speedOutput.innerHTML = speedSlider.value;
        
    speedSlider.oninput = function() 
    {
        speedOutput.innerHTML = this.value;
        speed = this.value;
    }
        
    //Divergence
    divergenceSlider = document.getElementById("divergenceRange");
    divergenceOutput = document.getElementById("divergence");
    divergenceOutput.innerHTML = divergenceSlider.value;
        
    divergenceSlider.oninput = function() 
    {
        divergenceOutput.innerHTML = this.value;
        divergence = this.value;
    }
        
    //Padding
    paddingSlider = document.getElementById("paddingRange");
    paddingOutput = document.getElementById("padding");
    paddingOutput.innerHTML = paddingSlider.value;
        
    paddingSlider.oninput = function() 
    {
        paddingOutput.innerHTML = this.value;
        c = this.value;
    }
        
    //Max particles
    maxParticlesSlider = document.getElementById("maxParticlesRange");
    maxParticlesOutput = document.getElementById("maxParticles");
    maxParticlesOutput.innerHTML = maxParticlesSlider.value;
        
    maxParticlesSlider.oninput = function() 
    {
        maxParticlesOutput.innerHTML = this.value;
        maxSize = this.value;
    }
        
    //Events
    document.querySelector("#clear").addEventListener("mousedown", dabLIB.clearScreen);
        
    canvas.addEventListener("mousedown", function(e)
    {
        dabLIB.getMousePosition(canvas, e); 
    })
        
        setInterval(dabLIB.fixedUpdate, 100);
	}

function changePedalSize(value){
    if(value.value == "small"){
        pedalSize = 1;
    }
    
    else if(value.value == "medium"){
        pedalSize = 3;
    }
    
    else if(value.value == "large"){
        pedalSize = 5;
    }
    
    else if(value.value == "huge"){
        pedalSize = 10;
    }
        
}

function doExport()
            {
                console.log("export clicked!");
                // https://www.w3schools.com/jsref/met_win_open.asp
                const data = canvas.toDataURL(); 
                const newWindow = window.open();
                newWindow.document.write('<iframe src="' + data  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px;  width:100%; height:100%;" allowfullscreen></iframe>');
            }