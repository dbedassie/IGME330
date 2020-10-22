import * as utils from './utils.js';
import * as main from './main.js';


let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData, waveformData, waveformHeight;
let currentPTimer = 0, particles = [];
const pTimer = 1, maxParticles = 100, pSpeed = 0.1;

function setupCanvas(canvasElement,analyserNodeRef){
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:1,color:"rgb(0,0,0)"},{percent:.5,color:"rgb(20,33,61)"},{percent:0,color:"rgb(252,163,17)"}]);
	analyserNode = analyserNodeRef;
	audioData = new Uint8Array(analyserNode.fftSize / 2);
    waveformData = new Uint8Array(analyserNode.fftSize);
    waveformHeight = new Int8Array(analyserNode.fftSize);
}

let Particle = function()
{
    this.animTimer = 1000;
    
    this.speed = { 
        x: -5 + Math.random() * 10,
        y: -5 + Math.random() * 10
    };
    
    this.radius = Math.random() * 5;
    
    this.lifespan = 30 + Math.random() * 10;
    this.lifespanRemain = this.lifespan;
    
    this.draw = ctx =>
    {
        let p = this;
        
        if(this.radius > 0)
            {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, 1)`;
                ctx.fill();
                
                p.lifespanRemain--;
                p.radius -= 0.01;
                p.x += p.speed.x;
                p.y += p.speed.y;
            }
    }
}

function createParticle(x, y, color, l)
{
    let p = new Particle();
    p.rgb = color;
    p.x = x;
    p.y = y;
    p.start = Date.now();
    particles.push(p);
}

function draw(params={}){
    // populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// Draw background
	ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.1;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
    
    // Screen shake
    if(params.screenShake)
        {
            let bass = (audioData[1] + audioData[2]) / 510;
            
            if(bass >= 0.75)
                {
                    main.beginShake(bass);
                }
        }
    
    // Particle effects around screen
    ctx.save();
    ctx.fillStyle = gradient;
    if(params.showParticles)
        {
            if(currentPTimer >= pTimer)
                {
                    currentPTimer = 0;
                }
            else
                {
                    currentPTimer++;
                }
            
            if(particles.length < maxParticles)
                {
                    createParticle(Math.random() * canvasWidth, Math.random() * canvasHeight, "white", main.averageLoudness);
                }
            
            let multiply = main.averageLoudness / 3;
            
            for(let i = 0; i < particles.length; i++)
                {
                    // If particles go off screen, delete them.
                    if(particles[i].radius <= 0 || particles[i].x < 0 || particles[i].y > canvasHeight || particles[i].y < 0)
                        {
                            particles.splice(i, 1);
                        }
                    
                    // If left, move left. Or vice versa
                    if(particles[i].x < canvasWidth / 2)
                        {
                            if(multiply > 10)
                                {
                                    particles[i].speed.x = -pSpeed * multiply;
                                }
                            else
                                {
                                    particles[i].speed.x = -pSpeed;
                                }
                        }
                    else
                        {
                            if(multiply > 10)
                                {
                                    particles[i].speed.x = pSpeed * multiply;
                                }
                            else
                                {
                                    particles[i].speed.x = pSpeed;
                                }
                        }
                    
                    if(particles[i].y < canvasHeight / 2)
                        {
                            if(multiply > 10)
                                {
                                    particles[i].speed.y = -pSpeed * multiply;
                                }
                            else
                                {
                                    particles[i].speed.y = -pSpeed;
                                }
                        }
                    else
                        {
                            if(multiply > 10)
                                {
                                    particles[i].speed.y = pSpeed * multiply;
                                }
                            else
                                {
                                    particles[i].speed.y = pSpeed;
                                }
                        }
                    particles[i].draw(ctx);
                    
                    // Clean up screen
                    if(i === particles.length - 1)
                        {
                            let percent = (Date.now() - particles[i].start) / particles[i].animTimer;
                            
                            if (percent > 1)
                                {
                                    particles = [];
                                }
                        }
                }
        }
    ctx.restore();
    
	// Draw gradient
    if(params.showGradient)
        {
            ctx.save();
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.3;
            ctx.fillRect(0,0, canvasWidth, canvasHeight);
            ctx.restore();
        }
	
    if(params.showCircles)
        {
            let maxRadius = canvasHeight / 4;
            ctx.save();
            ctx.globalAlpha = 0.5;
            for(let i = 0; i < audioData.length; i++)
                {
                    // outer circle
                    let percent = audioData[i] / 255;
                    
                    let circleRadius = percent * maxRadius;
                    ctx.beginPath();
                    ctx.fillStyle = utils.makeColor(20, 33, 61, .34 - percent / 3.0);
                    ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 1.5, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.closePath();
                    
                    // inner circles, smaller
                    ctx.save();
                    ctx.beginPath();
                    ctx.fillStyle = utils.makeColor(252, 163, 17, 0.5 - percent / 5.0);
                    ctx.arc(canvasWidth / 2, canvasHeight / 2, circleRadius * 0.5, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.closePath();
                    ctx.restore();
                }
            ctx.restore();
    
	// Draw bars
    if(params.showBars)
        {
            let barSpacing = 10;
            let margin = 20;
            let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
            let barWidth = screenWidthForBars / audioData.length;
            let barHeight = 7;
            let topSpacing = 510;
            
            ctx.save();
            ctx.fillStyle = utils.makeColor(255, 255, 255, 0.50);
            //ctx.strokeStyle = utils.makeColor(0, 0, 0, 0.50);
            // loop through the data and draw
            for(let i = 0; i < audioData.length; i++)
                {
                    ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
                    ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
                }
            ctx.restore();
        }
	
    
            
            // Bitmap manipulation
            let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
            let data = imageData.data;
            let length = data.length;
            let width = imageData.width; // not using here
            for(let i = 0; i < length; i++)
                {
                    if(params.showNoise && Math.random() < 0.05)
                        {
                            // data[i] is the red channel
                            // data[i+1] is the green channel
                            // data[i+2] is the blue channel
                            // data[i+3] is the alpha channel
                            data[i] = data[i + 1] = data[i + 2] = 0; // zero out the red and green and blue channels
                            data[i] = 65; // make the red channel 100% red
                        }
                    if (params.showInvert)
                        {
                            let red = data[i], green = data[i + 1], blue = data[i + 2];
                            data[i] = 255 - red;    // set red value
                            data[i + 1] = 255 - green; // set green value
                            data[i + 2] = 255 - blue; // set blue value
                        }
                }
            if(params.showEmboss)
                {
                    for(let i = 0; i < length; i++)
                    {
                        if(i % 4 == 3) continue; // skip alpha channel
                        data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
                    }
                }
            ctx.putImageData(imageData, 0, 0);
        }
		
}

export {setupCanvas, draw, ctx};