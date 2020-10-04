import { tles } from "./assets/data/tles.json";
import p5 from "p5";
import projector from "ecef-projector";
import Manager from "./js/manager";

var hasSwitched = false;
var view = 0;
//0 -> earth
//1 -> space
//2 -> sattelite

var latitude = 30;
var longitude = 0;
var altitude = 6378137*2;

let chosenSat = null;

const EarthViewAlt = 6378137*2;
const SpaceViewAlt = 6378137*0.20;

const sketch = p => {
  const ratio = 400 / 6378137;
  const satScale = 0.1;
  const orbRatio = ratio * (1.0 / satScale + 1);

  let cam;

  let earthImg;
  let satelliteModel;
  const earthRadius = 400;

  let manager;

  const setPosition = () => {
    let cameraLocation = projector.project(latitude,longitude,altitude);
    let x = cameraLocation[0] * ratio;
    let y = cameraLocation[1] * ratio;
    let z = cameraLocation[2] * ratio;
    cam.setPosition(x, y, z);
  };

  const earthView = () => {
    if (!hasSwitched) {
      altitude = EarthViewAlt;
      setPosition();
      cam.lookAt(0, 0, 0);
      hasSwitched = true;
    }
  };

  const spaceView = () => {
    if (!hasSwitched) {
      altitude = SpaceViewAlt;
      let viewPoint = projector.project(latitude,longitude,altitude+10000000);
      let x = viewPoint[0] * ratio;
      let y = viewPoint[1] * ratio;
      let z = viewPoint[2] * ratio;
      setPosition();
      cam.lookAt(x, y, z);
      hasSwitched = true;
    }
  };

  const satteliteView = () => {
    if(!hasSwitched){
      if(chosenSat === null)
        chosenSat = manager.map.entries().next().value[1];
      console.log(chosenSat);
      latitude = chosenSat.latitude;
      longitude = chosenSat.longitude;
      altitude = chosenSat.height - 10;
      console.log(latitude, longitude, altitude);
      setPosition();
      cam.lookAt(0, 0, 0);
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
  };

  p.keyPressed = () => {
    if (view == 0) {
      if (p.keyCode === p.LEFT_ARROW) {
        latitude += 5;
      } else if (p.keyCode === p.RIGHT_ARROW) {
        latitude -= 5;
      } else if (p.keyCode === p.DOWN_ARROW) {
        longitude += 5;
      } else if (p.keyCode === p.UP_ARROW) {
        longitude -= 5;
      }
      hasSwitched = false;
    } else {
      if (p.keyCode === p.LEFT_ARROW) {
        cam.pan(0.2);
      } else if (p.keyCode === p.RIGHT_ARROW) {
        cam.pan(-0.2);
      } else if (p.keyCode === p.DOWN_ARROW) {
        cam.tilt(0.2);
      } else if (p.keyCode === p.UP_ARROW) {
        cam.tilt(-0.2);
      }
    }
  };

  p.keyTyped = () => {
    console.log(p.key);
    if (p.key === 'a') {
      view = 0;
      hasSwitched = false;
    } else if (p.key === 'b') {
      view = 1;
      hasSwitched = false;
    } else if (p.key === 'c') {
      view = 2;
      hasSwitched = false;
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight, true);
  };
};

new p5(sketch);
