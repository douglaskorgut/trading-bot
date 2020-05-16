"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.split");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.to-string");

var _fs = _interopRequireDefault(require("fs"));

var _sheetReader = _interopRequireDefault(require("../utils/sheet-reader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Stocker {
  constructor() {
    this.retrieveForbiddenPeriods = () => new Promise(async (resolve, reject) => {
      _fs.default.readFile("/Users/douglaskorgut/Desktop/trading-bot-js/files/forbidden_periods.json", (err, data) => {
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

    this.retrieveCurrentStockPrice = stockName => new Promise(async (resolve, reject) => {
      let currentStockPrice = await _sheetReader.default.retrieveStockPriceFromSheet(stockName).catch(error => {
        reject(error);
      });
      resolve(currentStockPrice);
    });
  }

}

var _default = new Stocker();

exports.default = _default;