function spaceView(){
  let distanceFromSurface = createVector(0,0,0).dist(createVector(cam.eyeX,cam.eyeY,cam.eyeZ));
  cam.move(0,0,earthRadius-distanceFromSurface);
  cam.lookAt(cam.eyeX,cam.eyeY,cam.eyeZ+100);
  control();

  stroke(100);
  fill(255);
  //draw sattelites here
  //for(sattelite in sattelites)
  //if(stattelite is visible)
  //translate(x,y,z);
  //scale(0.5);
  //model(random sattelite model)
  //rotateX/Y/Z(random);
  translate(0,0,1000);
  scale(0.5);
  model(sattelite);
  clip();
}
function control(){
  
}
clip(){
  let distanceFromSurface = createVector(0,0,0).dist(createVector(cam.eyeX,cam.eyeY,cam.eyeZ));
  if(distanceFromSurface < 450)
    cam.move(0,0,450-distanceFromSurface);
  else if(distanceFromSurface > 8000)
    cam.move(0,0,8000-distanceFromSurface);
}
