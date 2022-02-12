var mainVm = new Vue({
	el: '.demo',
	data: {
		userInfo: {},
		loginStatus: null,
		postsList: [],
		isAdmin: 0,
		keyword: null,
		type1List: [],
		type2List: [],
		type1name: null,
		type1Id: null,
		c1Kw: null,
		c2Kw: null,
		tags: [],
		tagKw: null
	},
	methods: {
		queryPost: function() {
			axios
				.get('/postsQuery')
				.then(response => {
					this.postsList = response.data;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		deletePost: function(id) {
			if (confirm("确定删除？")) {
				axios
					.get('/deletePost', {
						params: {
							id: id
						}
					})
					.then(response => {
						this.postsList = response.data;
					})
					.catch(function(error) { // 请求失败处理
						console.log(error);
					});
			}
		},
		updatePost: function(id) {
			window.open("../updatePost.html?id=" + id, "_blank")
		},
		queryKw: function() {
			axios
				.get('/queryKeyWord', {
					params: {
						keyWord: this.keyword
					}
				})
				.then(response => {
					this.postsList = response.data;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		queryCKw1: function() {
			axios
				.get('/queryCKw1', {
					params: {
						keyWord: this.c1Kw
					}
				})
				.then(response => {
					this.type1List = response.data;
					console.log(this.type1List);
					this.type1name = this.type1List[0].name;
					this.type1Id = this.type1List[0].id;
					axios
						.get('/type2List', {
							params: {
								typeId: this.type1List[0].id
							}
						})
						.then(response => {
							this.type2List = response.data;
						})
						.catch(function(error) { // 请求失败处理
							console.log(error);
						});
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		queryCKw2: function() {
			axios
				.get('/queryCKw2', {
					params: {
						typeId: this.type1Id,
						keyWord: this.c2Kw
					}
				})
				.then(response => {
					this.type2List = response.data;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		queryType: function() {
			axios
				.get('/type1List')
				.then(response => {
					this.type1List = response.data;
					this.type1name = this.type1List[0].name
					this.type1Id = this.type1List[0].id;
					axios
						.get('/type2List', {
							params: {
								typeId: this.type1List[0].id
							}
						})
						.then(response => {
							this.type2List = response.data;
						})
						.catch(function(error) { // 请求失败处理
							console.log(error);
						});
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		queryType2: function(id, c1name) {
			axios
				.get('/type2List', {
					params: {
						typeId: id
					}
				})
				.then(response => {
					this.type2List = response.data;
					this.type1name = c1name;
					this.type1Id = id;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		queryTags: function() {
			axios
				.get('/queryTags')
				.then(response => {
					this.tags = response.data;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		showUpdate: function(id) {
			$("#c1name" + id).css("display", "inline-block");
			$("#c1name" + id).prev().hide();
			$("#ok" + id).show();
			$("#ok" + id).prev().hide();
		},
		show2Update: function(id) {
			$("#c2name" + id).css("display", "inline-block");
			$("#c2name" + id).prev().hide();
			$("#o2k" + id).show();
			$("#o2k" + id).prev().hide();
		},
		hideUpdate: function(id) {
			$("#c1name" + id).hide();
			$("#c1name" + id).prev().show();
			$("#ok" + id).hide();
			$("#ok" + id).prev().show();
			axios
				.get('/updateType1', {
					params: {
						id: id,
						tname: $("#c1name" + id).val()
					}
				})
				.then(response => {
					axios
						.get('/type1List')
						.then(response => {
							this.type1List = response.data;
							this.type1name = this.type1List[0].c1name;
							this.type1Id = this.type1List[0].id;
						})
						.catch(function(error) { // 请求失败处理
							console.log(error);
						});
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		hide2Update: function(id) {
			$("#c2name" + id).hide();
			$("#c2name" + id).prev().show();
			$("#o2k" + id).hide();
			$("#o2k" + id).prev().show();
			axios
				.get('/updateType2', {
					params: {
						id: id,
						tname: $("#c2name" + id).val()
					}
				})
				.then(response => {
					axios
						.get('/type2List', {
							params: {
								typeId: this.type1Id
							}
						})
						.then(response => {
							this.type2List = response.data;
						})
						.catch(function(error) { // 请求失败处理
							console.log(error);
						});
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		addC1: function() {
			axios
				.get('/addc1', {
					params: {
						cname1: this.c1Kw
					}
				})
				.then(response => {
					console.log(response.data)
					this.type1List = response.data;
					this.type1name = this.type1List[0].name;
					this.type1Id = this.type1List[0].id;
					axios
						.get('/type2List', {
							params: {
								typeId: this.type1Id
							}
						})
						.then(response => {
							this.type2List = response.data;
						})
						.catch(function(error) { // 请求失败处理
							console.log(error);
						});
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		addC2: function() {
			axios
				.get('/addc2', {
					params: {
						cname2: this.c2Kw,
						typeId: this.type1Id
					}
				})
				.then(response => {
					this.type2List = response.data;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		deleteType1: function(id) {
			if (confirm("确认删除？")) {
				axios
					.get('/deleteType1', {
						params: {
							id: id
						}
					})
					.then(response => {
						this.type1List = response.data;
						this.type1name = this.type1List[0].name;
						axios
							.get('/type2List', {
								params: {
									typeId: this.type1List[0].id
								}
							})
							.then(response => {
								this.type2List = response.data;
							})
							.catch(function(error) { // 请求失败处理
								console.log(error);
							});
					})
					.catch(function(error) { // 请求失败处理
						console.log(error);
					});
			}
		},
		deleteType2: function(id) {
			if (confirm("确认删除？")) {
				axios
					.get('/deleteType2', {
						params: {
							id: id,
							typeId: this.type1Id
						}
					})
					.then(response => {
						this.type2List = response.data;
					})
					.catch(function(error) { // 请求失败处理
						console.log(error);
					});
			}
		},
		stickyPostcancel: function(id) {
			axios
				.get('/stickyPostcancel', {
					params: {
						id: id
					}
				})
				.then(response => {
					this.postsList = response.data;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		stickyPost: function(id) {
			axios
				.get('/stickyPost', {
					params: {
						id: id
					}
				})
				.then(response => {
					this.postsList = response.data;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		deleteTag: function(id) {
			if (confirm("确认删除？")) {
				axios
					.get('/deleteTag', {
						params: {
							id: id
						}
					})
					.then(response => {
						this.queryTags();
					})
					.catch(function(error) { // 请求失败处理
						console.log(error);
					});
			}
		},
		addTag: function() {
			axios
				.get('/addtag', {
					params: {
						tag: this.tagKw
					}
				})
				.then(response => {
					this.tags = response.data;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		queryTagsKw: function() {
			axios
				.get('/queryTagsKw', {
					params: {
						kw: this.tagKw
					}
				})
				.then(response => {
					this.tags = response.data;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		tagUpdate: function(id) {
			$("#tag"+id).show();
			$("#tag"+id).prev().hide();
			$("#tagok"+id).show();
			$("#tagok"+id).prev().hide();
		},
		hideTagUpdate: function(id) {
			axios
				.get('/tagsUpdate', {
					params: {
						name: $("#tag"+id).val(),
						id: id
					}
				})
				.then(response => {
					this.queryTags();
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
			$("#tag"+id).hide();
			$("#tag"+id).prev().show();
			$("#tagok"+id).hide();
			$("#tagok"+id).prev().show();
		}
	},
	mounted: function() {
		axios
			.get('/getLoginStatus')
			.then(response => {
				this.loginStatus = response.data;
				if (this.loginStatus == 9)
					this.isAdmin = 1;
				if (this.loginStatus != '') {
					axios
						.get('/getUserInfo', {
							params: {
								id: this.loginStatus
							}
						})
						.then(response1 => {
							this.userInfo = response1.data;
							if (this.userInfo.avatarUrl != null) {
								$(".logo a").css("background-image", "url(" + this.userInfo
									.avatarUrl + ")");
							} else {
								$(".logo a").css("background-image", "url(images/nullAvatar.png)");
							}

							console.log(this.userInfo);
						})
						.catch(function(error1) { // 请求失败处理
							console.log(error1);
						});
				} else {
					alert('请登录！');
					window.location.href = "../login.html";
				}
			})
			.catch(function(error) { // 请求失败处理
				console.log(error);
			});

	},
	updated: function() {
		$(".slidebar li").click(function() {
			$(".slidebar li").removeClass("active");
			$(this).addClass("active");
		});
	}
})
