$(document).ready(function() {
	var imgName;
	var imgSrc;
	var imgFile;
	$('#article-cover').on('change', function() {
		var f = this.files.length;
		if(f == 0) { //如果取消上传，则该文件的长度为0         
			return;
		} else {
			imgName = null;
			imgSrc = null;
			imgFile = null;
			//如果有文件上传，这在这里面进行
			var fileList = this.files;
			for (var i = 0; i < fileList.length; i++) {
				var imgSrcI = getObjectURL(fileList[i]);
				imgName = fileList[i].name;
				imgSrc = imgSrcI;
				imgFile = fileList[i];
			}
			imgPreView(imgSrc);
		}
	});
	$('#change-cover').click(function() {
		$('#article-cover').trigger("click");
	});
	$('#change-delete').click(function() {
		imgName = null;
		imgSrc = null;
		imgFile = null;
		$('#article-cover').val('');
		$(".picture-view-wrapper").hide();
		$(".uploadPicture-wrapper").css("display", "inline-block");
	});
	$('#remove-tags').click(function() {
		$(this).prev().remove();
	});

	$("#add-c1").click(function() {
		$('#add').show();
		$('#c1').show();
	});
	$("#add-c2").click(function() {
		$('#add').show();
		$('#c2').show();
	});
	$("#new-tags").click(function() {
		$('#add').show();
		$('#t1').show();
	});

	$("#add-mask").click(function() {
		$('#add').hide();
		$("#add>div:not(:last-child)").hide();
	});

	$("#add button").click(function() {
		$('#add').hide();
		$("#add>div:not(:last-child)").hide();
	});
});

function getObjectURL(file) {
	var url = null;
	if (window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if (window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if (window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
}

function imgPreView(imgSrc) {
	$(".uploadPicture-wrapper").hide();
	$(".picture-view-wrapper .picture-view").prop("src", imgSrc);
	$(".picture-view-wrapper").css("display", "inline-block");
}
