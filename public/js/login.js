//定义画布宽高和生成点的个数
var WIDTH = window.innerWidth,
	HEIGHT = window.innerHeight,
	POINT = 35;

var canvas = document.getElementById('Mycanvas');
canvas.width = WIDTH,
	canvas.height = HEIGHT;
var context = canvas.getContext('2d');
context.strokeStyle = 'rgba(0,0,0,0.02)',
	context.strokeWidth = 1,
	context.fillStyle = 'rgba(0,0,0,0.05)';
var circleArr = [];

//线条：开始xy坐标，结束xy坐标，线条透明度
function Line(x, y, _x, _y, o) {
	this.beginX = x,
		this.beginY = y,
		this.closeX = _x,
		this.closeY = _y,
		this.o = o;
}
//点：圆心xy坐标，半径，每帧移动xy的距离
function Circle(x, y, r, moveX, moveY) {
	this.x = x,
		this.y = y,
		this.r = r,
		this.moveX = moveX,
		this.moveY = moveY;
}
//生成max和min之间的随机数
function num(max, _min) {
	var min = arguments[1] || 0;
	return Math.floor(Math.random() * (max - min + 1) + min);
}
// 绘制原点
function drawCricle(cxt, x, y, r, moveX, moveY) {
	var circle = new Circle(x, y, r, moveX, moveY)
	cxt.beginPath()
	cxt.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
	cxt.closePath()
	cxt.fill();
	return circle;
}
//绘制线条
function drawLine(cxt, x, y, _x, _y, o) {
	var line = new Line(x, y, _x, _y, o)
	cxt.beginPath()
	cxt.strokeStyle = 'rgba(0,0,0,' + o + ')'
	cxt.moveTo(line.beginX, line.beginY)
	cxt.lineTo(line.closeX, line.closeY)
	cxt.closePath()
	cxt.stroke();

}
//初始化生成原点
function init() {
	circleArr = [];
	for (var i = 0; i < POINT; i++) {
		circleArr.push(drawCricle(context, num(WIDTH), num(HEIGHT), num(15, 2), num(10, -10) / 40, num(10, -10) / 40));
	}
	draw();
}

//每帧绘制
function draw() {
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (var i = 0; i < POINT; i++) {
		drawCricle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
	}
	for (var i = 0; i < POINT; i++) {
		for (var j = 0; j < POINT; j++) {
			if (i + j < POINT) {
				var A = Math.abs(circleArr[i + j].x - circleArr[i].x),
					B = Math.abs(circleArr[i + j].y - circleArr[i].y);
				var lineLength = Math.sqrt(A * A + B * B);
				var C = 1 / lineLength * 7 - 0.009;
				var lineOpacity = C > 0.03 ? 0.03 : C;
				if (lineOpacity > 0) {
					drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i + j].x, circleArr[i + j].y,
						lineOpacity);
				}
			}
		}
	}
}

//调用执行
window.onload = function() {
	init();
	setInterval(function() {
		for (var i = 0; i < POINT; i++) {
			var cir = circleArr[i];
			cir.x += cir.moveX;
			cir.y += cir.moveY;
			if (cir.x > WIDTH) cir.x = 0;
			else if (cir.x < 0) cir.x = WIDTH;
			if (cir.y > HEIGHT) cir.y = 0;
			else if (cir.y < 0) cir.y = HEIGHT;

		}
		draw();
	}, 16);
}


$('input[type="submit"]').click(function() {
	$('.login').addClass('test');
	setTimeout(function() {
		$('.login').addClass('testtwo');
	}, 300);
	setTimeout(function() {
		$('.authent').show().animate({
			right: -320
		}, {
			easing: 'easeOutQuint',
			duration: 600,
			queue: false
		});
		$('.authent').animate({
			opacity: 1
		}, {
			duration: 200,
			queue: false
		}).addClass('visible');
	}, 500);
	setTimeout(function() {
		$('.authent').show().animate({
			right: 90
		}, {
			easing: 'easeOutQuint',
			duration: 600,
			queue: false
		});
		$('.authent').animate({
			opacity: 0,
		}, {
			duration: 200,
			queue: false
		}).addClass('visible');
		$('.login').removeClass('testtwo');
	}, 2500);
	setTimeout(function() {
		$('.login').removeClass('test');
		$('.login div').fadeOut(123);
	}, 2800);
	setTimeout(function() {
		$('.authent').hide();
		$('.success').fadeIn();
	}, 3200);
});
$('input[type="email"],input[type="password"]').focus(function() {
	$(this).prev().animate({
		'opacity': '1'
	}, 200);
});
$('input[type="email"],input[type="password"]').blur(function() {
	$(this).prev().animate({
		'opacity': '.5'
	}, 200);
});
$('input[type="email"],input[type="password"]').keyup(function() {
	if (!$(this).val() == '') {
		$(this).next().animate({
			'opacity': '1',
			'right': '30'
		}, 200);
	} else {
		$(this).next().animate({
			'opacity': '0',
			'right': '20'
		}, 200);
	}
});
var open = 0;
$('.tab').click(function() {
	$(this).fadeOut(200, function() {
		$(this).parent().animate({
			'left': '0'
		});
	});
});
