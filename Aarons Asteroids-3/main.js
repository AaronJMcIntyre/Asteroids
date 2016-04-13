var grass = document.createElement("img");
grass.src = "grass.png";
var background = [];
for(var y=0;y<15;y++)
{
	background[y] = [];
	for(var x=0; x<30; x++)
		background[y][x] = grass;
}



var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;

var gameState = STATE_SPLASH;



var splashTimer = 3;
function runSplash(deltaTime)
{
splashTimer -= deltaTime;
if(splashTimer <= 0)
{
gameState = STATE_GAME;
return;
}
context.fillStyle = "#ccc";
context.font = "96px Arial";
context.fillText("Asteroids...", 270, 160);
}	



function runGame(deltaTime)
{
	if(player.isDead == true)
	{
		gameOverTimer -= deltaTime;
		if (gameOverTimer <= 0)
		{
		gameState = STATE_GAMEOVER;
		
		}
	
	}
	
	//Draws the tiled background
	//Draw first so everything is drawn on top
	for(var y=0; y<15; y++)
	{
		for(var x=0; x<30; x++)
		{
			context.drawImage(background[y][x], x*32, y*32);
		}	
		
	}
	if(player.isDead ==false)
	{
if(shoot == true && shootTimer <= 0)
{
	shootTimer+=0.3;
		playerShoot();
}
	}

// update the shoot timer
if(shootTimer > 0)
shootTimer -= deltaTime;
// update all the bullets
for(var i=0; i<bullets.length; i++)
{
bullets[i].x += bullets[i].velocityX * deltaTime;//??
bullets[i].y += bullets[i].velocityY * deltaTime;//??
}

for(var i=0; i<bullets.length; i++)
{
// check if the bullet has gone out of the screen boundaries
// and if so kill it
if(bullets[i].x < -bullets[i].width ||
bullets[i].x > SCREEN_WIDTH ||
bullets[i].y < -bullets[i].height ||
bullets[i].y > SCREEN_HEIGHT)
{
// remove 1 element at position i
bullets.splice(i, 1);
// because we are deleting elements from the middle of the
// array, we can only remove 1 at a time. So, as soon as we
// remove 1 bullet stop.
break;
}
}
// draw all the bullets
for(var i=0; i<bullets.length; i++)
{
context.drawImage(bullets[i].image,
bullets[i].x - bullets[i].width/2,
bullets[i].y - bullets[i].height/2);
}

 


// update all the asterioids in the asteroids array
for(var i=0; i<asteroids.length; i++)
{
// update the asteroids position according to its current velocity.
// TODO: Dont forget to multiply by deltaTime to get a constant speed

asteroids[i].x = asteroids[i].x + asteroids[i].velocityX * deltaTime;//??
asteroids[i].y = asteroids[i].y + asteroids[i].velocityY * deltaTime;//??

//-?
if(asteroids[i].x < -asteroids[i].width)
{ 
   asteroids[i].x = SCREEN_WIDTH
}
if(asteroids[i].x > SCREEN_WIDTH)
{
	asteroids[i].x = -asteroids[i].width
}
if(asteroids[i].y < -asteroids[i].height)
{
	asteroids[i].y = SCREEN_HEIGHT
}
if(asteroids[i].y > SCREEN_HEIGHT)
{
	asteroids[i].y = -asteroids[i].height
}
// Check if the asteroid has gone out of the screen boundaries
// If so, wrap the astroid around the screen so it comes back from the
// other side

}
// draw all the asteroids
for(var i=0; i<asteroids.length; i++)
{
context.drawImage(asteroids[i].image, asteroids[i].x, asteroids[i].y);
}
spawnTimer -= deltaTime;
if(spawnTimer <= 0)
{
spawnTimer = 1;
spawnAsteroid();
}






// calculate sin and cos for the player's current rotation
var s = Math.sin(player.rotation);
var c = Math.cos(player.rotation);
// figure out what the player's velocity will be based on the current rotation
// (so that if the ship is moving forward, then it will move forward according to its
// rotation. Without this, the ship would just move up the screen when we pressed 'up',
// regardless of which way it was rotated)
// for an explanation of this formula, see http://en.wikipedia.org/wiki/Rotation_matrix
var xDir = (player.directionX * c) - (player.directionY * s);
var yDir = (player.directionX * s) + (player.directionY * c);
var xVel = xDir * PLAYER_SPEED;
var yVel = yDir * PLAYER_SPEED;





if(player.isDead == false)
{
player.x += xVel * deltaTime;//??
player.y += yVel * deltaTime;//??
player.rotation += player.angularDirection * PLAYER_TURN_SPEED * deltaTime;//??
context.save();
context.translate(player.x, player.y);
context.rotate(player.rotation);
context.drawImage(
player.image, -player.width/2, -player.height/2);
context.restore();
}

if(player.x < -player.width)
{ 
   player.x = SCREEN_WIDTH
}
if(player.x > SCREEN_WIDTH)
{
	player.x = -player.width
}
if(player.y < -player.height)
{
	player.y = SCREEN_HEIGHT
}
if(player.y > SCREEN_HEIGHT)
{
    player.y = -player.height
}


/////
for(var i=0; i<asteroids.length; i++)
{
   if(player.isDead == false)
   {
      if(intersects(
             player.x - player.width/2, player.y -
             player.height/2,
             player.width, player.height,
             asteroids[i].x - asteroids[i].width/2, asteroids[i].y -
                 asteroids[i].height/2,
             asteroids[i].width, asteroids[i].height) == true)
         {
             asteroids.splice(i, 1);
             player.isDead = true
             break;
         }
        

   }

}




//////


// check if any bullet intersects any asteroid. If so, kill them both

for(var i=0; i<asteroids.length; i++)
{
   for(var j=0; j<bullets.length; j++)
   {
      if(intersects(
             bullets[j].x - bullets[j].width/2, bullets[j].y -
             bullets[j].height/2,
             bullets[j].width, bullets[j].height,
             asteroids[i].x - asteroids[i].width/2, asteroids[i].y -
                 asteroids[i].height/2,
             asteroids[i].width, asteroids[i].height) == true)
         {
             asteroids.splice(i, 1);
             bullets.splice(j, 1);
			 playerscore += 1;
             break;
         }
    }
}

context.fillStyle = 'rgba (55, 55, 55, 0.75)';
context.fillRect(10, 10, 60, 60);
context.fillStyle = "white";
context.font = "48px Arial";
context.textBaseline = "top";
context.fillText(playerscore, 10, 10);
}


