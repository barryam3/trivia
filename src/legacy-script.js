/* global $ */

// make board text fit in board
var resizeBoard = function() {
  // $('.ctitle.boardcell').textfill();
  // $('.qvalue').textfill();
};

// repeatedly try function f every ddt msec for dt msec
var tryUntil = function(f, dt, ddt) {
  f();
  if (dt > 0) {
    setTimeout(function() {
      tryUntil(f, dt - ddt, ddt);
    }, ddt);
  }
};

// what we want to happen when app loads
var onLoad = function() {
  resizeBoard();
  $('.scorebutton').width($('scorebutton').height());
  // $('.qtext').textfill({maxFontPixels: 48});
};

// when app loads
$(document).ready(function() {
  onLoad();
  tryUntil(onLoad, 60, 5);
});

// account for resize
$(window).resize(resizeBoard);
