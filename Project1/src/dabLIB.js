(function(){
    
    "use strict"
    
    function dtr(degrees){
		return degrees * (Math.PI/180);
	}

	function drawCircle(ctx,x,y,radius,color){
		ctx.save();
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(x,y,radius,0,Math.PI * 2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
        
	}
    
    function clearScreen(){
        
        for(let i=0; i<drawingCircles.length; i++){
            clearInterval(drawingCircles[i].method);
        }
        
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
    }
    
    function getMousePosition(canvas, event) { 
        let rect = canvas.getBoundingClientRect(); 
        clickPosX = event.clientX - rect.left; 
        clickPosY = event.clientY - rect.top; 
        n = 0;
        
        let phyllo = new Phyllotaxy(phylloIndex);
        
        drawingCircles.push(phyllo);
        phylloIndex++;
    } 
    
    // Created this function so that it is easier for setInterval()
    function fixedUpdate(){
        for(let i=0; i<drawingCircles.length; i++){
            if(drawingCircles[i].count > maxSize){
                clearInterval(drawingCircles[i].method);
            }
        }
    }
    
    window["dabLIB"] = {
      dtr, drawCircle, clearScreen, getMousePosition, fixedUpdate
    };

})()