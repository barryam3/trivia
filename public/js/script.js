var resize = function() {
	$('.ctitle.boardcell').textfill();
	$('.qvalue').textfill();
	console.log('hello');
}

$(document).ready(function() {
	resize();
});

$(window).resize(resize);
