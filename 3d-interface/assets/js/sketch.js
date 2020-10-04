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
let img;

function setup() {
  let canvasContainer = document.getElementById("renderer");
  let renderer = createCanvas(windowWidth,windowHeight - parseInt(getComputedStyle(document.getElementById("bar")).height,10), WEBGL);
  renderer.parent(canvasContainer);
  cam = createCamera();
}

function draw() {
  background("#181818");
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
  cam.move(0,0,distanceFromSurface-800);
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

function windowResized(){
  resizeCanvas(windowWidth, windowHeight, true);
}

let mouseXcache;
let mouseYcache;

function mousePressed(){
  if(mouseButton === LEFT){
    mouseXcache = mouseX;
    mouseYcache = mouseY;
  }
}

function mouseDragged(event){
  if(view == 0){
    if(mouseX > mouseXcache)
      console.log("right");
    else if(mouseX < mouseXcache)
      console.log("left");
    if(mouseY > mouseYcache)
      console.log("up");
    else if(mouseY < mouseYcache)
      console.log("down");
  } else if(view == 1){
    if(mouseX > mouseXcache)
      console.log("right");
    else if(mouseX < mouseXcache)
      console.log("left");
    if(mouseY > mouseYcache)
      console.log("up");
    else if(mouseY < mouseYcache)
      console.log("down");
  }
}

function mouseWheel(event){
  let distanceFromSurface = createVector(0,0,0).dist(createVector(cam.eyeX,cam.eyeY,cam.eyeZ));
  if(event.delta > 0 && ((view == 1 && distanceFromSurface < 850) || (view == 0 && distanceFromSurface > 450)))
    cam.move(0,0,-5);
  else if((view == 1 && distanceFromSurface > 400) || (view == 0 && distanceFromSurface < 8000))
    cam.move(0,0,5);
}
