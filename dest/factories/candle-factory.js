"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es6.regexp.split");

var _sheetReader = _interopRequireDefault(require("./utils/sheet-reader"));

var _timeReader = _interopRequireDefault(require("./utils/time-reader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CandleFactory {
  constructor() {
    this.buildCandleContext = () => new Promise(async (resolve, reject) => {
      let candleContext = {
        startingTime: new Date(),
        endTime: undefined,
        candles: undefined,
        top: undefined,
        bottom: undefined
      };
    });

    this.startCandle = stockName => new Promise(async (resolve, reject) => {
      let currentStockPrice = await _sheetReader.default.retrieveStockPriceFromSheet(stockName).catch(error => {
        reject(error);
      });
      const currentTime = new Date();
      const closingTime = new Date(currentTime.setMinutes(currentTime.getMinutes() + 5));
      resolve({
        'stockName': stockName,
        'openingPrice': currentStockPrice,
        'currentPrice': currentStockPrice,
        'closingPrice': undefined,
        'topPrice': undefined,
        'bottomPrice': undefined,
        'openingTime': currentTime,
        'closingTime': closingTime
      });
    });

    this.finishCandle = (startedCandle, topPrice, bottomPrice) => new Promise(async (resolve, reject) => {
      let finishedCandle;
      let currentStockPrice = await _sheetReader.default.retrieveStockPriceFromSheet(startedCandle.stockName).catch(error => {
        reject(error);
      });

      try {
        finishedCandle = {
          'openingPrice': startedCandle.openingPrice,
          'closingPrice': currentStockPrice,
          'topPrice': topPrice,
          'bottomPrice': bottomPrice,
          'openingTime': startedCandle.openingTime,
          'closingTime': new Date()
        };
        resolve(finishedCandle);
      } catch (e) {
        reject(e);
      }
    });

    this.buildFirstCandle = stockName => new Promise(async (resolve, reject) => {
      let firstCandle = {
        'openingPrice': undefined,
        'closingPrice': undefined,
        'topPrice': undefined,
        'bottomPrice': undefined,
        'openingTime': new Date(),
        'closingTime': undefined
      };
      let currentStockPrice = await _sheetReader.default.retrieveStockPriceFromSheet(stockName).catch(error => {
        reject(error);
      });

      if (!firstCandle.openingPrice) {
        firstCandle.openingPrice = currentStockPrice;
        firstCandle.bottomPrice = currentStockPrice;
        firstCandle.topPrice = currentStockPrice;
        firstCandle.closingPrice = currentStockPrice;
      } // Execute loop while 5 min candle-modules isn't achieved


      let interval = setInterval(async function () {
        if (!firstCandle.closingTime) {
          const currentTime = await _timeReader.default.currentTime().catch(error => {
            reject(error);
          }); // Check if 5 minute candle-modules has been achieved

          if (currentTime.split(':')[1].split(':')[0] % 5 === 0) {
            firstCandle.closingTime = new Date();
            firstCandle.closingPrice = currentStockPrice;
          } else {
            // Setting first candle-modules params
            if (currentStockPrice > firstCandle.topPrice) firstCandle.topPrice = currentStockPrice;
            if (firstCandle.bottomPrice > currentStockPrice) firstCandle.bottomPrice = currentStockPrice;
          } // REMOVE


          firstCandle.closingTime = new Date();
          firstCandle.closingPrice = currentStockPrice;
        } else {
          clearInterval(interval);
          resolve(firstCandle);
        }
      }, 1000);
    });
  }

}

var _default = new CandleFactory();

exports.default = _default;