var earth;
var earthRadius = 400;
var sattelite;

var cam;

let view = 0;
//0 -> earth, 1 -> space, 2 -> sattelite

function preload() {
  earthImg = loadImage('assets/models/earth.jpg');
  sattelite = loadModel('assets/models/sattelite.obj', true);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  cam = createCamera();
}

function draw() {
  background(0);
  noStroke();
  switch (view) {
    case 0:
      earthView();
      break;
    case 1:
      spaceView();
      break;
    case 2:
      satteliteView();
      break;
    default:
  }
}

function switchToEarthView(){
  let distanceFromSurface = createVector(0,0,0).dist(createVector(cam.eyeX,cam.eyeY,cam.eyeZ));
  cam.move(0,0,800-distanceFromSurface);
  cam.lookAt(0,0,0);
  view = 0;
}

function switchToSpaceView(){
  let distanceFromSurface = createVector(0,0,0).dist(createVector(cam.eyeX,cam.eyeY,cam.eyeZ));
  cam.move(0,0,earthRadius-distanceFromSurface);
  cam.lookAt(cam.eyeX,cam.eyeY,cam.eyeZ+100);
  view = 1;
}

function switchToSatteliteView(){
  view = 2;
}

function keyPressed(){ //replace with buttons
  if(keyCode === LEFT_ARROW){
    switchToSpaceView();
  else if(keyCode === RIGHT_ARROW)
    switchToEarthView();
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight, true);
}
