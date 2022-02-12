<template>
	<div class="tk-submit">
		<div class="tk-row">
			<div class="tk-avatar tk-has-avatar">
				<img v-if="loginstatus!='' && userinfo.avatarUrl!=null" :src="userinfo.avatarUrl" alt=""
					class="tk-avatar-img">
				<img v-if="loginstatus=='' || userinfo.avatarUrl==null" src="images/nullAvatar.png" alt=""
					class="tk-avatar-img">
				<input type="hidden" name="avatarUrl" :value="userinfo.avatarUrl" />
			</div>
			<div class="tk-col">
				<div class="tk-meta-input">
					<div class="el-input el-input--small el-input-group el-input-group--prepend">
						<div class="el-input-group__prepend">昵称</div>
						<input v-if="loginstatus!=''&&loginstatus!=null" v-model="nick" disabled="disabled"
							style="cursor:no-drop" type="text" autocomplete="off" placeholder="必填"
							class="el-input__inner">
						<input v-if="loginstatus==''||loginstatus==null" v-model="nick" required="required" type="text"
							autocomplete="off" placeholder="必填" class="el-input__inner">
						<input type="hidden" name="nick" v-model="nick" />
					</div>
					<div class="el-input el-input--small el-input-group el-input-group--prepend">
						<div class="el-input-group__prepend">邮箱</div>
						<input v-if="loginstatus!=''&&loginstatus!=null" v-model="email" disabled="disabled"
							style="cursor:no-drop" type="email" autocomplete="off" placeholder="必填"
							class="el-input__inner">
						<input v-if="loginstatus==''||loginstatus==null" v-model="email" required="required"
							type="email" autocomplete="off" placeholder="必填" class="el-input__inner">
						<input type="hidden" name="email" v-model="email" />
					</div>
					<div class="el-input el-input--small el-input-group el-input-group--prepend">
						<div class="el-input-group__prepend">网址</div>
						<input v-if="loginstatus!=''&&loginstatus!=null" v-model="indexUrl" disabled="disabled"
							style="cursor:no-drop" type="text" autocomplete="off" placeholder="选填"
							class="el-input__inner">
						<input v-if="loginstatus==''||loginstatus==null" v-model="indexUrl" type="text"
							autocomplete="off" placeholder="选填" class="el-input__inner">
						<input type="hidden" name="link" v-model="indexUrl" />
					</div>
				</div>
				<div class="tk-input el-textarea">
					<textarea name="content" maxlength="8192" autocomplete="off" placeholder="雁过留声"
						class="el-textarea__inner" style="min-height: 75px; height: 75px;"></textarea>
				</div>
			</div>
		</div>
		<div class="tk-row actions">
			<div class="tk-row-actions-start">
				<div class="tk-action-icon" @click="uploadImg($event)">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
						<path
							d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z">
						</path>
					</svg>
					<input name="commentImg" type="file" accept="image/*" value="" class="tk-input-image">
					<div @click.stop="cancel($event)" class="file-msg" style="width: 200px;"></div>
				</div>
			</div>
			<button @click="previewImg()" type="button" style="cursor: no-drop;" disabled="disabled"
				class="el-button tk-preview el-button--default el-button--small previewImg">
				<span>预览图片</span>
				<input type="hidden" class="imgSrc" />
			</button>
			<button type="submit" disabled="disabled"
				class="el-button tk-send el-button--primary el-button--small is-disabled">
				<span>发送</span>
			</button>
		</div>
	</div>
</template>

<script>
	module.exports = {
		props: ["loginstatus", "userinfo"],
		data: function() {
			return {
				nick: this.nick,
				email: this.email,
				indexUrl: this.indexUrl
			}
		},
		methods: {
			uploadImg: function(e) {
				e.currentTarget.firstElementChild.nextElementSibling.click();
			},
			getObjectURL: function(file) {
				var url = null;
				if (window.createObjectURL != undefined) { // basic
					url = window.createObjectURL(file);
				} else if (window.URL != undefined) { // mozilla(firefox)
					url = window.URL.createObjectURL(file);
				} else if (window.webkitURL != undefined) { // webkit or chrome
					url = window.webkitURL.createObjectURL(file);
				}
				return url;
			},
			imgPreView: function(imgSrc) {
				$(".file-msg").html("已选择图片,点击取消图片");
				$(".imgSrc").val(imgSrc);
				$(".previewImg").css("cursor", "pointer");
				$(".previewImg").prop("disabled", false);
			},
			previewImg: function() {
				window.open($(".imgSrc").val(), "_blank");
			},
			cancel: function(e) {
				e.currentTarget.previousElementSibling.value = '';
				$(".file-msg").html('');
				$(".previewImg").css("cursor", "no-drop");
				$(".previewImg").prop("disabled", true);
			}
		},
		mounted: function() {
			this.nick = this.userinfo.userName;
			this.email = this.userinfo.email;
			this.indexUrl = this.userinfo.indexUrl;
			
			var imgName;
			var imgSrc;
			var imgFile;
			var that = this;
			$('.tk-input-image').on('change', function() {
				var f = this.files.length;
				if (f == 0) { //如果取消上传，则该文件的长度为0         
					return;
				} else {
					imgName = null;
					imgSrc = null;
					imgFile = null;
					//如果有文件上传，这在这里面进行
					var fileList = this.files;
					for (var i = 0; i < fileList.length; i++) {
						var imgSrcI = that.getObjectURL(fileList[i]);
						imgName = fileList[i].name;
						imgSrc = imgSrcI;
						imgFile = fileList[i];
					}
					that.imgPreView(imgSrc);
				}
			});
			$("textarea").bind("input", function() {
				if ($(this).val() == '' || $(this).val() == null) {
					$(this).closest(".tk-submit").find(".tk-send").prop("disabled", true);
					$(this).closest(".tk-submit").find(".tk-send").addClass("is-disabled");
				} else {
					$(this).closest(".tk-submit").find(".tk-send").prop("disabled", false);
					$(this).closest(".tk-submit").find(".tk-send").removeClass("is-disabled");
				}
			});
		},
		updated: function() {},
		watch: { // 使用监听的方式，监听数据的变化
			loginstatus(val) {
				this.loginstatus = val;
			},
			userinfo(val) {
				this.userinfo = val;
				this.nick = this.userinfo.userName;
				this.email = this.userinfo.email;
				this.indexUrl = this.userinfo.indexUrl;
			}
		}
	}
</script>

<style>
</style>
