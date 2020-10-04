function earthView(){
  zoomOutThreshold = 8000;
  zoomInThreshold = 450;
  translate(0,0,0);
  orbitControl(1,1,0.05);
  texture(earthImg);
  sphere(earthRadius);
}
