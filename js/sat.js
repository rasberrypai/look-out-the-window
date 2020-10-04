import { getSatelliteName } from "tle.js";
import projector from "ecef-projector";

class Sat {
  constructor(tleStr, info) {
    const name = getSatelliteName(tleStr);
    const xyz = projector.project(info.lat, info.lng, info.height);
    this.azimuth = info.azimuth;
    this.x = xyz[0];
    this.y = xyz[1];
    this.z = xyz[2];
    this.latitude = info.lat;
    this.longitude = info.lng;
    this.height = info.height;
    this.velocity = info.velocity;
    this.elevation = info.elevation;
    this.azimuth = info.azimuth;
    this.name = name;
    this.tleStr = tleStr;
  }
}

export default Sat;
