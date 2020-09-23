class Phyllotaxy{
    "use strict"

		constructor(){
            this.num = 0;
            this.clickX = clickPosX;
            this.clickY = clickPosY;
            
            this.method = setInterval(this.spawnPhyllo, speed, this);
		}
    
        spawnPhyllo(obj){

            let a = obj.num * dabLIB.dtr(divergence);

            let r = c * Math.sqrt(obj.num);

            let x = r * Math.cos(a) + obj.clickX;
            let y = r * Math.sin(a) + obj.clickY;

            dabLIB.drawCircle(ctx,x,y,pedalSize,"hsl(" + h + "," + 50 + "%," + 50 + "%)");

            obj.num++;

            if(h < 360){
                h++;
            }
            else{
                h = 0;
            }

            this.count++;
            
            if(obj.num >= maxSize){
                clearInterval(obj.method);
            }

        }
}