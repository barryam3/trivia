var resize = function() {
	$('.ctitle').textfill();
	$('.qtext').textfill();

}

$(document).ready(function() {
	resize()
});

$(window).resize(resize);