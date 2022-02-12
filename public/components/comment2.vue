<template>
	<div :id="toid" class="tk-comment">
		<div class="tk-avatar tk-clickable tk-has-avatar">
			<img v-if="avatarUrl!=null" alt="" class="tk-avatar-img" :src="avatarUrl">
			<img v-if="avatarUrl==null" src="images/nullAvatar.png" alt="">
		</div>
		<div class="tk-main">
			<div class="tk-row">
				<div class="tk-meta">
					<a v-if="indexUrl!=null&&indexUrl!=''" class="tk-nick tk-nick-link" rel="noopener noreferrer"
						target="_blank" :href="indexUrl">
						<strong>{{userName}}</strong>
					</a>
					<a v-if="indexUrl==null||indexUrl==''" class="tk-nick tk-nick-link" rel="noopener noreferrer">
						<strong>{{userName}}</strong>
					</a>
					<small class="tk-time">
						<time :datetime="time" :title="time">{{time}}</time>
					</small>
					<small v-if="loginstatus==9 || userinfo.email == email" class="tk-time" style="margin-left: 15px;cursor: pointer;">
						<a @click="deleteBoardInner()">删除</a>
					</small>
				</div>
				<div class="tk-action">
					<a class="tk-action-link">
						<span class="tk-action-icon">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
								<path
									d="M466.27 286.69C475.04 271.84 480 256 480 236.85c0-44.015-37.218-85.58-85.82-85.58H357.7c4.92-12.81 8.85-28.13 8.85-46.54C366.55 31.936 328.86 0 271.28 0c-61.607 0-58.093 94.933-71.76 108.6-22.747 22.747-49.615 66.447-68.76 83.4H32c-17.673 0-32 14.327-32 32v240c0 17.673 14.327 32 32 32h64c14.893 0 27.408-10.174 30.978-23.95 44.509 1.001 75.06 39.94 177.802 39.94 7.22 0 15.22.01 22.22.01 77.117 0 111.986-39.423 112.94-95.33 13.319-18.425 20.299-43.122 17.34-66.99 9.854-18.452 13.664-40.343 8.99-62.99zm-61.75 53.83c12.56 21.13 1.26 49.41-13.94 57.57 7.7 48.78-17.608 65.9-53.12 65.9h-37.82c-71.639 0-118.029-37.82-171.64-37.82V240h10.92c28.36 0 67.98-70.89 94.54-97.46 28.36-28.36 18.91-75.63 37.82-94.54 47.27 0 47.27 32.98 47.27 56.73 0 39.17-28.36 56.72-28.36 94.54h103.99c21.11 0 37.73 18.91 37.82 37.82.09 18.9-12.82 37.81-22.27 37.81 13.489 14.555 16.371 45.236-5.21 65.62zM88 432c0 13.255-10.745 24-24 24s-24-10.745-24-24 10.745-24 24-24 24 10.745 24 24z">
								</path>
							</svg>
						</span>
						<span class="tk-action-icon tk-action-icon-solid">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
								<path
									d="M104 224H24c-13.255 0-24 10.745-24 24v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V248c0-13.255-10.745-24-24-24zM64 472c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zM384 81.452c0 42.416-25.97 66.208-33.277 94.548h101.723c33.397 0 59.397 27.746 59.553 58.098.084 17.938-7.546 37.249-19.439 49.197l-.11.11c9.836 23.337 8.237 56.037-9.308 79.469 8.681 25.895-.069 57.704-16.382 74.757 4.298 17.598 2.244 32.575-6.148 44.632C440.202 511.587 389.616 512 346.839 512l-2.845-.001c-48.287-.017-87.806-17.598-119.56-31.725-15.957-7.099-36.821-15.887-52.651-16.178-6.54-.12-11.783-5.457-11.783-11.998v-213.77c0-3.2 1.282-6.271 3.558-8.521 39.614-39.144 56.648-80.587 89.117-113.111 14.804-14.832 20.188-37.236 25.393-58.902C282.515 39.293 291.817 0 312 0c24 0 72 8 72 81.452z">
								</path>
							</svg>
						</span>
						<span class="tk-action-count"></span>
					</a>
					<a class="tk-action-link">
						<span class="tk-action-icon">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
								<path
									d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z">
								</path>
							</svg>
						</span>
						<span class="tk-action-icon tk-action-icon-solid">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
								<path
									d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z">
								</path>
							</svg>
						</span>
						<span class="tk-action-count"></span>
					</a>
				</div>
			</div>
			<div class="tk-content">
				<span>回复 <a :href="'#'+toId">@{{toNick}}</a>:</span>
				<span>
					<p>{{content}}</p>
					<img v-if="contentImg!=null" :src="contentImg" />
				</span>
			</div>
			<div class="tk-extras">
				<div class="tk-extra">
					<span class="tk-icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
							<path
								d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z">
							</path>
						</svg>
					</span>
					<span class="tk-extra-text">
						&nbsp;{{sys}}
					</span>
				</div>
				<div class="tk-extra">
					<span class="tk-icon">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
							<path
								d="M131.5 217.5L55.1 100.1c47.6-59.2 119-91.8 192-92.1 42.3-.3 85.5 10.5 124.8 33.2 43.4 25.2 76.4 61.4 97.4 103L264 133.4c-58.1-3.4-113.4 29.3-132.5 84.1zm32.9 38.5c0 46.2 37.4 83.6 83.6 83.6s83.6-37.4 83.6-83.6-37.4-83.6-83.6-83.6-83.6 37.3-83.6 83.6zm314.9-89.2L339.6 174c37.9 44.3 38.5 108.2 6.6 157.2L234.1 503.6c46.5 2.5 94.4-7.7 137.8-32.9 107.4-62 150.9-192 107.4-303.9zM133.7 303.6L40.4 120.1C14.9 159.1 0 205.9 0 256c0 124 90.8 226.7 209.5 244.9l63.7-124.8c-57.6 10.8-113.2-20.8-139.5-72.5z">
							</path>
						</svg>
					</span>
					<span class="tk-extra-text">
						&nbsp;{{browser}}
					</span>
				</div>
			</div>
			<div class="tk-replies tk-replies-expand"></div>
		</div>
	</div>
</template>

<script>
	module.exports = {
		props: ["loginstatus", "userinfo", "toId", "toNick", "toid", "indexUrl", "avatarUrl", "userName", "content",
			"contentImg", "sys",
			"browser", "time", "id", "username","pid","email"
		],
		data: function() {
			return {}
		},
		components: {
			'comment2-component': httpVueLoader('./comment2.vue'),
			'commentsubmit-component': httpVueLoader('./commentsSubmit.vue')
		},
		methods: {
			deleteBoardInner: function() {
				if (confirm("确认删除？")) {
					if (this.username != undefined) {
						axios
							.get('/deleteBoardInner', {
								params: {
									id: this.id
								}
							})
							.then(response => {
								window.location.href = "../board.html";
							})
							.catch(function(error) { // 请求失败处理
								console.log(error);
							});
					} else {
						axios
							.get('/deleteCommInner', {
								params: {
									id: this.id
								}
							})
							.then(response => {
								window.location.href="../postsDetail.html?id="+this.pid;
							})
							.catch(function(error) { // 请求失败处理
								console.log(error);
							});
					}

				}
			}
		},
		mounted: function() {},
		updated: function() {},
		watch: { // 使用监听的方式，监听数据的变化
			loginstatus(val) {
				this.loginstatus = val;
			},
			userinfo(val) {
				this.userinfo = val;
			},
			userName(val) {
				this.userName = val;
			},
		}
	}
</script>

<style>
</style>
