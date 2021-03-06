 var innerWidth = window.innerWidth;
 var innerHeight = window.innerHeight;
 var gameRatio = innerWidth/innerHeight;	

// Initialize Phaser, and create a 400x480px game
 var game = new Phaser.Game(Math.ceil(590*gameRatio), 500, Phaser.CANVAS, '');

// Create our 'main' state that will contain the game
var mainState = {
	
	 init: function(character) {
		this.bitty = character;
		this.array = ["e","c","a" ];
		
   },
		

	preload: function() {
		//This function will be executed at the beginning
		// That's where we load the game's assets
	
		
		// Change the background color of the game
		
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.scale.setScreenSize(true);
		game.stage.backgroundColor = '#71c5cf';
		
		
		// Load the bird sprite
		 
		//	game.load.image('bird', 'assets/erin.png');
		//else
    if (this.bitty == "jess") 
			game.load.image('bird', 'assets/jess.png');
		else if (this.bitty == "erin")
			game.load.image('bird', 'assets/erin_bird.png');
		else if (this.bitty == 'colleen')
			game.load.image('bird', 'assets/colleen.png');
		else if (this.bitty == 'abbie')
			game.load.image('bird', 'assets/abbie_bird.png');
		else	
			game.load.image('bird', 'assets/bird.png');
		//Loading a colleen sprite
		game.load.image('colleen', 'assets/colleen.png');
		
		//Loading a erin sprite
		game.load.image('erin', 'assets/erin.png');
		
		game.load.image('jess', 'assets/jess_head.png');
		
		//Loading a abbie
		game.load.image('abbie', 'assets/abbie.png');
		
		
		//load the pipe sprite
		game.load.image('pipe','assets/pipe.png');
	
	
		
	},
	
	create: function() {
		//This function is called after the preload function
		//Here we set up the game, display sprites, etc.
	
		

		
		
		
		// Set the physics system
	
	
	
	
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		
		
		
		//Display the bird on the screen
		this.bird = this.game.add.sprite(100, 245, 'bird');
		
		//Change the anchor of the bird, making behave like the original flappy bird animation
		this.bird.anchor.setTo(-0.2, 0.5);
		
		// Add gravity to the bird to make it fall
		game.physics.arcade.enable(this.bird);
		this.bird.body.gravity.y = 1000;
		
		// Call the 'jump' function when the spacekey is hit
		var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.jump, this);
		
		this.pipes = game.add.group(); // create a group
		this.pipes.enableBody = true; // Add physics to the group
		this.pipes.createMultiple(20, 'pipe'); // create 20 pipes
	  
	  this.colleenFaces = game.add.group(); // create a group
	  this.colleenFaces.enableBody = true; // Add physics to the group	
		if (this.bitty == 'colleen')
			this.colleenFaces.createMultiple(6, 'jess');
		else
			this.colleenFaces.createMultiple(6, 'colleen'); 	
		
		this.erinFaces = game.add.group(); 
	  this.erinFaces.enableBody = true;
		if (this.bitty == 'erin')
			this.erinFaces.createMultiple(6, 'jess'); 
		else
			this.erinFaces.createMultiple(6, 'erin'); 	
	
		this.abbieFaces = game.add.group(); 
	  this.abbieFaces.enableBody = true; 
		if (this.bitty == 'abbie')
			this.abbieFaces.createMultiple(6, 'jess'); 
		else
			this.abbieFaces.createMultiple(6, 'abbie');		
		
		this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
		
		
		
		this.score = 0;
		this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff" });
		
		
		//this allows for the pressing of the mouse of touch screen device to jump as well
		this.input.onDown.add(this.jump, this);
	
		
		//This is to make it full screen
//		game.stage.fullScreenScaleMode = Phaser.StageScaleMode.SHOW_ALL;
	//	game.stage.scale.setShowAll();
	//	game.stage.scale.pageAlignHorizontally = true;
	//	game.stage.scale.pageAlignVeritcally = true;
	//	game.stage.scale.refresh();
	  
	
	},
	
	update: function() {
		// This function is called 60 times per second
		// It contains the game's logic
		
		//If the bird is out of the world (too high or too low), call the 
		//'restartGame' function
		if (this.bird.inWorld == false)
			this.restartGame();
	
		game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);
		game.physics.arcade.overlap(this.bird, this.colleenFaces, this.hitPipe, null, this);
		game.physics.arcade.overlap(this.bird, this.erinFaces, this.hitPipe, null, this);
		game.physics.arcade.overlap(this.bird, this.abbieFaces, this.hitPipe, null, this);
		
		if (this.bird.angle < 20)
			this.bird.angle += 1;
	
	},
	
	// Make the bird jump
	jump: function() {
		
		//if the bird is dead then dont allow it to jump
		if (this.bird.alive == false)
			return;
		
		//make the sound on jump
	//	this.jumpSound.play();
		
		// Add a vertical velocity to the bird
		this.bird.body.velocity.y = -350;
		
		// Create an animation of the bird
		var animation = game.add.tween(this.bird);
		
		//Set the animation to change the angle of the sprite to -20 degrees
		animation.to({angle: -20}, 100);
		
		// And start the animation
		animation.start();			
		
	
	},
	
	// Restart the game
	restartGame: function() {
		// start the 'main' state, which restarts the game
		game.state.start('main', true, false, this.bitty);
	},

	addOnePipe: function(x,y){
		// Get the first dead pipe of our group
		var pipe = this.pipes.getFirstDead();
		
		// Set the new position of the pipe
		pipe.reset(x,y);
		
		//Add velocity to the pipe to make it move left
		pipe.body.velocity.x = -200;
		
		//kill the pipe when it's no longer visible
		pipe.checkWorldBounds = true;
		pipe.outOfBoundsKill = true;		
		
	
	},
	
	addOneFace: function(x,y,girl){
		// Get the first dead pipe of our group
		if( girl == 'e')
			var face = this.erinFaces.getFirstDead();
		else if( girl == 'a')
			var face = this.abbieFaces.getFirstDead();
		else
			var face = this.colleenFaces.getFirstDead();
		
		// Set the new position of the pipe
		face.reset(x,y);
		
		//Add velocity to the pipe to make it move left
		face.body.velocity.x = -200;
		
		//kill the pipe when it's no longer visible
		face.checkWorldBounds = true;
		face.outOfBoundsKill = true;		
		
	
	},
	
	addRowOfPipes: function() {
		//Pick where the hole will be
		var hole = Math.floor(Math.random() * 5) + 1;
		
		//Add the 6 pipes
		
		
		//this selects which girls face it will use	
		var face = this.array[Math.floor(Math.random() * this.array.length)];
		
		for (var i = 0; i < 10; i++)
				
				if (i == hole -2 || i == hole + 2) //This works
					this.addOneFace(400, i * 50, face );
				else if (i != hole && i != hole +1 && i != hole -1) //Made the opening bigger
					this.addOnePipe(400, i * 50 ); //this determines how far apart they are with gaps
					
		this.score += 1;
		this.labelScore.text = this.score;
	},

	hitPipe: function() {
		// If the bird already hit a pipe, we have nothing to do
		if(this.bird.alive == false)
			return;
		// Set the alive property of the bird to false
		this.bird.alive = false;
		// Prevent new pipes from appearing
		game.time.events.remove(this.timer);
		//Go through all the pipes, and stop their movement
		this.pipes.forEachAlive(function(p){
				p.body.velocity.x = 0;
				}, this);
		this.colleenFaces.forEachAlive(function(p){
				p.body.velocity.x = 0;
				}, this);		
		this.erinFaces.forEachAlive(function(p){
				p.body.velocity.x = 0;
				}, this);				
		this.abbieFaces.forEachAlive(function(p){
				p.body.velocity.x = 0;
				}, this);						
				
	
	},


};

