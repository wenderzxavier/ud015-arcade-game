/* Enemies our player must avoid
 * constructor(x,y) -> initiates the enemy with given x and y position, the correspondent image and generate random speed
 * update(dt) -> update enemy position with a time delta between ticks (dt)
 * render() -> draw the enemy on the screen
 checkCollision(playerX, playerY) -> verify if the player hit the enemy and restart game
*/

class Enemy{
    constructor(x, y){
	    this.sprite = 'images/enemy-bug.png';
	    this.x = x;
	    this.y = y;
	    this.speed = Math.random()*(300 - 250) + 250;
    }
	/* You should multiply any movement by the dt parameter
     * which will ensure the game runs at the same speed for
     * all computers.
     * This method verifies the game level in order to verifies whether the 
     * enemy must be reseted on the board.
    */
    update(dt){
    	switch(lvl){
    		case 0:
		    	if(this.x > 505){ // Check if the enemy is out of the board, and restart position
			   		this.x = -101;
    			}else{
	    			this.x =this.x+this.speed*dt;
    			}
    			break;
    		default:
    			if(this.x > 808){
    				this.x = -101;
    			}else{
    				this.x = this.x + this.speed*dt;
    			}
    			break;
    	}

    }
    render(){
    	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    /* This method handles the collision between enemy and player, and
     * depending on the collision if player runs out of lives, he modify
     * the text on the screen stating the lost.
    */
    checkCollision(playerX, playerY){
    	if(this.y == playerY){
    		if(this.x <= playerX+61 && this.x+101 >= playerX+40){
    			if(lvl == 0){
    				player.y = 390;
    			}else{
    				player.y = 639;
    			}
    			if(!win){
	    			if(player.lives > 1){
	    				player.lives-=1;
	    			}else{
	    				player.lives = 0;
						document.getElementById("game-over").textContent = "Game Over - You Lost!";
	    			}    				
    			}
    		}
    	}
    }
};

//Class Player
// constructor() -> initiates the player with given x and y position, and the correspondent image
// render() -> draws the player on the screen
// handleInput() -> updates the Player position on the board
class Player{
	constructor(x,y, lives){
		this.sprite = 0;
		this.x = x;
		this.y = y;
		this.lives = lives;
	};

	setSprite(pos){
		this.sprite = pos;
	};

	/* This method rendes the player position on the board. If player reaches
	 * the water position, it alters the text on the screen for "Win".
	*/
	render(){
		ctx.drawImage(Resources.get(rowPlayers[this.sprite]), this.x, this.y);
		document.getElementById("lives").textContent = this.lives;
		if(this.y <= -25){
			if(player.lives > 0){
				win = true;
				document.getElementById("game-over").textContent = "You Won!";							
			}
		}
	};

	/* This method verify handle when a key is pressed on the keyboard checking
	 * if the movement can be performed or not (rock or out of boards are not 
	 * possible movements).
	*/
	handleInput(key){
		switch(key){
			case 'left':
				if(this.x > 0){
					if(!checkRock(this.x-101, this.y)) this.x-=101;
				}
				break;
			case 'right':
				if(this.x < width-101){
					if(!checkRock(this.x+101, this.y)) this.x+=101;
				}
				break;
			case 'up':
				if(this.y > -25){
					if(!checkRock(this.x, this.y-83))this.y-=83;
				}
				break;
			case 'down':
				if(this.y < height-303){
					if(!checkRock(this.x, this.y+83))this.y+=83;
				}
				break;
		}
	}
}
	/* This function verify if the player is trying to move to rock positions
	 * where it is not possible. 
	*/
	function checkRock(playerX, playerY){
		for(rock of obstacles){
			if(rock.x == playerX && rock.y == playerY){		
				return true;
			}
		}
	}

// Obstacle (rock) Class
class Obstacle{
	constructor(x, y){
		this.x = x;
		this.y = y;
	}

	render(){
		ctx.drawImage(Resources.get('images/Rock.png'), this.x, this.y);
	}
}

// Character Picker Class
class characterPicker{
	constructor(){
		this.sprite = 'images/selector.png';
		this.x = 0;
	}

	render(){
		ctxPlayer.drawImage(Resources.get(this.sprite), this.x, -40);
	}

	// This method handles the alternate positions between characters
	handleInput(key){
		switch(key){
			case 'left':
				if(this.x > 0){
					this.x -= 101;
				}
				break;
			case 'right':
				if(this.x < 404){
					this.x += 101;
				}			
		}
	}
}

var rowPlayers = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png',
    'images/char-princess-girl.png'
];

// This initiate the Player, Character Picker, obstacles (empty) and enemies (empty)
let win = false;
const pick = new characterPicker();
const player = new Player(303,390, 3);
const allEnemies = [];
const obstacles = [];

/* This method handles when the "Start" button is pressed. It check the selected
 * level and start positioning enemies,players and rocks according to the level.
 * Level 0 = Easy; Level 1 = Medium; Level 2 = Hard; Level 3 = Insane.
*/
document.getElementById("btn-start").addEventListener("click", function(){
	switch(lvl){
		case 0:
			player.x = 303;
			player.y = 390;
			for(let i=0; i<2; i++){
				allEnemies.push(new Enemy(Math.floor(Math.random()*4)*101,58));
				allEnemies.push(new Enemy(Math.floor(Math.random()*4)*101,141));
				allEnemies.push(new Enemy(Math.floor(Math.random()*4)*101,224));
			}
			break;
		case 1:
			player.x = 404;
			player.y = 639;
			for(let i=0; i<2; i++){
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,58));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,141));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,224));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,307));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,390));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,473));
			}
			break;
		case 2:
			player.x = 404;
			player.y = 639;
			for(let i=0; i<3; i++){
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,58));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,141));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,224));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,307));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,390));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,473));
			}
			for(let j=0; j<6; j++){
				obstacles.push(new Obstacle(Math.floor(Math.random()*7)*101,(j*83)+58));
				obstacles.push(new Obstacle(Math.floor(Math.random()*7)*101,(j*83)+58));
				obstacles.push(new Obstacle(Math.floor(Math.random()*7)*101,(j*83)+58));
			}
			break;
		case 3:
			player.x = 404;
			player.y = 639;
			player.lives = 1;
			for(let i=0; i<3; i++){
//				allEnemies.push(new Enemy(-101*(i+1),58));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,141));
//				allEnemies.push(new Enemy(-101*(i+1),224));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,307));
//				allEnemies.push(new Enemy(-101*(i+1),390));
				allEnemies.push(new Enemy(Math.floor(Math.random()*7)*101,473));
			}
			// Place rock on all row except for one position (way)
			for(let j=0; j<=6; j+=2){
				let way = Math.floor(Math.random()*7);
				for(let k=0; k<=7;k++){
					if(k==way){
						continue;
					}
					obstacles.push(new Obstacle(k*101,(j*83)+58));
				}
			}
			break;
	}
});

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
    pick.handleInput(allowedKeys[e.keyCode]);
});