$(document).ready(function() {
	var imgName,imgSrc,imgFile;
	$('#article-cover').on('change', function() {
		var fileList = this.files;
		for (var i = 0; i < fileList.length; i++) {
			var imgSrcI = getObjectURL(fileList[i]);
			imgName = fileList[i].name;
			imgSrc = imgSrcI;
			imgFile = fileList[i];
		}
		imgPreView1(imgSrc);
	});
	var logoName,logoSrc,logoFile;
	$('#link-logo').on('change', function() {
		var fileList = this.files;
		for (var i = 0; i < fileList.length; i++) {
			var logoSrcI = getObjectURL(fileList[i]);
			logoName = fileList[i].name;
			logoSrc = logoSrcI;
			logoFile = fileList[i];
		}
		imgPreView2(logoSrc);
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

function imgPreView1(imgSrc) {
	$("#uploadPicture").hide();
	$("#picture .picture-view").prop("src", imgSrc);
	$("#picture").show();
}
function imgPreView2(imgSrc) {
	$("#link-logo-label").hide();
	$("#picture-view-link-logo .picture-view").prop("src", imgSrc);
	$("#picture-view-link-logo").show();
}