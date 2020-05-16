"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _stocker = _interopRequireDefault(require("./data-modules/stocker"));

var _sheetReader = _interopRequireDefault(require("./utils/sheet-reader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DataFactory {
  constructor() {
    this.workingSupportLine = stockName => new Promise(async (resolve, reject) => {
      let supportLines = await this.supportLines(stockName).catch(error => reject(error));
      let stockCurrentPrice = await this.currentStockPrice(stockName).catch(error => reject(error));

      try {
        let supportLine = supportLines.reduce(function (prev, curr) {
          if (curr > stockCurrentPrice) return prev;
          return Math.abs(curr - stockCurrentPrice) < Math.abs(prev - stockCurrentPrice) ? curr : prev;
        });
        resolve(supportLine);
      } catch (e) {
        reject(e);
      }
    });

    this.workingResistenceLine = stockName => new Promise(async (resolve, reject) => {
      let resistenceLines = await this.resistenceLines(stockName).catch(error => reject(error));
      let stockCurrentPrice = await this.currentStockPrice(stockName).catch(error => reject(error));

      try {
        let resistenceLine = resistenceLines.reduce(function (prev, curr) {
          if (curr < stockCurrentPrice) return prev;
          return Math.abs(curr - stockCurrentPrice) < Math.abs(prev - stockCurrentPrice) ? curr : prev;
        });
        resolve(resistenceLine);
      } catch (e) {
        reject(e);
      }
    });

    this.resistenceLines = stockName => new Promise(async (resolve, reject) => {
      let resistenceLines = await _sheetReader.default.retrieveResistenceLinesFromSheet(stockName).catch(error => reject(error));
      resolve(resistenceLines);
    });

    this.supportLines = stockName => new Promise(async (resolve, reject) => {
      let supportLines = await _sheetReader.default.retrieveSupportLinesFromSheet(stockName).catch(error => reject(error));
      resolve(supportLines);
    });

    this.currentStockPrice = stockName => new Promise(async (resolve, reject) => {
      let currentPrice = await _sheetReader.default.retrieveStockPriceFromSheet(stockName).catch(error => reject(error));
      resolve(currentPrice);
    });

    this.forbiddenPeriods = () => new Promise(async (resolve, reject) => {
      let forbiddenPeriods = await _stocker.default.retrieveForbiddenPeriods().catch(error => reject(error));
      resolve(forbiddenPeriods);
    });
  }

}

var _default = new DataFactory();

exports.default = _default;