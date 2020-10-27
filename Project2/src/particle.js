class Particle
    {
        constructor()
        {
           this.animTimer = 1000;
    
            this.speed = { 
                x: -5 + Math.random() * 10,
                y: -5 + Math.random() * 10
            };

            this.radius = Math.random() * 5;

            this.lifespan = 30 + Math.random() * 10;
            this.lifespanRemain = this.lifespan; 
        }
        
        draw(ctx)
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

export {Particle};