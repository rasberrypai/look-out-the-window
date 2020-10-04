import { tles } from "./assets/data/tles.json";
import p5 from "p5";
import projector from "ecef-projector";
import Manager from "./js/manager";

var hasSwitched = false;
var view = 1;
//0 -> earth
//1 -> space
//2 -> sattelite

var latitude = 0;
var longitude = 0;
var altitude = 6378137*2;

var chosenSat;

const EarthViewAlt = 6378137*2;
const SpaceViewAlt = 6378137;

const sketch = p => {
  const ratio = 400 / 6378137;
  const satScale = 0.1;
  const orbRatio = ratio * (1.0 / satScale + 1);

  let cam;

  let earthImg;
  let satelliteModel;
  const earthRadius = 400;

  let manager;

  const earthView = () => {
    if(!hasSwitched){
      altitude = EarthViewAlt;
      cam.lookAt(0,0,0);
      hasSwitched = true;
    }
  };

  const spaceView = () => {
    if(switched){
      altitude = SpaceViewAlt;
      let viewPoint = projector.project(latitude,longitude,SpaceViewAlt+1000000);
      x = viewPoint[0] * ratio;
      y = viewPoint[1] * ratio;
      z = viewPoint[2] * ratio;
      cam.lookAt(x,y,z);
      hasSwitched = true;
    }
  };

  const satteliteView = () => {
    if(switched){
      if(chosenSat == null)
        chosenSat = manager.map.values[0];
      let x,y,z;
      [x,y,z] = project.project(chosenSat.latitude,chosenSat.longitude,chosenSat.altitude-10);
      latitude = x * orbRatio;
      longitude = y * orbRatio;
      altitude = z * orbRatio;
      cam.lookAt(0,0,0);
      hasSwitched = true;
    }
  };

  p.preload = () => {
    earthImg = p.loadImage('assets/models/earth.jpg');
    satelliteModel = p.loadModel('assets/models/satellite.obj', true);
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    cam = p.createCamera();
    manager = new Manager();

    for (let tle of tles) {
      manager.load(tle);
    }
  };

  p.draw = () => {
    manager.update();
    p.background(0);
    p.noStroke();

    p.translate(0,0,0);
    p.scale(1.0);
    p.texture(earthImg);
    p.sphere(earthRadius);

    const names = manager.getAllNames();
    for (let name of names) {
      let x, y, z;
      [x, y, z] = manager.getPos(name);
      x *= orbRatio;
      y *= orbRatio;
      z *= orbRatio;
      p.push();
      {
        p.scale(satScale);
        p.translate(x, y, z);
        p.stroke(100);
        p.strokeWeight(1);
        p.fill(200);
        p.model(satelliteModel);
      }
      p.pop();
    }

    switch(view){
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
        break;
    }

    let cameraLocation = projector.project(longitude,latitude,altitude);
    let x = cameraLocation[0] * ratio;
    let y = cameraLocation[1] * ratio;
    let z = cameraLocation[2] * ratio;
    cam.setPosition(x,y,z);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight, true);
  };
};

new p5(sketch);
