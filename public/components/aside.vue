<template>
	<div class="aside-content" id="aside-content">
		<div class="card-widget card-announcement">
			<div class="item-headline"></div>
			<div class="announcement_content">
				双目失明的汉弥尔顿为什么还坐在黑灯瞎火里头写十四行诗那就叫“自我”--王小波<br><br>走出自己的傲慢，承认自己的局限。--罗翔</div>
		</div>
		<div class="card-widget card-recent-post">
			<div class="item-headline"><i class="fas fa-history"></i><span>最新文章</span></div>
			<div class="aside-list" v-for="p in postsList">
				<div class="aside-list-item no-cover">
					<div class="content">
						<a class="title" :href="'postsDetail.html?id='+p.id" title="">{{p.title}}</a>
						<time :datetime="p.insertTime" :title="'发表于 '+p.insertTime">{{p.insertTime}}</time>
					</div>
				</div>
			</div>
		</div>
		<div class="sticky_layout">
			<div class="card-widget card-tags">
				<div class="item-headline"><i class="fas fa-tags"></i><span>标签</span></div>
				<div class="card-tag-cloud">
					<a v-for="t in tagsList" :href="'categoryDetail.html?type=c3&id='+t.id+'&name='+t.name" style="font-size:1.1em;color:#999">{{t.name}}</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	module.exports = {
		data: function() {
			postsList: []
			tagsList: []
			return {
				postsList: this.postsList,
				tagsList: this.tagsList
			}
		},
		methods: {
			randomColor: function() {
				var str = '#9999';
				for (var i = 0; i < 2; i++) {
					str += Math.floor(Math.random() * 16).toString(16);
				}
				console.log(str);
				return str;
			}
		},
		mounted: function() {
			axios
				.get('/postsRecent')
				.then(response => {
					this.postsList = response.data[0];
					this.tagsList = response.data[1];
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		updated: function() {
			for (var i in this.tagsList) {
				$(".card-tag-cloud a").eq(i).css("color", this.randomColor());
			}
		}
	}
</script>

<style>
</style>
