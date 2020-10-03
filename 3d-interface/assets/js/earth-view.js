function earthView(){
  translate(0,0,0);
  if(!(mouseIsPressed && mouseButton === RIGHT))
    orbitControl(1,1,0.05);
  texture(earthImg);
  sphere(earthRadius);
  clip();
}
clip(){
  let distanceFromSurface = createVector(0,0,0).dist(createVector(cam.eyeX,cam.eyeY,cam.eyeZ));
  if(distanceFromSurface < 450)
    cam.move(0,0,450-distanceFromSurface);
  else if(distanceFromSurface > 8000)
    cam.move(0,0,8000-distanceFromSurface);
}
