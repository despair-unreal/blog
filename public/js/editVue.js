import * as nav from './nav.js';
const E = window.wangEditor;
const editor = new E('#toolbar-container', '#text-container'); // 传入两个元素
// 上传图片
editor.config.uploadImgServer = '/upload';
editor.config.uploadFileName = 'uploadImgName'; // ================这里是关键，后台必须和这里保持一致================ 
editor.config.uploadImgTimeout = 60 * 1000;
//监听函数在上传图片的不同阶段做相应处理
editor.config.uploadImgHooks = {
	success: function(xhr, editor, result) {
		console.log('图片上传并返回结果,图片插入成功')
	},
	fail: function(xhr, editor, result) {
		console.log('图片上传并返回结果，但图片插入错误')
	},
	error: function(xhr, editor) {
		console.log('图片上传出错')
	},
	timeout: function(xhr, editor) {
		console.log('图片上传超时')
	},
	customInsert: function(insertImg, result) {
		// result 即服务端返回的接口
		console.log('customInsert', result)
		insertImg(result.data[0].imgPath);
	}

}

editor.create();

$(document).keyup(function() {
	var textLen = editor.txt.text().length;
	textNumVm.num = textLen;
	if (textLen != 0)
		$(".subimit-btn").prop("disabled", false);
	else
		$(".subimit-btn").prop("disabled", true);
});

var pageHeaderVm = new Vue({
	el: '#page-header',
	components: {
		'nav-component': httpVueLoader('./components/nav.vue'),
		'sidebar-component': httpVueLoader('./components/sidebar.vue'),
		'search-component': httpVueLoader('./components/search.vue'),
	},
	mounted:function(){
		axios
			.get('/getLoginStatus')
			.then(response => {
				if (response.data != 9){
					alert('仅管理员可操作！');
					window.location.href = "../login.html";
				}
			})
			.catch(function(error) { // 请求失败处理
				console.log(error);
			});
	},
	updated: function() {
		nav.navjs();
		nav.sidebarjs();
	}
});
var textNumVm = new Vue({
	el: '#text-num',
	data: {
		num: 0
	}
});

var sumitPostVm = new Vue({
	el: '#sumit-post',
	methods: {
		sumitPost: function() {
			postContentVm.postContent = editor.txt.html();
		}
	}
});

var postContentVm = new Vue({
	el: '#post-content',
	data: {
		postContent: null
	}
});

var articleOtherVm = new Vue({
	el: '#article-other',
	data: {
		type1List: [],
		type2List: [],
		tagsList: [],
		type1: null,
		tagSelectItems: []
	},
	methods: {
		getType1: function() {
			addVm.typeId = this.type1;
		},
		addTagSelect: function(component) {
			this.tagSelectItems.push({
				'value': null
			})
		}
	},
	mounted: function() {
		axios
			.get('/queryOther')
			.then(response => {
				this.type1List = response.data[0];
				this.tagsList = response.data[1];
				this.type1 = this.type1List[0].id;
				axios
					.get('/type2List', {
						params: {
							typeId: this.type1
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
	watch: {
		type1: function() {
			axios
				.get('/type2List', {
					params: {
						typeId: this.type1
					}
				})
				.then(response => {
					this.type2List = response.data;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		}
	}
});

var addVm = new Vue({
	el: '#add',
	data: {
		cname1: null,
		cname2: null,
		tname: null,
		typeId: null,
		typeName: null
	},
	watch: {
		typeId: function(val) {
			axios
				.get('/typeName', {
					params: {
						typeId: this.typeId
					}
				})
				.then(response => {
					this.typeName = response.data[0].name;
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		}
	},
	methods: {
		addc1: function() {
			axios
				.get('/addc1', {
					params: {
						cname1: this.cname1
					}
				})
				.then(response => {
					articleOtherVm.type1List = response.data
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		addc2: function() {
			axios
				.get('/addc2', {
					params: {
						cname2: this.cname2,
						typeId: this.typeId
					}
				})
				.then(response => {
					articleOtherVm.type2List = response.data
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		},
		addtag: function() {
			axios
				.get('/addtag', {
					params: {
						tag: this.tname
					}
				})
				.then(response => {
					articleOtherVm.tagsList = response.data
				})
				.catch(function(error) { // 请求失败处理
					console.log(error);
				});
		}
	},
	mounted: function() {}
});
