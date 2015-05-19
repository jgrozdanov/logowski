
$(document).ready(function() {
  var canvas = document.getElementById('canvas'),
      context = canvas.getContext('2d'),
      isPainting = false,
      color = '#eb008b',
      positions = [], // { x, y, dragging, isUndoMarker, color}
      positionsUndo = [];

  // now that we have the context
  // a jquery object is needed
  canvas = $('#canvas');

  var addPosition = function(x, y, dragging) {
    var position = {
      x: x,
      y: y,
      color: color
    };

    if(dragging) {
      position.dragging = true;
      position.isUndoMarker = false;
    }
    else {
      position.dragging = false;
      position.isUndoMarker = true;
    }

    positions.push(position);
  };

  var redraw = function() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0,0,context.canvas.width, context.canvas.height);
    context.lineJoin = 'round';
    context.lineWidth = 5;

    for(var i = 0; i < positions.length; i++) {
      context.strokeStyle = positions[i].color;
      context.beginPath();

      if(positions[i].dragging && i) {
        context.moveTo(positions[i-1].x, positions[i-1].y);
      }
      else {
        context.moveTo(positions[i].x - 1, positions[i].y);
      }

      context.lineTo(positions[i].x, positions[i].y);
      context.closePath();
      context.stroke();
    }
  };

  canvas.mousedown(function(e) {
    var mouseX = e.pageX - canvas.offset().left;
    var mouseY = e.pageY - canvas.offset().top;

    isPainting = true;

    addPosition(mouseX, mouseY);
    redraw();
  });

  canvas.mousemove(function(e) {
    var mouseX = e.pageX - canvas.offset().left;
    var mouseY = e.pageY - canvas.offset().top;

    if(isPainting) {
      addPosition(mouseX, mouseY, true);
      redraw();
    }
  });

  canvas.mouseup(function(e) {
    isPainting = false;
  });

  canvas.mouseleave(function(e) {
    isPainting = false;
  });

  $('.canvas-undo').click(function(e) {
    e.preventDefault();

    var i;
    if(positions.length) {
      for(i = positions.length - 1; i >= 0; i--) {
        if(positions[i].isUndoMarker) {
          break;
        }
      }

      positionsUndo.push(positions.slice(i));
      positions.splice(i);
      redraw();
    }
  });

  $('.canvas-redo').click(function(e) {
    e.preventDefault();
    if(positionsUndo.length) {
      positions = positions.concat(positionsUndo.pop());
      redraw();
    }
  });

  $('.canvas-erase').click(function(e) {
    e.preventDefault();
    console.log(canvas.get(0).toDataURL('image/jpeg', 1.0));
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    positions = [];
    positionsUndo = [];
  });

  $('.canvas-black').click(function(e) {
    e.preventDefault();
    color = 'black';
  });

  $('.canvas-yellow').click(function(e) {
    e.preventDefault();
    color = '#fff100';
  });

  $('.canvas-blue').click(function(e) {
    e.preventDefault();
    color = '#00adee';
  });

  $('.canvas-pink').click(function(e) {
    e.preventDefault();
    color = '#eb008b';
  });
});