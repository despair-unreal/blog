import * as modelapp from './app.js';
$(document).ready(function() {
	init();
});

function init() {
	
	//滚轮事件
	var isfinish = true;
	$("section:eq(0)").bind('mousewheel', function(event) {
		var direction = event.originalEvent.wheelDelta > 0 ? 'Up' : 'Down';
		if (direction == 'Down' && isfinish == true) {
			isfinish = false;
			$("#section1").css("filter", "blur(5px)");
			setTimeout(function() {
				$("section:eq(0)").css("opacity", 0);
			}, 1500);
			setTimeout(function() {
				$("section:eq(0)").hide();
				document.documentElement.style.setProperty('--body-font-size', '14px');
				$("#loading").animate({
					opacity: 1
				}, function() {
					$("#site-name").css("opacity", 1);
					$(".site-info").css("opacity", 1);
					$(".pined-pages").css("opacity", 1);
					$("#carousel-indictors").css("opacity", 1);
					modelapp.modelLoading();
				});
			}, 2500);
		}
		return false;
	});

	//句子分开逐字插入
	var sentence_first_obj = $("#sentence_first");
	var sentence_first = sentence_first_obj.html();
	sentence_first_obj.html('');
	split_sentence(sentence_first_obj, sentence_first);
	var sentence_first_span_obj = sentence_first_obj.find("span");
	change_span(sentence_first_span_obj);

	var sentence_third_obj = $("#sentence_third");
	var sentence_third = sentence_third_obj.html();
	sentence_third_obj.html('');
	sentence_third_obj.append("<span></span>");
	split_sentence(sentence_third_obj, sentence_third);

	//siteinfo-next切换信息
	$(".site-info").hide();
	$(".site-info").eq(0).show();
	var infoIndex = 0;
	$(".site-title a").click(function() {
		var info = $(this).parent().parent().next();
		infoIndex += 1;
		if(info.prop("class") != "site-info"){
			info = $(".site-info").eq(0);
			infoIndex = 0;
		}
		$(".site-info").hide();
		info.show();
		$(".carousel-dot").removeClass("active");
		$(".carousel-dot").eq(infoIndex).addClass("active");

	});
	
	$(".carousel-dot").click(function(){
		var dotIndex = $(this).index();
		infoIndex = dotIndex;
		$(".carousel-dot").removeClass("active");
		$(this).addClass("active");
		$(".site-info").hide();
		$(".site-info").eq(dotIndex).show();
	})
	
	//延时动画设置
	var timer = (sentence_first_span_obj.length - 1) * 70 - 100;
	setTimeout(function() {
		$("#sentence_second").css("opacity", 0.2);
	}, timer);

	timer += 800;
	setTimeout(function() {
		$("#sentence_third").css("opacity", 0.8);
	}, timer);

	timer += 100;
	setTimeout(function() {
		$("#sentence_fourth").css("opacity", 0.2);
	}, timer);

	timer += 200;
	setTimeout(function() {
		$("#scroll").css("opacity", 1);
	}, timer);
}


//动画
function change_span(obj) {
	for (let i = 0; i < obj.length; i++) {
		setTimeout(function() {
			obj.eq(i).css("opacity", 0.8);
		}, i * 70);
		setTimeout(function() {
			obj.eq(i).css("text-shadow", "#fff 0 0 0px");
		}, i * 60 + 1500);
	}
}

//分割句子
function split_sentence(obj, sentence) {
	var sentence_arr = sentence.split('');
	for (let i of sentence_arr) {
		obj.append("<span>" + i + "</span>");
	}
	console.log(sentence_arr);
}