var gameOverTimer = 2;
function runGameOver(deltaTime)
{
	{
		if(gameOverTimer ==0)
		{	
		gameState = STATE_GAMEOVER;
		return;
		}
	}
	
	context.fillStyle = "#FF0000";
    context.font = "96px Arial";
    context.fillText("GAMEOVER!!", 190, 140);
	context.font = "30px Arial";
	context.fillText("[Reload Page]", 400, 320);
	context.fillStyle = "#ccc";
	context.font = "70px Arial";
	context.fillText("Score "+playerscore, 370, 240);
	
}

//////broken
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");


var playerscore = 0	
	
window.addEventListener('keydown', function(evt) { onKeyDown(evt); }, false); 
window.addEventListener('keyup', function(evt) { onKeyUp(evt); }, false);

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();
function getDeltaTime() // Only call this function once per frame
{
endFrameMillis = startFrameMillis;
startFrameMillis = Date.now();
var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
if (deltaTime > 1) // validate that the delta is within range
{
deltaTime = 1;
}
return deltaTime;
}

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;
var ASTEROID_SPEED = 120;
var PLAYER_SPEED = 180;
var PLAYER_TURN_SPEED = 3;
var BULLET_SPEED = 360;


// this creates the player object and assigns it some properties
var player = {
  image: document.createElement("img"),
  x: SCREEN_WIDTH/2,
  y: SCREEN_HEIGHT/2,
  width: 93,//93
  height: 65,//80
  directionX: 0,
  directionY: 0,
 angularDirection: 0,
  rotation: 0,
  isDead: false
  
};
player.image.src = "ship.png";


var asteroids = [];

