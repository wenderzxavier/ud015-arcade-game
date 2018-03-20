/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make 
 * writing app.js a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvasPlayer = doc.getElementById('choosePlayer'),
        ctxPlayer = canvasPlayer.getContext('2d'),
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        pickingPlayer = true;
        let lvl = 0;
        let width = 0;
        let height = 0;

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Check wheter the has has picked or not its character.
         * If picked, started drawing the canvas, otherwise, keep
         * drawing the character options to user.
        */
        if(pickingPlayer){
            selectMode();            
        }
        else{
            resizeCanvas(lvl);
            doc.body.appendChild(canvas);
            ctx.clearRect(0,0,canvas.width,canvas.height)
            gameDifficulty[lvl].call();
            renderEntities();
        }


        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
    }

    /* This function is called by the update function and loops through all of the
     * objects within allEnemies array defined in app.js and calls their checkCollision()
     * methods. It will then verify if player has hit an enemy, and if true restart player
     * position and decrease one player life.
    */
    function checkCollisions(){
        allEnemies.forEach(function(enemy){
            enemy.checkCollision(player.x, player.y);
        });
    }

    /* This function is called by the main function and loops showing the user the
     * available characters to play the game. The canvas draw one row of grass, 
     * followed by the available characters on the game.
    */
    function selectMode(){
        var rowPlayers = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
            ];

        ctxPlayer.clearRect(0,0,canvasPlayer.width,canvasPlayer.height);

        for(let i = 0; i < 5; i++){
            ctxPlayer.drawImage(Resources.get('images/grass-block.png'), i*101, 0);
        }
        pick.render();
        for(let i = 0; i < 5; i++){
            ctxPlayer.drawImage(Resources.get(rowPlayers[i]), i*101, -50);
        }

    }

    /* This function is called by the main function after the user picked a character and
     * choose the game difficulty. The canvas for easy mode is different for med/hard/insane
     * mode. This function verifies the selected game level and draw the game assigning the width
     * and height to global variables to be accessed by the app.js
    */
    function resizeCanvas(lvl){
        switch(lvl){
            case 0:
                canvas.width = 505;
                canvas.height = 606;
                global.width = canvas.width;
                global.height = canvas.height;
                break;
            default:
                canvas.width = 808;
                canvas.height = 909;
                global.width = canvas.width;
                global.height = canvas.height;
                break;
        }
    }

    /* The following functions define the "game level" features and then call
     * the drawCanvas responsible for drawing the game.
     */
    const easy = function renderEasy() {
        const rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ];
        drawCanvas(rowImages, 6, 5);
    }

    const medium = function renderMed() {
        const rowImages = [
            'images/water-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/grass-block.png',
            'images/grass-block.png'
        ];
        drawCanvas(rowImages, 9, 8);
    }

    const hard = function renderHard(){
        const rowImages = [
            'images/water-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/grass-block.png',
            'images/grass-block.png'
        ];
        drawCanvas(rowImages, 9, 8);
    }

   const insane = function renderInsane(){
        const rowImages = [
            'images/water-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/stone-block.png',
            'images/grass-block.png'
        ];
        drawCanvas(rowImages, 9, 8);
    }

    function drawCanvas(imgs, numRows, numCols){
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over. Remember, this function 
                 * is called every game tick (or loop of the game engine) because 
                 * that's how games work - they are flipbooks creating the 
                 * illusion of animation but in reality they are just drawing 
                 * the entire screen over and over.
                 */
        for(let row = 0; row < numRows; row++){
            for (let col=0; col < numCols; col++){
                ctx.drawImage(Resources.get(imgs[row]), col*101, row*83);
            }
        }
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        obstacles.forEach(function(obstacle){
            obstacle.render();
        })

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // noop
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/selector.png',
        'images/Rock.png',
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    const gameDifficulty = [easy, medium, hard, insane];
    global.ctx = ctx;
    global.ctxPlayer = ctxPlayer;
    global.lvl = lvl;
    global.width = canvas.width;
    global.height = canvas.height;

    /* This eventListener starts the game, removing the character selection
     * draw and difficult buttons. Then draws the canvas with the corresponding
     * properties.
    */
    document.getElementById("btn-start").addEventListener("click", function(){
        document.getElementById("btn-start").remove();
        document.getElementById("game-level").remove();
        document.querySelector("h1").remove();
        document.querySelector("h1").remove();        
        canvasPlayer = doc.getElementById('choosePlayer').remove();
        pickingPlayer = false;
        player.setSprite(pick.x/101);
        document.getElementById("life-ctl").style.display = 'inline-block';
    });

    /* This function insert and remove class for the difficult buttons, and set
     * the chosen level for the game passing it as a global variable. 
    */
    function removeClass(){
        const btns = document.querySelectorAll('button');
        for(btn of btns){
            btn.classList.remove('selected');
        }
    }

    document.getElementById("btn-easy").addEventListener("click", function(){
        removeClass();
        this.classList.add("selected");
        lvl = 0;
        global.lvl = lvl;
    });

    document.getElementById("btn-med").addEventListener("click", function(){
        removeClass();
        this.classList.add("selected");
        lvl = 1;
        global.lvl = lvl;
    })

    document.getElementById("btn-hard").addEventListener("click", function(){
        removeClass();
        this.classList.add("selected");
        lvl = 2;
        global.lvl = lvl;
    })

    document.getElementById("btn-insane").addEventListener("click", function(){
        removeClass();
        this.classList.add("selected");
        lvl = 3;
        global.lvl = lvl;
    })

})(this);

