import { getSatelliteInfo, getVisibleSatellites, getGroundTracksSync, getSatelliteName } from "tle.js";
import projector from "ecef-projector";
import { tles } from "./tles.json";
import p5 from "p5";

const tle = `ISS (ZARYA)             
1 25544U 98067A   20277.45255787  .00002170  00000-0  47783-4 0  9994
2 25544  51.6442 172.7662 0001229  98.7431 246.4350 15.48827376248796`;

function getOrbit(tle, timestamp, height) {
  const orbit = getGroundTracksSync({
    tle: tle,
    startTimeMS: timestamp,
    stepMS: 1000,
    isLngLatFormat: true
  });
  return orbit[1].map(latlng => {
    return projector.project(latlng[0], latlng[1], height);
  });
}

function makeStruct(tle, info, orbit) {
  const name = getSatelliteName(tle);
  const xyz = projector.project(info.lat, info.lng, info.height);
  return {
    orbit: orbit,
    x: xyz[0],
    y: xyz[1],
    z: xyz[2],
    latitude: info.lat,
    longitude: info.lng,
    height: info.height,
    velocity: info.velocity,
    elevation: info.elevation,
    azimuth: info.azimuth,
    name: name
  };
}

function getSatellite(tle, timestamp, groundLat, groundLng, groundHeight) {
  const info = getSatelliteInfo(tle, timestamp, groundLat, groundLng, groundHeight);
  const orbit = getOrbit(tle, timestamp, info.height);
  return makeStruct(tle, info, orbit);
}

function getAllVisible(tles, timestamp, groundLat, groundLng, groundHeight) {
  const arrs = tles.map(tle => tle[0].split('\n').slice(0, 3));
  const all = getVisibleSatellites({
    observerLat: groundLat,
    observerLng: groundLng,
    observerHeight: groundHeight,
    tles: arrs,
    elevationThreshold: 0,
    timestamp: timestamp
  });

  return all.map(sat => {
    const tleStr = sat.tleArr.join('\n');
    const orbit = getOrbit(tleStr, timestamp, sat.info.height);
    return makeStruct(tleStr, sat.info, orbit);
  });
}
console.log(projector.project(0, 0, 0));
// console.log(getSatellite(tle, Date.now(), 30, -110, 0));
// console.log(getAllVisible(tles, Date.now(), -50, 80, 0));
// for (let i = -90; i <= 90; i += 10) {
//   for (let j = -180; j <= 180; j += 10) {
//     const all = getAllVisible(tles, Date.now(), i, j, 1);
//     if (all.length > 0) {
//       console.log(i, j, all);
//     }
//   }
// }
const info = getSatellite(tle, Date.now(), 0, 0, 0);
const sketch = p => {
  let earth;
  const ratio = 400 / 6378137;

  let camera;
  let orbitAngle = 5;
  let target;
  let which = 0;

  p.preload = () => {

  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    camera = p.createCamera();
    target = p.createVector(0,0,0);
  };

  p.draw = () => {
    p.background(0);
    p.noStroke();
    if(!(p.mouseIsPressed && p.mouseButton === p.RIGHT))
      p.orbitControl(1,1,0.01);
    p.translate(0,0,0);
    p.fill(255);
    p.sphere(400);
    let x = info.orbit[which][0] * ratio;
    let y = info.orbit[which][1] * ratio;
    let z = info.orbit[which][2] * ratio;
    p.translate(x, y, z);
    p.fill(255, 0, 0);
    p.sphere(10);
    which++;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight, true);
  };
};

new p5(sketch);