import { getSatelliteInfo, getVisibleSatellites, getGroundTracksSync, getSatelliteName } from "tle.js";
import projector from "ecef-projector";
import Sat from "./sat";

class Manager {
  constructor() {
    this.map = new Map();
    this.lat = 0;
    this.lng = 0;
    this.height = 0;
    this.startTime = Date.now();
  }

  getAllNames() {
    return this.map.keys();
  }

  getPos(name) {
    const sat = this.map.get(name);
    return [sat.x, sat.y, sat.z];
  }

  load(tleStr) {
    let sat = null;
    try {
      sat = this.getSat(tleStr, this.startTime, this.lat, this.lng, this.height);
      this.map.set(sat.name, sat);
    } catch (e) {
      sat = null;
    }
    if (sat !== null) {
      this.map.set(sat.name, sat);
    }
  }

  updateObserver(lat, lng, height) {
    this.lat = lat;
    this.lng = lng;
    this.height = height;
  }

  update() {
    for (let sat of this.map.values()) {
      this.updateSat(sat);
    }
  }

  updateSat(sat) {
    const info = getSatelliteInfo(sat.tleStr, Date.now(), this.lat, this.lng, this.height);
    sat.azimuth = info.azimuth;
    sat.elevation = info.elevation;
    sat.height = info.height;
    sat.latitude = info.lat;
    sat.longitude = info.lng;
    sat.velocity = info.velocity;
    const xyz = projector.project(sat.latitude, sat.longitude, sat.height*10000);
    sat.x = xyz[0];
    sat.y = xyz[1];
    sat.z = xyz[2];
  }

  getOrbit(tleStr, timestamp, height) {
    const orbit = getGroundTracksSync({
      tle: tleStr,
      startTimeMS: timestamp,
      stepMS: 1000,
      isLngLatFormat: true
    });
    return orbit[1].map(latlng => {
      return projector.project(latlng[0], latlng[1], height);
    });
  }

  getSat(tleStr, timestamp, groundLat, groundLng, groundHeight) {
    const info = getSatelliteInfo(tleStr, Date.now(), groundLat, groundLng, groundHeight);
    return new Sat(tleStr, info);
  }

  getAllVisible() {
    const arrs = this.map.values().map(sat => {
      return sat.tleStr.split('\n').slice(0, 3);
    });
    const all = getVisibleSatellites({
      observerLat: this.lat,
      observerLng: this.lng,
      observerHeight: this.height,
      tles: arrs,
      elevationThreshold: 0,
      timestamp: Date.now()
    });

    return all.map(sat => {
      const tleStr = sat.tleArr.join('\n');
      const name = getSatelliteName(tleStr);
      return this.map.get(name);
    });
  }
};

export default Manager;
