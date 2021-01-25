// Get current rotation angle
(function($) {
  $.fn.rotationDegrees = function() {
    var matrix = this.css("-webkit-transform") ||
      this.css("-moz-transform") ||
      this.css("-ms-transform") ||
      this.css("-o-transform") ||
      this.css("transform");
    if (typeof matrix === 'string' && matrix !== 'none') {
      var values = matrix.split('(')[1].split(')')[0].split(',');
      var a = values[0];
      var b = values[1];
      var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    } else {
      var angle = 0;
    }
    return angle;
  };
}(jQuery));

// jQuery.fn.rotate = function(degrees) {
//   $(this).css({
//     '-webkit-transform': 'rotate(' + degrees + 'deg)',
//     '-moz-transform': 'rotate(' + degrees + 'deg)',
//     '-ms-transform': 'rotate(' + degrees + 'deg)',
//     'transform': 'rotate(' + degrees + 'deg)'
//   });
//   return $(this);
// };

jQuery.fn.rotate = function(degrees) {
  $(this).css({
    '-webkit-keyframes spin': 'rotate(' + degrees + 'deg)',
    '-moz-transform': 'rotate(' + degrees + 'deg)',
    '-ms-transform': 'rotate(' + degrees + 'deg)',
    'transform': 'rotate(' + degrees + 'deg)'
  });
  return $(this);
};


$(document).ready(function() {

  // Initialize random points on the circle, update # of digits
  function init($param) {
    var angle = Math.floor((Math.random() * 720) - 360);
    $("#circle2").rotate(angle);
    $("#container > p").html($param);
    if($param!=1)
      $("#container > p").append("<br><h4 style='color: rgba(0, 0, 0, 0.0); font-weight: bold;'>Pins Left</h4>");
    else
      $("#container > p").append("<br><h4 style='color: rgba(0, 0, 0, 0.0); font-weight: bold;'>Pins Left</h4>");
  }

  // %2 == 0 is clockwise, else counter-clockwise
  var counter = 0;
  // # of digits, reach 0 => win
  var digits = 5;
  // display
  init(digits);
  // store the randomly generated angle of the point
  var angle = $("#circle2").rotationDegrees();
  // Initial circle spin on page load
  //$("#circle").rotate(2880);

  document.onkeydown = function (data) {
    if (data.which == 69) {
      // Current rotation stored in a variable
      var unghi = $("#circle").rotationDegrees();
      // If current rotation matches the random point rotation by a margin of +- 2digits, the player "hit" it and continues
      if (unghi > angle - 25 && unghi < angle + 25) {
        digits--;
        // If game over, hide the game, display end of game options
        if (!digits) {
          $.post('http://cfx_lockpick/complete', JSON.stringify({}));
        }
        // Else, add another point and remember its new angle of rotation
        else init(digits);
        angle = $("#circle2").rotationDegrees();
        $.post('http://cfx_lockpick/noice', JSON.stringify({}));
      }
      // Else, the player "missed" and is brought to end of game options
      else {
        $.post('http://cfx_lockpick/failure', JSON.stringify({}));
      }
      // No of clicks ++
      counter++;
      // spin based on click parity
      if (counter % 2) {
        $("#circle").rotate(-2880);
      } else $("#circle").rotate(2160);
    }
  }     

/*  $('#circle').click(function() {
    // Current rotation stored in a variable
    var unghi = $(this).rotationDegrees();
    // If current rotation matches the random point rotation by a margin of +- 2digits, the player "hit" it and continues
    if (unghi > angle - 25 && unghi < angle + 25) {
      digits--;
      // If game over, hide the game, display end of game options
      if (!digits) {
        $.post('http://cfx_lockpick/complete', JSON.stringify({}));
      }
      // Else, add another point and remember its new angle of rotation
      else init(digits);
      angle = $("#circle2").rotationDegrees();
      $.post('http://cfx_lockpick/noice', JSON.stringify({}));
    }
    // Else, the player "missed" and is brought to end of game options
    else {
      $.post('http://cfx_lockpick/failure', JSON.stringify({}));
    }
    // No of clicks ++
    counter++;
    // spin based on click parity
    if (counter % 2) {
      $(this).rotate(-2880);
    } else $(this).rotate(2160);


  });*/

  // Listen for NUI Events
  window.addEventListener('message', function(event){
    var item = event.data;
    // Trigger adding a new message to the log and create its display
    // Open & Close main phone window
    if(item.openLockpick === true) {
      openLockpickGame(item.pins);
    }

    if(item.openLockpick === false) {
      closeLockpickGame();
    }
  });


  function openLockpickGame(pins) {
    $(".body-container").css("display", "block");

    digits = pins;
    init(digits);
    angle = $("#circle2").rotationDegrees();
    $("#circle").rotate(2440);
    counter = 0;  
  }

  function closeLockpickGame() {
    $(".body-container").css("display", "none");
  }  
});
