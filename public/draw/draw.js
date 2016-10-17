var canWidth = Math.min(800,document.body.offsetWidth);
var canHeight = canWidth;

var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");

canvas.width = canWidth;
canvas.height = canHeight;
var lastloc = {};

drawGrid();
var clear = document.getElementById("clear");
clear.onclick = function(e){
  context.clearRect(0,0,canWidth,canHeight);
  drawGrid();
}

function begindraw(point){
  isMouseDown = true;
  lastloc = windowToCanvas(point.x, point.y); 
}
function movedraw(point){
  var curloc = windowToCanvas(point.x, point.y);
  //draw
  context.beginPath();
  context.moveTo(lastloc.x, lastloc.y);
  context.lineTo(curloc.x, curloc.y);
  context.strokeStyle = "black";
  context.lineWidth = 10;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();

  lastloc = curloc;
}

var isMouseDown = false;
canvas.onmousedown = function(e) {
  e.preventDefault();
  begindraw({x:e.clientX, y: e.clientY});
}
canvas.onmouseup = function(e) {
  e.preventDefault();
  isMouseDown = false;
}
canvas.onmouseout = function(e) {
  e.preventDefault();
  isMouseDown = false;
}
canvas.onmousemove = function(e) {
  e.preventDefault();
  if( isMouseDown ){
    movedraw({x:e.clientX, y: e.clientY});
  }
}

canvas.addEventListener('touchstart', function(e){
  e.preventDefault();
  touch = e.touches[0];
  begindraw({x:touch.pageX, y: touch.pageY});
});

canvas.addEventListener('touchmove', function(e){
  e.preventDefault();
  if(isMouseDown){
    touch = e.touches[0];
    movedraw({x:touch.pageX, y:touch.pageY});
  }
});

canvas.addEventListener('touchend', function(e){
  e.preventDefault();
  isMouseDown = false;
});

function windowToCanvas(x, y){
  var bbox = canvas.getBoundingClientRect();
  return {x: Math.round(x-bbox.left), y: Math.round(y-bbox.top)}
}

function drawGrid() {
  context.save();
  // 画外框
  context.beginPath();
  context.moveTo(3,3);
  context.lineTo(canWidth - 3, 3);
  context.lineTo(canWidth - 3, canHeight - 3);
  context.lineTo(3, canHeight - 3);
  context.closePath();

  context.lineWidth = 6;
  context.strokeStyle = "red";
  context.stroke();

  // 画对角线
  context.beginPath();
  context.moveTo(0,0);
  context.lineTo(canWidth, canHeight);

  context.moveTo(canWidth, 0);
  context.lineTo(0, canHeight);

  context.moveTo(canWidth/2, 0);
  context.lineTo(canWidth/2, canHeight);

  context.moveTo(0, canHeight/2);
  context.lineTo(canWidth, canHeight/2);

  context.lineWidth = 1;
  context.stroke();

  context.restore();
}