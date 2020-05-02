"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.regexp.split");

var _sheetReader = _interopRequireDefault(require("./sheet-reader"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let instance = null;

class DataRetriever {
  constructor() {
    if (!instance) {
      instance = this;
    }

    this.sheetReader = new _sheetReader.default();
    return instance;
  }

  retrieveCurrentTime() {
    return new Date().toISOString().split("T")[1].split('.')[0];
  }

  async retrieveForbiddenPeriods() {
    return new Promise((resolve, reject) => {
      _fs.default.readFile("".concat(_path.default.dirname(__dirname), "/files/forbidden_periods.json"), (err, data) => {
        if (err) {
          throw Error("Error retrieving forbidden periods ".concat(err.message));
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

  async retrieveCurrentStockPrice(stockName) {
    return new Promise((resolve, reject) => {
      let cellAddress = null;

      switch (stockName.toUpperCase()) {
        case 'WINM20':
          cellAddress = "A1";
          break;

        case 'WINJ20':
          cellAddress = 'F1';
          break;

        default:
          reject("".concat(stockName, " not found on registered stocks"));
      }

      if (cellAddress) {
        try {
          resolve(this.sheetReader.readCell(cellAddress));
        } catch (error) {
          reject(Error(error));
        }
      }
    });
  }

  async retrieveFirstCandle(stockName) {
    return new Promise((resolve, reject) => {
      let firstCandle = {
        'openingPrice': undefined,
        'closingPrice': undefined,
        'topPrice': undefined,
        'bottomPrice': undefined,
        'openingTime': new Date(),
        'closingTime': undefined
      };
      let currentStockPrice = null;
      this.retrieveCurrentStockPrice(stockName).then(_currentStockPrice => {
        if (!firstCandle.openingPrice) {
          firstCandle.openingPrice = _currentStockPrice;
          firstCandle.bottomPrice = _currentStockPrice;
          firstCandle.topPrice = _currentStockPrice;
          firstCandle.closingPrice = _currentStockPrice;
        }

        currentStockPrice = _currentStockPrice; // Execute loop while 5 min candle-modules isn't achieved

        let interval = setInterval(function () {
          if (!firstCandle.closingTime) {
            // Check if 5 minute candle-modules has been achieved
            if (new Date().toISOString().split("T")[1].split('.')[0].split(':')[1].split(':')[0] % 5 === 0) {
              firstCandle.closingTime = new Date();
              firstCandle.closingPrice = currentStockPrice;
            } else {
              // Setting first candle-modules params
              if (currentStockPrice > firstCandle.topPrice) firstCandle.topPrice = currentStockPrice;
              if (firstCandle.bottomPrice > currentStockPrice) firstCandle.bottomPrice = currentStockPrice;
            }
          } else {
            clearInterval(interval);
            resolve(firstCandle);
          }
        }, 5000);
      });
    });
  }

}

var _default = DataRetriever;
exports.default = _default;
