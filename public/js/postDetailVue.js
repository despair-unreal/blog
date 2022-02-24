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
	updated: function () {
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
	updated: function () {
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
	mounted: function () {
		var that = this;
		$("#form").load(function () {
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
						.catch(function (error1) { // 请求失败处理
							console.log(error1);
						});
				}
			})
			.catch(function (error) { // 请求失败处理
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
	mounted: function () {
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
			.catch(function (error) { // 请求失败处理
				console.log(error);
			});
	},
	beforeMount: function () {
		var searchURL = window.location.search;
		searchURL = searchURL.substring(1, searchURL.length);
		var targetPageId = searchURL.split("&")[0].split("=")[1];
		this.postid = targetPageId;
	},
	updated: function () {
		var updatedTime = this.getDistanceMonth(this.postsList.updateTime, this.CurentTime());
		if (updatedTime == 0)
			$(".post-meta-date time").html("本月");
		else
			$(".post-meta-date time").html(updatedTime + "个月前");
		postInfo1.postsList = this.postsList;
		tkSubmitVm.pid = this.postid;
	},
	methods: {
		getDistanceMonth: function (startTime, endTime) {
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
		CurentTime: function () {
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
	mounted: function () {
		this.postsList = postInfo.postsList
	}
});
var articleContainerVm = new Vue({
	el: '#article-container',
	data: {
		postContent: null
	},
	updated: function () {
		asideContentVm.tocTop();
		asideContentVm.posarr();
	}
});
var tagShareVm = new Vue({
	el: '.tag_share',
	data: {
		tagname: []
	},
	mounted: function () {
		axios
			.get('/postsTags', {
				params: {
					id: postInfo.postid
				}
			})
			.then(response => {
				this.tagname = response.data;
			})
			.catch(function (error) { // 请求失败处理
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
	mounted: function () {
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
			.catch(function (error) { // 请求失败处理
				console.log(error);
			});
	},
	updated: function () {
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
		onto: function (id, index) {
			let pos = $(id).offset().top;
			this.percentage = Math.floor((pos - $("#post").offset().top) / 10);
			$('body, html').animate({
				scrollTop: pos
			});
		},
		// 一滚动就判断所处位置，添加选中样式
		handleScroll: function () {
			// this.posarr();
			var percentageNum = Math.floor(($("body, html").scrollTop() - $("#post").offset().top) / 10);
			if (percentageNum >= 0)
				// 更新当前滚动到的位置
				this.percentage = percentageNum;
			// 遍历父标题位置数组
			for (let i = 0; i < this.posarr1.length; i++) {
				// 如果当前滚动位置大于当前遍历到的父标题位置-20并且小于等于下一个父标题位置-20
				// 或者当前滚动位置大于等于最后一个父标题位置-20
				if (this.percentage >= this.posarr1[i] - 20 && this.percentage <= this.posarr1[i + 1] -
					20 || this.percentage >= this.posarr1[this.posarr1.length - 1] - 20) {
					$(".toc>.toc-item>a").removeClass("active");
					$(".toc>.toc-item").eq(i).find("a").eq(0).addClass("active");
					$(".toc>.toc-item").removeClass("active");
					$(".toc-child .toc-link").removeClass("active");
					$(".toc>.toc-item").eq(i).addClass("active");
				}
				// 如果当前滚动位置小于第一个父标题位置
				if (this.percentage < this.posarr1[0]) {
					$(".toc>.toc-item>a").removeClass("active");
					$(".toc>.toc-item").removeClass("active");
					$(".toc-child .toc-link").removeClass("active");
				}
			}
			// 遍历子标题位置数组
			for (let i = 0; i < this.posarr2.length; i++) {
				if (this.percentage >= this.posarr2[i] - 20 && this.percentage <= this.posarr2[i + 1] -
					20 || this
						.percentage >= this.posarr2[this.posarr2.length - 1] - 10) {
					$(".toc-child .toc-link").removeClass("active");
					$(".toc-child .toc-link").eq(i).addClass("active");
				}
			}
		},
		// 应该要先执行tocTop()获取级别再执行posarr()获取位置
		// 获取父子标题在文章内容中的位置
		posarr: function () {
			// 获取文章h标签的最高级别
			let levl = this.lev;
			// 存放父标题位置
			this.posarr1 = [];
			// 存放子标题位置
			this.posarr2 = [];
			// 判断标题数组是否有内容,没有内容就说明没有标题，不需要获取标题位置了
			if (this.tocList.length === 0) return;
			// 遍历文章的所有子标签
			for (let i = 0; i < $("#article-container").children().length; i++) {
				// 获取当前遍历的标签
				let el = $("#article-container").children().eq(i);
				// 获取带H的标签
				if (el.prop("localName").indexOf('h') !== -1) {
					// 获取标签在页面中的位置
					let nowHtop = $("#" + el.prop("id")).offset().top;
					// 获取文章内容在页面中的位置
					let articletop = $("#post").offset().top;
					// 计算标签在文章中的位置
					let pos = Math.floor((nowHtop - articletop) / 10);
					// 判断当前的h标签是否为最高级别的h标签
					// 最高级别的h标签放入父级标签数组，其余级别的h标签放入子级标签数组
					if (levl == parseInt(el.prop("localName").substring(1))) {
						// 将位置信息存入父级标题数组
						this.posarr1.push(pos);
					} else {
						// 将位置信息存入子级标题数组
						this.posarr2.push(pos);
					}
				}
			}
		},
		// 获取文章标题信息以及最高级别的h标签
		tocTop: function () {
			// 初始化当前文章内最高级别的h标签
			let levl = null;
			// 遍历文章内的所有标签
			for (let i = 0; i < $("#article-container").children().length; i++) {
				// 获取当前遍历的标签
				let el = $("#article-container").children().eq(i);
				// 判断当前标签是否为h标签
				if (el.prop("localName").indexOf('h') !== -1) {
					// 判断当前h标签是否有id值，没有的话自己设一个
					if (el.prop("id") === "") {
						el.prop("id", "h" + i);
					}
					// 如果当前暂无最高级别的h标签或者现在遍历到h标签的级别比先前的级别高，就把现在的这个h标签级别设为最高
					// 级别：h1>h2>h3...
					if (levl === null || levl > parseInt(el.prop("localName").substring(1))) {
						levl = parseInt(el.prop("localName").substring(1));
					}
				}
			}
			// 标签遍历完成，将最高级别的h标签通知设置到data里
			this.lev = levl;
			// 存放文章内的标题信息
			let toc = [];
			// 遍历文章内的所有标签
			for (let i = 0; i < $("#article-container").children().length; i++) {
				// 获取当前遍历的标签
				let el = $("#article-container").children().eq(i);
				// 判断当前标签是否为h标签
				if (el.prop("localName").indexOf('h') !== -1) {
					// 判断当前的h标签是否为最高级别的h标签
					if (levl === parseInt(el.prop("localName").substring(1))) {
						// toc为一个二维数组
						// child内存放子级标题的相关信息
						// 如果当前标签是最高级别的标签，就应该带有一个child子数组
						toc.push({
							"title": el.text(),
							"id": "#" + el.prop("id"),
							"child": []
						});
					} else {
						// 判断当前标题数组是否有存放信息
						// 不在最高级别标签底下的h标签不算为标题
						if (toc.length !== 0) {
							// 在当前标题数组的最后一个元素内的child数组内添加子标题的相关信息
							toc[toc.length - 1].child.push({
								"title": el.text(),
								"id": "#" + el.prop("id")
							});
						} else
							// 没有存放信息说明当前还没遇上最高级别的h标签,继续遍历，直到找到第一个最高级别的h标签
							continue;
					}
				}
			}
			// 标签遍历完成，将标题信息数组设置到data里
			this.tocList = toc;
		}
	},
	mounted: function () {
		// 监听滚动事件
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
			.catch(function (error) { // 请求失败处理
				console.log(error);
			});
	},
	computed: {
		progressPercentage: function () {
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
	mounted: function () {
		axios
			.get('/queryComment', {
				params: {
					pid: postInfo.postid
				}
			})
			.then(response => {
				this.commentList = response.data;
			})
			.catch(function (error) { // 请求失败处理
				console.log(error);
			});
	}
})
