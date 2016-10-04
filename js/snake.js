var size = 15; //每格大小
var score = 0; //得分(即吃掉目标数)
var time = 0; //耗时
var direct = 1; //当前方向 right:1 left:2 down:3 up:4
var oldDirect = 1;  //记录前一个方向
var gameStatus = 0; //游戏状态 stop:0 start:1
var snakeLength = 1; //蛇身长度
var step = 15;
var speed = 500; //蛇的移动速度由游戏等级决定，easy:1500 normal:1000 difficult:500
var snakePosition = new Array();
var aimPosition;
var isStart = true; //能否开始游戏

var levelItem = document.getElementById('gameLevel-list').getElementsByTagName('li');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var snakeTime = document.getElementById('time');
var snakeScore = document.getElementById('score');
var snakeLen = document.getElementById('length');


window.onload = function() {
	for (var i = 0; i < levelItem.length; i++) {
		levelItem[i].index = i+1;
		levelItem[i].onclick = function(event) {
			if (isStart) {
				levelSelect(event);
			}
		}
	}

	document.onkeyup = function(event) {
		getKey(event);
	}

	document.getElementById('startBtn').onclick = function(event){
		if (isStart) { //触发游戏开始状态
			event.target.innerText = 'pause';
			initGame();
		} else if (gameStatus) { //触发游戏暂停状态
			event.target.innerText = 'continue';
			gameStatus = 0;
		} else {
			event.target.innerText = 'pause'; //触发游戏继续状态
			gameStatus = 1;
			game();
		}
	}
}


/* 清空指定某个格子 */
var clearPoint = function(x,y) {
	context.clearRect(x,y,15,15);
}


/* 初始化snake的位置，并绘出snake */
var initSnakePosition = function() {
	var pos = {x:60,y:30};
	snakePosition.push(pos);
	paintSnake1();
}


var paintSnake1 = function() {
	context.fillStyle = '#F78686';
	context.fillRect(snakePosition[0].x,snakePosition[0].y,size,size);
}


var paintSnake2 = function() {
	context.fillStyle = '#2B2B2B';
	context.fillRect(snakePosition[1].x,snakePosition[1].y,size,size);
}


var setAimPosition = function() {
	var x,y;
	var isSet = true; //判断(x,y)坐标点能否成为目标物的坐标点，能:true 不能：false
	while(1) {
		x = Math.round(Math.random()*585);
		y = Math.round(Math.random()*285);
		if (x % 15 != 0) {
			x = x + (15 - x%15);
		}
		if (y % 15 != 0) {
			y = y + (15 - y%15);
		}
		for (var i = 0; i < snakePosition.length; i++) {
			if (snakePosition[i].x == x && snakePosition[i].y == y) {
				isSet = false;
			}
		}
		if (isSet) { break; }
	}
	aimPosition = {x:x,y:y};
	context.fillStyle = '#F9D0D7';
	context.fillRect(aimPosition.x,aimPosition.y,size,size);
}


/* 选择等级，高亮选中等级选项，并改变speed */
var levelSelect = function(event) {
	var obj = event.target; 
	var index = obj.index;
	speed = (4-index)*200;
	for (var i = 0; i < levelItem.length; i++) {
		levelItem[i].className = 'gameLevel';
	}
	levelItem[index-1].className = 'gameLevel selected';
}


/* 获取用户按的是哪个按键，若为方向键，则将direct设为相应方向，否则不改变方向 */
var getKey = function(event) {
	oldDirect = direct;
	switch(event.keyCode) {
		case 37: //left
			direct = 2;
			break;
		case 38: //up
			direct = 4;
			break;
		case 39: //right
			direct = 1;
			break;
		case 40: //down
			direct = 3;
			break;
		default: //other
			break;
	}
	if ((oldDirect == 1&&direct == 2)||(oldDirect == 2&&direct == 1)||(oldDirect == 3&&direct == 4)||(oldDirect == 4&&direct == 3)) {
		direct = oldDirect;
	}
}

var initGame = function() {
	score = 0;
	time = 0;
	direct = 1;
	gameStatus = 1;
	snakeLength = 1;
	isStart = false;
	document.getElementById('time').innerText = time;
	document.getElementById('score').innerText = score;
	document.getElementById('length').innerText = snakeLength;
	context.clearRect(0,0,600,300);
	setAimPosition();
	snakePosition = null;
	snakePosition = new Array();
	initSnakePosition();
	game();
}

var game = function() {
	if (!gameStatus) {
		return false;
	}
	var isFail = false;  //判断游戏是否失败
	var isGetAim = false; //判断是否吃到目标物
	var tempPoint = {x:snakePosition[0].x,y:snakePosition[0].y};
	console.log(aimPosition.x +'-'+ aimPosition.y);
	console.log(tempPoint.x +'*'+ tempPoint.y);
	console.log(speed);
	switch(direct) {
		case 1:
			tempPoint.x += step;
			if (tempPoint.x > 585) {
				isFail = true;
			}
			break;
		case 2:
			tempPoint.x -= step;
			if (tempPoint.x < 0) {
				isFail = true;
			}
			break;
		case 3:
			tempPoint.y += step;
			if (tempPoint.y > 285) {
				isFail = true;
			}
			break;
		case 4:
			tempPoint.y -= step;
			if (tempPoint.y < 0) {
				isFail = true;
			}
	}

	if (!isFail) {
		if (tempPoint.x == aimPosition.x && tempPoint.y == aimPosition.y) {
			isGetAim = true;
			score++;
			snakeLength++;
			clearPoint(aimPosition.x,aimPosition.y);
			setAimPosition();
		}
	}

	if (!isFail) {
		for (var i = 0, len = snakePosition.length-1; i < len ; i++) {
			if (tempPoint.x == snakePosition[i].x && tempPoint.y == snakePosition[i].y) {
				isFail = true;
				break;
			}
		}
	}

	if (!isFail) {
		snakePosition.splice(0,0,tempPoint);
		paintSnake1();
		clearPoint(snakePosition[1].x,snakePosition[1].y);
		paintSnake2();
		if (!isGetAim) {
			clearPoint(snakePosition[snakePosition.length-1].x,snakePosition[snakePosition.length-1].y);
			snakePosition.pop();
		}
	}

	if (isFail) {
		gameStatus = 0;
		context.clearRect(0,0,600,300);
		context.fillStyle = '#F78686';
		context.font = '50px SimHei';
		context.textBaseline = 'middle';
		var txt = 'GameOver';
		context.fillText(txt,200,100);
		isStart = true;
		document.getElementById('startBtn').innerText = 'Restart Game';
	}

	time += speed;
	snakeTime.innerText = parseInt(time/1000);
	
	snakeScore.innerText = score;
	snakeLen.innerText = snakeLength;

	if (gameStatus) {
		setTimeout('game()',speed);
	}
}