function rand(floor, ceil)
{
return Math.floor( (Math.random()* (ceil-floor)) +floor );
}
// Create a new random asteroid and add it to our asteroids array.
// We'll give the asteroid a random position (just off screen) and
// set it moving towards the center of the screen
function spawnAsteroid()
{
// make a random variable to specify which asteroid image to use
// (small, mediam or large)
var type = rand(0, 3);
// create the new asteroid
var asteroid = {};
asteroid.image = document.createElement("img");
asteroid.image.src = "rock_large.png";
asteroid.width = 46;//69
asteroid.height = 60;//75
// to set a random position just off screen, we'll start at the centre of the
// screen then move in a random direction by the width of the screen
var x = SCREEN_WIDTH/2;
var y = SCREEN_HEIGHT/2;
var dirX = rand(-10,10);
var dirY = rand(-10,10);
// 'normalize' the direction (the hypotenuse of the triangle formed
// by x,y will equal 1)
var magnitude = (dirX * dirX) + (dirY * dirY);
if(magnitude != 0)
{
var oneOverMag = 1 / Math.sqrt(magnitude);
dirX *= oneOverMag;
dirY *= oneOverMag;
}
// now we can multiply the dirX/Y by the screen width to move that amount from
// the centre of the screen
var movX = dirX * SCREEN_WIDTH;
var movY = dirY * SCREEN_HEIGHT;
// add the direction to the original position to get the starting position of the
// asteroid
asteroid.x = x + movX;
asteroid.y = y + movY;
// now, the easy way to set the velocity so that the asteroid moves towards the
// centre of the screen is to just reverse the direction we found earlier
asteroid.velocityX = -dirX * ASTEROID_SPEED;
asteroid.velocityY = -dirY * ASTEROID_SPEED;
// finally we can add our new asteroid to the end of our asteroids array
asteroids.push(asteroid);
}


var shoot = false;

var bullets = [];



function playerShoot()
{
   var bullet = {
image: document.createElement("img"),
x: player.x,
y: player.y,
width: 13,//5
height: 13,//5
velocityX: 0,
velocityY: 0
};
bullet.image.src = "bullet.png";
// start off with a velocity that shoots the bullet straight up
var velX = 0;
var velY = 1;
// now rotate this vector acording to the ship's current rotation
var s = Math.sin(player.rotation);
var c = Math.cos(player.rotation);
// for an explanation of this formula,
// see http://en.wikipedia.org/wiki/Rotation_matrix
var xVel = (velX * c) - (velY * s);
var yVel = (velX * s) + (velY * c);
bullet.velocityX = xVel * BULLET_SPEED;
bullet.velocityY = yVel * BULLET_SPEED;
// finally, add the bullet to the bullets array
bullets.push(bullet);

}
var KEY_ENTER = 13;
var KEY_SPACE = 32;
var KEY_LEFT = 37;
var KEY_UP = 38;
var KEY_RIGHT = 39;
var KEY_DOWN = 40;
var KEY_ESCAPE = 27;
var shootTimer = 0;
function onKeyDown(event)
{
	
	if(event.keyCode==KEY_SPACE)
	{
		shoot =true;
	}
if(event.keyCode == KEY_UP)
{
player.directionY = 1;
}
if(event.keyCode == KEY_DOWN)
{
player.directionY = -1;
}
if(event.keyCode == KEY_LEFT)
{
player.angularDirection = -1;
}
if(event.keyCode == KEY_RIGHT)
{
player.angularDirection = 1;
}
if(event.keyCode == KEY_ESCAPE)
{
	isPaused = !isPaused;
	if(isPaused == false)
	{
		getDeltaTime();
	}
}

}
function onKeyUp(event)

{
	if(event.keyCode==KEY_SPACE)
	{
	shoot =false;	
	}
if(event.keyCode == KEY_UP)
{
player.directionY = 0;
}
if(event.keyCode == KEY_DOWN)
{
player.directionY = 0;
}
if(event.keyCode == KEY_LEFT)
{
player.angularDirection = 0;
}
if(event.keyCode == KEY_RIGHT)
{
player.angularDirection = 0;
}

}

function intersects(x1, y1, w1, h1, x2, y2, w2, h2)
{
if(y2 + h2 < y1 ||
x2 + w2 < x1 ||
x2 > x1 + w1 ||
y2 > y1 + h1)
{
return false;
}
return true;
}

var spawnTimer = 0;

var isPaused = false;
function run()
{
	if(isPaused)
	{
		return;
	}
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
	
	var deltaTime = getDeltaTime();
	
	
	 switch(gameState)
	{
		case STATE_SPLASH:
		runSplash(deltaTime);
		break;
		case STATE_GAME:
		runGame(deltaTime);
		break;
		case STATE_GAMEOVER:
		runGameOver(deltaTime);
		break;
	}

	
}
//-------------------- Don't modify anything below here
(function() {
var onEachFrame;
if (window.requestAnimationFrame) {
onEachFrame = function(cb) {
var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
 _cb();
};
} else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb();
window.mozRequestAnimationFrame(_cb); } 
_cb();
};
} else {
onEachFrame = function(cb) { 
setInterval(cb, 1000 / 60);
} 
}
window.onEachFrame = onEachFrame;
 })();

window.onEachFrame (run);