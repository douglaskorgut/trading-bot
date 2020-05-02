"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.regexp.split");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let instance = null;

class rawDataRetriever {
  constructor() {
    if (!instance) {
      instance = this;
    }

    return instance;
  }

  async retrieveCurrentTime() {
    return new Date().toISOString().split("T")[1].split('.')[0];
  }

  async retrieveForbiddenPeriods() {
    return new Promise((resolve, reject) => {
      _fs.default.readFile("".concat(_path.default.dirname(__dirname), "/files/forbidden_periods.json"), (err, data) => {
        if (err) {
          reject("Error retrieving forbidden periods ".concat(err.message));
        }

        try {
          const forbiddenPeriodsJSON = JSON.parse(data.toString());
          Object.values(forbiddenPeriodsJSON).forEach(forbiddenPeriods => {
            const resultForbiddenPeriods = forbiddenPeriods.map(forbiddenPeriod => {
              const interval = forbiddenPeriod.split("/");
              return {
                'begin': interval[0],
                'end': interval[1]
              };
            }, []);
            resolve(resultForbiddenPeriods);
          });
        } catch (error) {
          reject("Error retrieving forbidden periods: ".concat(error.message));
        }
      });
    });
  }

}

var _default = rawDataRetriever;
exports.default = _default;