var menuState = {

	preload: function() {
		//This function will be executed at the beginning
		// That's where we load the game's assets
	
		
		// Change the background color of the game
		
		  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			game.scale.setScreenSize(true);
	  	game.stage.backgroundColor = '#FF66FF';
		
			game.load.image('jess_menu','assets/jess_menu.png');
  		game.load.image('erin_menu', 'assets/erin_menu.png')
 			game.load.image('colleen_menu', 'assets/colleen_menu.png')
  		game.load.image('abbie_menu', 'assets/abbie_menu.png')
  
  		//Loading a title
  		game.load.image('title', 'assets/title.png');
  },		

 	create: function() {
 //		this.input.onDown.add(this.startGame(""), this);
 	
 	//	this.jess_menu = this.game.add.sprite(65,50, 'jess_menu');
 	//	this.erin_menu = this.game.add.sprite(65,150,'erin_menu')
 	//	this.colleen_menu = this.game.add.sprite(65,250, 'colleen_menu')
 	//	this.abbie_menu = this.game.add.sprite(65,350, 'abbie_menu' )
 		
 		this.title = this.game.add.sprite(20,20, 'title');
 		
 		this.jessButton = this.add.button(65, 100, 'jess_menu', this.jessGame, this);
 		this.erinButton = this.add.button(65, 200, 'erin_menu', this.erinGame, this);
 		this.colleenButton = this.add.button(65, 300, 'colleen_menu', this.colleenGame, this);
 		this.abbieButton = this.add.button(65, 400, 'abbie_menu', this.abbieGame, this);
 		
 		
 		
 	}, 
  
  jessGame: function() {
		// start the 'main' state, which restarts the game
		game.state.start('main', true, false, "jess");
	},
	erinGame: function() {
		// start the 'main' state, which restarts the game
		game.state.start('main', true, false, "erin");
	},
	colleenGame: function() {
		// start the 'main' state, which restarts the game
		game.state.start('main', true, false, "colleen");
	},
	abbieGame: function() {
		// start the 'main' state, which restarts the game
		game.state.start('main', true, false, "abbie");
	},

};


// Add and start the 'main' state to start the game

game.state.add('main', mainState);
game.state.add('menu', menuState);

game.state.start('menu');
