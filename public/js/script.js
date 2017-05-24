var resize = function() {
	$('.ctitle').textfill();
	$('.qvalue').textfill();
	$('.qtext').textfill();

}

$(document).ready(function() {
	resize()
});

$(window).resize(resize);