"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.split");

class TimeReader {
  constructor() {
    this.currentTime = () => new Promise((resolve, reject) => {
      let currentTime = new Date().toISOString().split("T")[1].split('.')[0];

      if (currentTime) {
        resolve(currentTime);
      } else {
        reject('Error retrieving current time');
      }
    });
  }

}

var _default = new TimeReader();

exports.default = _default;