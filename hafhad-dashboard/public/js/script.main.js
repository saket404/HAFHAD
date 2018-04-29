function callNotify( message, notifyType = 'primary', from = 'top', align = 'right' ){
  $.notify({
    message: message
  },
  {
    type: notifyType,
    timer: 100,
    placement: {
      from: from,
      align: align
    }
  });
}

// Scroll on drag
var clicked = false, clickY;
$(document).on({
  'mousemove': function(e) {
    clicked && updateScrollPos(e);
  },
  'mousedown': function(e) {
    clicked = true;
    clickY = e.pageY;
  },
  'mouseup': function() {
    clicked = false;
    $('html').css('cursor', 'auto');
  }
});

var updateScrollPos = function(e) {
  $('html').css('cursor', 'row-resize');
  $(window).scrollTop($(window).scrollTop() + (clickY - e.pageY));
}