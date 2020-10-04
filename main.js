import { tles } from "./assets/data/tles.json";
import p5 from "p5";
import Manager from "./js/manager";

const sketch = p => {
  const ratio = 400 / 6378137;
  const satScale = 0.1;
  const orbRatio = ratio * (1.0 / satScale + 1);

  let cam;
  let orbitAngle = 5;
  let target;

  let earthImg;
  let satelliteModel;
  const earthRadius = 400;

  let manager;

  const earthView = () => {
    p.translate(0,0,0);
    p.scale(1.0);
    if(!(p.mouseIsPressed && p.mouseButton === p.RIGHT))
      p.orbitControl(1, 1, 0.05);
    p.texture(earthImg);
    p.sphere(earthRadius);
    let distanceFromSurface = p.createVector(0, 0, 0).dist(p.createVector(cam.eyeX, cam.eyeY, cam.eyeZ));
    if (distanceFromSurface < 450) {
      cam.move(0, 0, 450 - distanceFromSurface);
    } else if (distanceFromSurface > 8000) {
      cam.move(0, 0, 8000 - distanceFromSurface);
    }
  };

  p.preload = () => {
    earthImg = p.loadImage('assets/models/earth.jpg');
    satelliteModel = p.loadModel('assets/models/satellite.obj', true);
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    cam = p.createCamera();
    target = p.createVector(0, 0, 0);
    manager = new Manager();

    for (let tle of tles) {
      manager.load(tle);
    }
  };

  p.draw = () => {
    manager.update();
    p.background(0);
    p.noStroke();
    earthView();

    const names = manager.getAllNames();
    let first = true;
    for (let name of names) {
      let x, y, z;
      [x, y, z] = manager.getPos(name);
      x *= orbRatio;
      y *= orbRatio;
      z *= orbRatio;
        if (first) {
          console.log(name, x, y, z);
          first = false;
        }
      p.push();
      {
        p.scale(satScale);
        p.translate(x, y, z);
        p.fill(255, 0, 0);
        p.model(satelliteModel);
      }
      p.pop();
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight, true);
  };
};

new p5(sketch);