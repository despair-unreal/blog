import * as nav from './nav.js';
var pageHeaderVm1 = new Vue({
	el: '#page-header',
	data: {
		isHeader1: 0,
		postsList: {}
	},
	components: {
		'nav-component': httpVueLoader('./components/nav.vue'),
		'sidebar-component': httpVueLoader('./components/sidebar.vue'),
		//'commentsSubmit-component': httpVueLoader('./components/commentsSubmit.vue'),
		'search-component': httpVueLoader('./components/search.vue'),
	},
	updated: function() {
		nav.navjs();
		nav.sidebarjs();
	},
});
var pageHeaderVm2 = new Vue({
	el: '.not-top-img',
	data: {
		isHeader2: 0
	},
	components: {
		'nav-component': httpVueLoader('./components/nav.vue'),
		'sidebar-component': httpVueLoader('./components/sidebar.vue'),
		'search-component': httpVueLoader('./components/search.vue'),
	},
	updated: function() {
		nav.navjs();
		nav.sidebarjs();
	},
});
var tkSubmitVm = new Vue({
	el: '#tk-submit',
	data: {
		pid: null,
		loginstatus: null,
		userinfo: {}
	},
	mounted: function() {
		var that = this;
		$("#form").load(function() {
			var text = $(this).contents().find("body").text(); //获取到的是json的字符串
			var j = $.parseJSON(text); //json字符串转换成json对象
			tkCommentsVm.commentList = j;
		})

		axios
			.get('/getLoginStatus')
			.then(response => {
				this.loginstatus = response.data;
				tkCommentsVm.loginstatus = this.loginstatus;
				if (this.loginstatus != '') {
					axios
						.get('/getUserInfo', {
							params: {
								id: this.loginstatus
							}
						})
						.then(response1 => {
							this.userinfo = response1.data;
							tkCommentsVm.userinfo = this.userinfo;
						})
						.catch(function(error1) { // 请求失败处理
							console.log(error1);
						});
				}
			})
			.catch(function(error) { // 请求失败处理
				console.log(error);
			});
	},
	components: {
		'commentsubmit-component': httpVueLoader('./components/commentsSubmit.vue')
	}
});

