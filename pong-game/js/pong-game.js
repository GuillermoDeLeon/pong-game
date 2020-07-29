
var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

//find mouse position
function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt) {
	if(showWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showWinScreen = false;
	}
}

window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	
	var framesPerSecond = 30;

	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);

	canvas.addEventListener('mousedown', handleMouseClick);

//event listener that moves paddle vertically with mouse position
	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y - (PADDLE_HEIGHT/2);
		});

}

//ball reset
function ballReset() {
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		// player1Score = 0;
		// player2Score = 0;
		showWinScreen = true;
	}


	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

//right paddle AI movment
function computerMovement() {
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);

	if(paddle2YCenter < ballY - 35) {
		paddle2Y = paddle2Y + 6;
	} else if (paddle2YCenter > ballY + 35) {
		paddle2Y = paddle2Y - 6;
	}
}


function moveEverything() {
	if(showWinScreen){
		return;
	}
	computerMovement();

	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;
	//checks ball to bounce from left side of screen where paddle is located
	if(ballX < 0) {
		if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			
			player2Score += 1; //must be before ballReset() so ballReset() does not occur if reaching winning score;
			ballReset();

		}
	}

	//checks ball to bounce from right side of screen where paddle for player 2 is located
	if(ballX > canvas.width) {
		if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score += 1
			ballReset();
	
		}
	}

	//this checks and bounces ball off top and bottom of screen
	if(ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}

}

function drawNet() {
	for(var i=0; i < canvas.height; i+=40) {
		colorRect(canvas.width/2 - 1, i, 2, 20, 'white');
	}
}

function drawEverything() {

	//makes background green
	colorRect(0, 0, canvas.width, canvas.height, 'green');

	//Display which payer won after max score is reached
	if(showWinScreen){
		canvasContext.fillStyle = 'white';

		if(player1Score >= WINNING_SCORE) {
			canvasContext.fillText("Left Player Won!", 350, 200);
		} else if(player2Score >= WINNING_SCORE) {
			canvasContext.fillText("Right Player Won!", 350, 200);
			}
	}

	drawNet();

	//left player paddle
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT, 'white');

	//right player paddle
	colorRect((canvas.width-10),paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white')

	//draw pong ball
	colorCircle(ballX, ballY, 10, 'white');

	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width - 100, 100);

}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2 , true);
	canvasContext.fill();

}

function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY,width,height);

}