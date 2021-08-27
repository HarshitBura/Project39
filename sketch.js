var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var bg;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  bg = loadImage("wallpaper-hd-for-desktop-full-screen-background-full-screen-hd-177237661.jpg")
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
   createCanvas(displayWidth - 20, displayHeight-30);

  var message = "This is a message";
 console.log(displayWidth)
 console.log(camera.position.x) 
  trex = createSprite(camera.position.x, camera.position.y,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  trex.velocityX=2;
  trex.scale = 2;
  

  
 
  
 

  invisibleGround = createSprite(displayWidth-10000000, displayHeight-90,20000000,10);
  invisibleGround.visible = true;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = true
  
  score = 0;

}

function draw() {
  
  background(bg);
  //displaying score
  textSize(50)
  text("Score: "+ score, camera.position.x,camera.position.y-300);
  
  
  if(gameState === PLAY){

 
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    invisibleGround.velocityX=-1;

    if (invisibleGround.x < 900){
      invisibleGround.x = invisibleGround.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 500) {
        trex.velocityY = -30;
        jumpSound.play();
    }
    trex.velocityX=2;
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
if (displayWidth-trex.x <386){
  camera.position.x=trex.x
}
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
    
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     trex.velocityX=0;
     trex.x=5;
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  

  drawSprites();
}




function spawnObstacles(){
 if (frameCount % 150 === 0){
   var obstacle = createSprite(camera.position.x+1000,displayHeight-150,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 2;
    obstacle.lifetime = 500;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {
    var cloud = createSprite(camera.position.x+1000,displayHeight-100,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 2;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

