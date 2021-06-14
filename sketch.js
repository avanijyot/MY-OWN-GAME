//game state
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//to create the sprite objects
var player, player_running, player_collided;
var mask, maskImage, maskGroup;
var virus, virusImage, virusGroup;

var ground;
var city, cityImage;

var score = 0;
var survivalTime = 0;
var virusHit = 0;
var x, x1;

var gameover, gameoverImage;
var restart, restartImage;

//to preload images and animations
function preload(){
  
  player_running = loadAnimation("man1.png", "man2.png", "man3.png", "man4.png");
  
  player_collided = loadAnimation("manCollided.png");
  
  maskImage = loadImage("mask.png");
  
  virusImage = loadImage("virus2.png");
  
  cityImage = loadImage("background.jpg");
  
  gameoverImage = loadImage("gameover.png");
  
  restartImage = loadImage("restart.png");
  
}

function setup() {

  //to create the canvas
  createCanvas(1200, 600);

  //to create the player
    player = createSprite(500, 660, 20, 20);  
    player.addAnimation("running", player_running);
    player.addAnimation("collided", player_collided);
    player.scale = 1;

  //to create the ground
    ground = createSprite(0, 680, 1200, 10);
    ground.visible = false;

  //to create the mask and virus group
    maskGroup = new Group();
    virusGroup = new Group();
  
  //to create score
    score = 0;

  //for camera
    x = 150;
    x1 = 0;
  
  //to create survivalTime 
    survivalTIme = 0; 
  
  //to create virusHit 
    virusHit = 0;
  
  //to create gameover
    gameover = createSprite(350, 190);
    gameover.addImage("gameover", gameoverImage);
  
  //to create restart
    restart = createSprite(350, 250);
    restart.addImage("restart", restartImage);
  
  //to scale restart and gameover
    gameover.scale = 1.0;
    restart.scale = 1.0;
  
  //to change the invisibility to false 
    gameover.visible = false;
    restart.visible = false;
  
}

function draw(){ 
 
  //to give the background color
   background(cityImage);
  
  //game state PLAY
  if(gameState===PLAY){  
    
    //to make the player jump 
       if(keyDown("space") && player.y >= 159){
         player.velocityY = -12;
       }

    //to add gravity
       player.velocityY = player.velocityY + 0.8;
    
    //to spawn mask and virus group 
       spawnmask();
       spawnvirus(); 

    //camera
       camera.position.y = displayHeight/2;
       x = x + 2;
       x1 = x1 + 2;
       camera.position.x = x;
       if(camera.position.x > displayHeight/2){
         camera.position.x = displayWidth/2;
         x = 150;
         x1 = 0;

       }    
    
    //to increase the survivalTime 
       survivalTime += Math.round(frameCount / 100);
 
    //to increase the score
      if(maskGroup.isTouching(player)){
       maskGroup.destroyEach();
       score = score + 1;
      }
       switch(score){
         case 10: player.scale = 0.12;
                 break;
         case 20: player.scale = 0.14;
                 break;
         case 30: player.scale = 0.16;
                 break;
         case 40: player.scale = 0.18;
                 break;
         default: break;    
       }

    //to decrease the score
      if(virusGroup.isTouching(player)){
        virusGroup.destroyEach();
        virusHit = virusHit + 1;
        if (virusHit === 1) {
         player.scale = 0.08;
        }
        if (virusHit === 2) {
         gameState = END;
        } 
      }
   }
  
  //game state end
  else if(gameState===END){

    //to set the visibility to true
    gameover.visible = true;
    restart.visible = true;
    
    //to set the velocityY of player to 0
    player.velocityY = 0;
    
    //to destroy the virus and masks once the game ends
    virusGroup.destroyEach();
    maskGroup.destroyEach();
    
    //to change the player's animation 
    player.changeAnimation("collided", player_collided);
    
    //to restart the game
    if(mousePressedOver(restart)){

      reset();
    
    }
  
  }
  
  //to make the player collide with the ground
   player.collide(ground); 

  //to draw the objects
   drawSprites();

  //to display score
   stroke("white");
   textSize(20);
   textFont("Georgia");
   fill("white");
   text("Score : "+ score, x1+40, 30);
   text("Survival Time : "+ survivalTime, x1+160, 30 );
   text("Obtacles Hit : "+ virusHit, x1+370, 30);
  
}

//function spawn mask
function spawnmask(){  
  
  if(World.frameCount%80===0){
    mask = createSprite(-300, Math.round(random(200,400)),10,30);
    mask.addImage("mask",maskImage);
    mask.scale = 0.08;
    mask.velocityX = (10 + 3 * score / 100);
    mask.lifetime = 300;
    maskGroup.add(mask);   
    mask.setCollider("rectangle", 0, 0, 100, 100);
    mask.depth = player.depth;
    player.depth = player.depth + 1;
  }
  
}

//function spawn virus 
function spawnvirus(){
  
  if(World.frameCount%300===0){
    virus = createSprite(-300,320,10,40);
    virus.addImage("virus",virusImage);
    virus.scale = 0.02;
    virus.velocityX = (10 + 3 * score / 10);       
    virus.lifetime = 300;
    virusGroup.add(virus);
    virus.setCollider("rectangle", 0, 0, 300, 300);
  }
  
}

//function reset
function reset(){
  
  gameState = PLAY; 
  
  gameover.visible = false;
  restart.visible = false;
  
  maskGroup.destroyEach();
  virusGroup.destroyEach();
  
  player.changeAnimation("running", player_running);
  
  score = 0;
  virusHit = 0;
  survivalTime = 0;
  
  player.scale = 0.1;
  
}