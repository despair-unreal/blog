<template>
	<div id="algolia-search">
		<div class="search-dialog" style="display: none;">
			<div class="search-dialog__title" id="algolia-search-title">SEARCH</div>
			<div id="algolia-input-panel">
				<div id="algolia-search-input">
					<div class="ais-search-box">
						<input v-model="keyWord" autocapitalize="off" autocomplete="off" autocorrect="off"
							placeholder="搜索文章" role="textbox" spellcheck="false" type="text"
							class="ais-search-box--input">
					</div>
				</div>
			</div>
			<div id="algolia-search-results">
				<div id="algolia-hits">
					<div class="ais-hits">
						<div v-for="(item,index) in resultList" class="ais-hits--item algolia-hit-item">
							<a :href="'postsDetail.html?id='+item.id" class="algolia-hit-item-link">{{item.title}}</a>
						</div>
					</div>
				</div>
				<div id="algolia-stats" v-if="keyWord!=null&&keyWord!=''">
					<div style="">
						<div class="ais-root ais-stats">
							<div class="ais-body ais-stats--body">
								<div v-if="resultList.length==0">找不到您查询的内容：{{keyWord}}</div>
								<div v-if="resultList.length!=0">找到 {{resultList.length}} 条结果</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<span class="search-close-button"><i class="fas fa-times"></i></span>
		</div>
		<div id="search-mask" style="display: none;"></div>
	</div>
</template>

<script>
	module.exports = {
		data: function() {
			return {
				keyWord: null,
				resultList: []
			}
		},
		methods: {},
		mounted: function() {},
		watch: { // 使用监听的方式，监听数据的变化
			keyWord(val) {
				if (val != '') {
					axios
						.get('/searchPost', {
							params: {
								kw: val
							}
						})
						.then(response => {
							this.resultList = response.data;
						})
						.catch(function(error) { // 请求失败处理
							console.log(error);
						});
				} else {
					this.resultList = [];
				}
			}
		}
	}
</script>

<style>
</style>