var postInfo = new Vue({
	el: '#post-info',
	data: {
		postid: null,
		postsList: {},
		isHeader3: 1
	},
	mounted: function() {
		axios
			.get('/postsDetail', {
				params: {
					id: this.postid
				}
			})
			.then(response => {
				this.postsList = response.data[0];
				if (this.postsList.articleCover != null) {
					pageHeaderVm1.isHeader1 = 1;
					pageHeaderVm1.postsList = response.data[0];
					this.isHeader3 = 0;
				} else {
					pageHeaderVm2.isHeader2 = 1;
					$("main #post-info").show();
				}
				articleContainerVm.postContent = this.postsList.content;
			})
			.catch(function(error) { // 请求失败处理
				console.log(error);
			});
	},
	beforeMount: function() {
		var searchURL = window.location.search;
		searchURL = searchURL.substring(1, searchURL.length);
		var targetPageId = searchURL.split("&")[0].split("=")[1];
		this.postid = targetPageId;
	},
	updated: function() {
		var updatedTime = this.getDistanceMonth(this.postsList.updateTime, this.CurentTime());
		if (updatedTime == 0)
			$(".post-meta-date time").html("本月");
		else
			$(".post-meta-date time").html(updatedTime + "个月前");
		postInfo1.postsList = this.postsList;
		tkSubmitVm.pid = this.postid;
	},
	methods: {
		getDistanceMonth: function(startTime, endTime) {
			startTime = new Date(startTime)
			endTime = new Date(endTime)
			var dateToMonth = 0
			var startDate = startTime.getDate() + startTime.getHours() / 24 + startTime.getMinutes() /
				24 /
				60;
			var endDate = endTime.getDate() + endTime.getHours() / 24 + endTime.getMinutes() / 24 / 60;
			if (endDate >= startDate) {
				dateToMonth = 0
			} else {
				dateToMonth = -1
			}
			let yearToMonth = (endTime.getYear() - startTime.getYear()) * 12
			let monthToMonth = endTime.getMonth() - startTime.getMonth()
			return yearToMonth + monthToMonth + dateToMonth;
		},
		CurentTime: function() {
			var now = new Date();
			var year = now.getFullYear(); //年
			var month = now.getMonth() + 1; //月
			var day = now.getDate(); //日
			var hh = now.getHours(); //时
			var mm = now.getMinutes(); //分
			var clock = year + "-";
			if (month < 10)
				clock += "0";
			clock += month + "-";
			if (day < 10)
				clock += "0";
			clock += day + " ";
			if (hh < 10)
				clock += "0";
			clock += hh + ":";
			if (mm < 10) clock += '0';
			clock += mm;
			return (clock);
		}
	}
});
var postInfo1 = new Vue({
	el: '.post-info2',
	data: {
		postsList: null
	},
	mounted: function() {
		this.postsList = postInfo.postsList
	}
});
var articleContainerVm = new Vue({
	el: '#article-container',
	data: {
		postContent: null
	},
	updated: function() {
		asideContentVm.tocTop();
	}
});
var tagShareVm = new Vue({
	el: '.tag_share',
	data: {
		tagname: []
	},
	mounted: function() {
		axios
			.get('/postsTags', {
				params: {
					id: postInfo.postid
				}
			})
			.then(response => {
				this.tagname = response.data;
			})
			.catch(function(error) { // 请求失败处理
				console.log(error);
			});
	}
});
var paginationVm = new Vue({
	el: '#pagination',
	data: {
		prevPost: {},
		nextPost: {}
	},
	mounted: function() {
		axios
			.get('/pagination', {
				params: {
					id: postInfo.postid
				}
			})
			.then(response => {
				if (response.data.length == 1) {
					if (postInfo.postid > response.data[0].id) {
						this.prevPost = response.data[0];
					} else {
						this.nextPost = response.data[0];
					}
				} else if (response.data.length == 2) {
					if (response.data[0].id > response.data[1].id) {
						this.nextPost = response.data[0];
						this.prevPost = response.data[1];
					} else {
						this.nextPost = response.data[1];
						this.prevPost = response.data[0];
					}
				}
			})
			.catch(function(error) { // 请求失败处理
				console.log(error);
			});
	},
	updated: function() {
		if (this.nextPost.id != undefined && this.prevPost.id == undefined) {
			$(".next-post").addClass("pull-full");
		} else if (this.prevPost.id != undefined && this.nextPost.id == undefined) {
			$(".prev-post").addClass("pull-full");
		} else if (this.nextPost.id != undefined && this.prevPost.id != undefined) {
			$(".next-post").addClass("pull-right");
			$(".prev-post").addClass("pull-left");
		}
	}
});
var asideContentVm = new Vue({
	el: '#aside-content',
	data: {
		tocList: [],
		percentage: 0,
		posarr1: [],
		posarr2: [],
		lev: 1
	},
	methods: {
		onto: function(id, index) {
			var pos = $(id).offset().top;
			this.percentage = Math.floor((pos - $("#post").offset().top) / 10);
			$('body, html').animate({
				scrollTop: pos
			});
			/*$(".toc>.toc-item>a").removeClass("active");
			$(".toc>.toc-item").eq(index).find("a").eq(0).addClass("active");
			$(".toc>.toc-item").removeClass("active");
			$(".toc-child .toc-link").removeClass("active");
			$(".toc>.toc-item").eq(index).addClass("active");*/
		},
		handleScroll: function() {
			this.posarr();
			var percentageNum = Math.floor(($("body, html").scrollTop() - $("#post").offset().top) / 10);
			if (percentageNum >= 0)
				this.percentage = percentageNum;
			for (let i = 0; i < this.posarr1.length; i++) {
				if (this.percentage >= this.posarr1[i] - 20 && this.percentage <= this.posarr1[i + 1] -
					20 || this
					.percentage >= this.posarr1[this.posarr1.length - 1] - 20) {
					$(".toc>.toc-item>a").removeClass("active");
					$(".toc>.toc-item").eq(i).find("a").eq(0).addClass("active");
					$(".toc>.toc-item").removeClass("active");
					$(".toc-child .toc-link").removeClass("active");
					$(".toc>.toc-item").eq(i).addClass("active");
				}
				if (this.percentage < this.posarr1[0]) {
					$(".toc>.toc-item>a").removeClass("active");
					$(".toc>.toc-item").removeClass("active");
					$(".toc-child .toc-link").removeClass("active");
				}
			}
			for (let i = 0; i < this.posarr2.length; i++) {
				if (this.percentage >= this.posarr2[i] - 20 && this.percentage <= this.posarr2[i + 1] -
					20 || this
					.percentage >= this.posarr2[this.posarr2.length - 1] - 10) {
					$(".toc-child .toc-link").removeClass("active");
					$(".toc-child .toc-link").eq(i).addClass("active");
				}
			}
		},
		posarr: function() {
			var pos1, pos2;
			var levl = this.lev;
			this.posarr1 = [];
			this.posarr2 = [];
			for (var i = 0; i < $("#article-container").children().length; i++) {
				// 获取带H的标签
				var el = $("#article-container").children().eq(i);
				if (el.prop("localName").indexOf('h') !== -1) {
					if (levl == parseInt(el.prop("localName").substring(1))) {
						pos1 = Math.floor(($("#" + $("#article-container").children().eq(i).prop("id"))
							.offset().top - $("#post").offset().top) / 10);
						this.posarr1.push(pos1);
					} else {
						if (this.tocList.length != 0) {
							pos2 = Math.floor(($("#" + $("#article-container").children().eq(i).prop("id"))
								.offset().top - $("#post").offset().top) / 10);
							this.posarr2.push(pos2);
						} else
							continue;
					}
				}
			}
		},
		tocTop: function() {
			var toc = [];
			var levl = null;
			for (var i = 0; i < $("#article-container").children().length; i++) {
				// 获取带H的标签
				var el = $("#article-container").children().eq(i);
				if (el.prop("localName").indexOf('h') !== -1) {
					if (levl == null || levl > parseInt(el.prop("localName").substring(1))) {
						levl = parseInt(el.prop("localName").substring(1));
					}
				}
			}
			this.lev = levl;
			for (var i = 0; i < $("#article-container").children().length; i++) {
				// 获取带H的标签
				var el = $("#article-container").children().eq(i);
				if (el.prop("localName").indexOf('h') !== -1) {
					if (levl == parseInt(el.prop("localName").substring(1))) {
						toc.push({
							"title": $("#article-container").children().eq(i).text(),
							"id": "#" + $("#article-container").children().eq(i).prop("id"),
							"child": []
						});
					} else {
						if (toc.length != 0) {
							toc[toc.length - 1].child.push({
								"title": $("#article-container").children().eq(i).text(),
								"id": "#" + $("#article-container").children().eq(i).prop("id")
							});
						} else
							continue;
					}
				}
			}
			this.tocList = toc;
		}
	},
	mounted: function() {
		window.addEventListener('scroll', this.handleScroll, true);
		axios
			.get('/postsTags', {
				params: {
					id: postInfo.postid
				}
			})
			.then(response => {
				this.tagname = response.data;
			})
			.catch(function(error) { // 请求失败处理
				console.log(error);
			});
	},
	computed: {
		progressPercentage: function() {
			return Math.floor(this.percentage / 10);
		}
	}
});
var tkCommentsVm = new Vue({
	el: ".tk-comments-container",
	data: {
		pid: postInfo.postid,
		commentList: [],
		loginstatus: tkSubmitVm.loginstatus,
		userinfo: tkSubmitVm.userinfo,
		actionUrl: "/commentSubmit2"
	},
	components: {
		'comment-component': httpVueLoader('./components/comment.vue')
	},
	mounted: function() {
		axios
			.get('/queryComment', {
				params: {
					pid: postInfo.postid
				}
			})
			.then(response => {
				this.commentList = response.data;
			})
			.catch(function(error) { // 请求失败处理
				console.log(error);
			});
	}
})
