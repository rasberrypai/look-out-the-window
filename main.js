import { tles } from "./assets/data/tles.json";
import p5 from "p5";
import projector from "ecef-projector";
import Manager from "./js/manager";

var hasSwitched = false;
var view = 0;
//0 -> earth
//1 -> space
//2 -> sattelite

var latitude = 40;
var longitude = -120;
var altitude = 6378137*2;

let chosenSat = null;
let satIdx = 35;

const EarthViewAlt = 6378137*2;
const SpaceViewAlt = 6378137*0.20;
const EarthRadius = 6378137;

function project(lat, lng, alt) {
  return [
    (alt + EarthRadius) * -Math.sin(lng * Math.PI / 180) * Math.cos(lat * Math.PI / 180),
    (alt + EarthRadius) * -Math.sin(lat * Math.PI / 180),
    (alt + EarthRadius) * -Math.cos(lng * Math.PI / 180) * Math.cos(lat * Math.PI / 180)
  ];
}

const sketch = p => {
  const ratio = 2000 / 6378137;
  const satScale = 0.3;
  const orbRatio = ratio * (1.0 / satScale + 1);

  let cam;
  let manager;

  let lastX = 0;
  let lastY = 0;

  let earthImg;
  let satelliteModel;
  const earthRadius = 2000;

  const setPosition = () => {
    let cameraLocation = project(latitude,longitude,altitude);
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
      // altitude = SpaceViewAlt;
      altitude = 300;
      let viewPoint = project(latitude,longitude,altitude+10000000);
      let x = viewPoint[0] * ratio;
      let y = viewPoint[1] * ratio;
      let z = viewPoint[2] * ratio;
      setPosition();
      cam.lookAt(x, y, z);
      hasSwitched = true;
    }
  };

  const satteliteView = () => {
    if (!hasSwitched) {
      chosenSat = Array.from(manager.map.values())[satIdx];
      latitude = chosenSat.latitude;
      longitude = chosenSat.longitude;
      altitude = 1000 * chosenSat.height - 10;
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
    p.createCanvas(p.windowWidth, p.windowHeight-parseInt(getComputedStyle(document.getElementById("bar")).height,10), p.WEBGL);
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
    if (view == 1) {
      p.sphere(earthRadius * 0.95);
    } else {
      p.sphere(earthRadius);
    }

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
        p.strokeWeight(0.25);
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
        longitude -= 5;
        hasSwitched = false;
      } else if (p.keyCode === p.RIGHT_ARROW) {
        longitude += 5;
        hasSwitched = false;
      } else if (p.keyCode === p.DOWN_ARROW) {
        latitude -= 5;
        hasSwitched = false;
      } else if (p.keyCode === p.UP_ARROW) {
        latitude += 5;
        hasSwitched = false;
      }
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
    if (p.key === 'a') {
      view = 0;
      hasSwitched = false;
    } else if (p.key === 'b') {
      view = 1;
      hasSwitched = false;
    } else if (p.key === 'c') {
      view = 2;
      hasSwitched = false;
    } else if (p.key === 'z') {
      altitude -= 500000;
    } else if (p.key === 'x') {
      altitude += 500000;
    }
    setPosition();
  };

  p.mouseDragged = () => {
    const dx = p.mouseX - lastX;
    const dy = p.mouseY - lastY;
    if (view == 0) {
      if (dx !== NaN && dy !== NaN) {
        longitude -= dx / 100;
        latitude += dy / 100;
        hasSwitched = false;
      }
    } else {
      if (dx !== NaN && dy !== NaN) {
        cam.pan(-dx / 10000);
        cam.tilt(-dy / 10000);
      }
    }
    if (latitude > 90) {
      latitude = 90;
    }
    if (latitude < -90) {
      latitude = -90;
    }
  };

  p.mouseMoved = () => {
    lastX = p.mouseX;
    lastY = p.mouseY;
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight, true);
  };
  window.switchToEarthView = () => {
    view = 0;
    hasSwitched = false;
  };

  window.switchToSpaceView = () => {
    view = 1;
    hasSwitched = false;
  };

  window.switchToSatelliteView = () => {
    view = 2;
    hasSwitched = false;
    let len = manager.map.size;
    satIdx = Math.floor(len * Math.random());
  };
};

new p5(sketch);
