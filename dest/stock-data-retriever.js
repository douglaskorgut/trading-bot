"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.split");

var _sheetReader = _interopRequireDefault(require("./sheet-reader"));

var _rawDataRetriever = _interopRequireDefault(require("./raw-data-retriever"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let instance = null;

class StockDataRetriever {
  constructor() {
    if (!instance) {
      instance = this;
    }

    this.sheetReader = new _sheetReader.default();
    return instance;
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
          reject(error);
        }
      }
    });
  }

  async retrieveFirstCandle(stockName) {
    return new Promise((resolve, reject) => {
      const rawDataRetriever = new _rawDataRetriever.default();
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
            rawDataRetriever.retrieveCurrentTime().then(currentTime => {
              // Check if 5 minute candle-modules has been achieved
              if (currentTime.split(':')[1].split(':')[0] % 5 === 0) {
                firstCandle.closingTime = new Date();
                firstCandle.closingPrice = currentStockPrice;
              } else {
                // Setting first candle-modules params
                if (currentStockPrice > firstCandle.topPrice) firstCandle.topPrice = currentStockPrice;
                if (firstCandle.bottomPrice > currentStockPrice) firstCandle.bottomPrice = currentStockPrice;
              }
            }).catch(error => {
              reject(error);
            });
          } else {
            clearInterval(interval);
            resolve(firstCandle);
          }
        }, 1000);
      }).catch(error => {
        reject("Error retrieving first candle: ".concat(error));
      });
    });
  }

}

var _default = StockDataRetriever;
exports.default = _default;