function navjs() {
	$("#search-button").click(function() {
		$("#search-mask").css("animation", "0.5s ease 0s 1 normal none running to_show");
		
		$(".search-dialog").show();
		$("#search-mask").show();
	});

	$(".search-close-button").click(function() {
		$(".search-dialog").css("animation", "0.5s ease 0s 1 normal none running search_close");
		$("#search-mask").css("animation", "0.5s ease 0s 1 normal none running to_hide");
		setTimeout(function(){
			$(".search-dialog").hide();
			$("#search-mask").hide();
			$(".search-dialog").css("animation", "titlescale .5s");
			$("#search-mask").css("animation", "none");
		},500);
	});

	$("#nav .menus_item").hover(function() {
		$(".site-page").removeClass("site-page-hover");
		$("#nav .menus_items .menus_item .menus_item_child").css("display", "none");

		$(this).find(".site-page").addClass("site-page-hover");
		$(this).find(".menus_item_child").css("display", "block");
	}, function() {
		$(".site-page").removeClass("site-page-hover");
		$("#nav .menus_items .menus_item .menus_item_child").css("display", "none");
	});
	$("#search-button").hover(function() {
		$(this).find(".site-page").addClass("site-page-hover");
	}, function() {
		$(this).find(".site-page").removeClass("site-page-hover");
	});
}

function sidebarjs() {
	$("#toggle-menu").hover(function() {
		$(this).find(".site-page").addClass("site-page-hover");
	}, function() {
		$(this).find(".site-page").removeClass("site-page-hover");
	});
	$("#toggle-menu").click(function() {
		$("#sidebar #menu-mask").css({
			"display": "block",
			"opacity": 1,
			"animation": "0.5s ease 0s 1 normal none running to_show"
		});
		$("#sidebar #sidebar-menus").addClass("open");
		$("#sidebar #menu-mask").click(function() {
			$("#sidebar #menu-mask").animate({
				opacity: 0
			}, 500, function() {
				$("#sidebar #menu-mask").css("animation", "none");
				$("#sidebar #menu-mask").hide();
			});
			$("#sidebar #sidebar-menus").removeClass("open");
		});
	});

	$("#page").bind('mousewheel', function(event) {
		var direction = event.originalEvent.wheelDelta > 0 ? 'Up' : 'Down';
		if (direction == 'Down') {
			$("#page-header").addClass("nav-fixed");
			$("#page-header").removeClass("nav-visible");
		} else if (direction == 'Up') {
			if ($(window).scrollTop() == 0) {
				$("#page-header").removeClass("nav-visible");
				$("#page-header").removeClass("nav-fixed");
			} else {
				$("#page-header").addClass("nav-visible");
			}
		}
	});
}
export {
	navjs,
	sidebarjs
}
