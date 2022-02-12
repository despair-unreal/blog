<template>
	<nav id="nav" class="show">
		<span id="blog_name">
			<a href="index.html">
				<img id="site-logo" src="images/logo.png" class="entered loaded">
			</a>
			<div id="head-page-title">
				<a id="page-name" href="index.html">BAIKONG<br></a>
				<a id="site-slogan" href="index.html">HOME</a>
			</div>
		</span>
		<div id="menus">
			<div id="search-button">
				<a class="site-page social-icon search">
					<i class="fas fa-search fa-fw"></i>
					<span></span>
				</a>
			</div>
			<div class="menus_items">
				<div class="menus_item">
					<a class="site-page" href="javascript:void(0);">
						<span>博客</span>
					</a>
					<ul class="menus_item_child">
						<li>
							<a class="site-page child" href="posts.html">
								<i class="fa-fw fas fa-home"></i>
								<span>主页</span>
							</a>
						</li>
						<li>
							<a class="site-page child" href="board.html">
								<i class="fa-fw fas fa-blog"></i>
								<span>微博</span>
							</a>
						</li>
						<li>
							<a class="site-page child" href="category.html">
								<i class="fa-fw fas fa-archive"></i>
								<span>归档</span>
							</a>
						</li>
						<li>
							<a class="site-page child" href="index.html">
								<i class="fa-fw fas fa-bookmark"></i>
								<span>介绍</span>
							</a>
						</li>
					</ul>
				</div>

				<div class="menus_item">
					<a class="site-page" href="javascript:void(0);">
						<span>影音</span>
					</a>
					<ul class="menus_item_child">
						<li>
							<a class="site-page child" href="#">
								<i class="fa-fw fas fa-camera"></i>
								<span>相册</span>
							</a>
						</li>
						<li>
							<a class="site-page child" href="#">
								<i class="fa-fw fas fa-map-marked"></i>
								<span>足迹</span>
							</a>
						</li>
						<li>
							<a class="site-page child" href="#">
								<i class="fa-fw fas fa-gift"></i>
								<span>东西</span>
							</a>
						</li>
						<li>
							<a class="site-page child" href="#">
								<i class="fa-fw fas fa-seedling"></i>
								<span>频道</span>
							</a>
						</li>
					</ul>
				</div>
				<div class="menus_item">
					<a class="site-page" href="javascript:void(0);">
						<span>空间</span>
					</a>
					<ul class="menus_item_child">
						<li>
							<a class="site-page child" target="_blank" rel="noopener" href="#">
								<i class="fa-fw fas fa-brain"></i>
								<span>维基</span>
							</a>
						</li>
						<li>
							<a class="site-page child" href="#">
								<i class="fa-fw fas fa-lightbulb"></i>
								<span>速查</span>
							</a>
						</li>
						<li>
							<a class="site-page child" target="_blank" rel="noopener" href="#">
								<i class="fa-fw fas fa-user-friends"></i>
								<span>论坛</span>
							</a>
						</li>
						<li>
							<a class="site-page child" href="#">
								<i class="fa-fw fas fa-link"></i>
								<span>友链</span>
							</a>
						</li>
					</ul>
				</div>
				<div class="menus_item">
					<a v-if="loginStatus!=''" class="site-page" href="javascript:void(0);">
						<span>个人</span>
					</a>
					<a v-if="loginStatus==''" class="site-page" href="login.html">
						<span>登录</span>
					</a>
					<ul v-if="loginStatus!=''" class="menus_item_child">
						<li>
							<a class="site-page child" href="manage.html">
								<i class="fa-fw fas fa-link"></i>
								<span>管理</span>
							</a>
						</li>
						<li>
							<a class="site-page child" href="/logout">
								<i class="fa-fw fas fa-link"></i>
								<span>注销</span>
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div id="toggle-menu">
				<a class="site-page">
					<i class="fas fa-bars fa-fw"></i>
				</a>
			</div>
		</div>
	</nav>
</template>

<script>
	module.exports = {
		data: function() {
			loginStatus: null
			return {
				loginStatus: this.loginStatus,
			}
		},
		methods: {},
		mounted: function() {
			axios
				.get('/getLoginStatus')
				.then(response => {
					this.loginStatus = response.data;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		}
	}
</script>

<style>
</style>
