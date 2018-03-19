// Enemies our player must avoid
// constructor(x,y) -> initiates the enemy with given x and y position, the correspondent image and generate random speed
// update(dt) -> update enemy position with a time delta between ticks (dt)
// render() -> draw the enemy on the screen
// checkCollision(playerX, playerY) -> verify if the player hit the enemy and restart game
class Enemy{
    constructor(x, y){
	    this.sprite = 'images/enemy-bug.png';
	    this.x = x;
	    this.y = y;
	    this.speed = Math.random()*(100 - 25) + 25;
    }
    update(dt){
	// You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    	if(this.x > 505){ // Check if the enemy is out of the board, and restart position
    		this.x = -101;
    	}
    	else{
	    	this.x =this.x+this.speed*dt;
    	}
    }
    render(){
    	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    checkCollision(playerX, playerY){
    	if(this.y == playerY){
    		if(this.x <= playerX+61 && this.x+101 >= playerX+40){
    			player.x = 202;
    			player.y = 390;    			
    		}
    	}
    }
};

//Class Player
// constructor() -> initiates the player with given x and y position, and the correspondent image
// render() -> draws the player on the screen
// handleInput() -> updates the Player position on the board
class Player{
	constructor(x,y){
		this.sprite = 'images/char-boy.png';
		this.x = x;
		this.y = y;
	};
	render(){
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
	handleInput(key){
		switch(key){
			case 'left':
				if(this.x > 0 ){
					this.x-=101;					
				}
				break;
			case 'right':
				if(this.x < 404){
					this.x += 101;					
				}
				break;
			case 'up':
				if(this.y > -25){
					this.y -=83;										
				}
				break;
			case 'down':
				if(this.y < 390){
					this.y += 83;										
				}
				break;
		}
	}
}

// This initiate the Player and Enemies
const player = new Player(202,390);
const allEnemies = [];
for(let i=0; i<2; i++){
	allEnemies.push(new Enemy(-101*(i+1),58));
	allEnemies.push(new Enemy(-101*(i+1),141));
	allEnemies.push(new Enemy(-101*(i+1),224));
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});