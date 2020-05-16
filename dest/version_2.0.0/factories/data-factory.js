"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _orderer = _interopRequireDefault(require("./data-modules/orderer"));

var _stocker = _interopRequireDefault(require("./data-modules/stocker"));

var _sheetReader = _interopRequireDefault(require("./utils/sheet-reader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let DEFAULT_OFFSET_TICKS = 40;
let DEFAULT_OFFSET_PERIOD = 40;

class DataFactory {
  constructor() {
    this.workingSupportLine = stockName => new Promise(async (resolve, reject) => {
      let supportLines = await this.supportLines(stockName).catch(error => reject(error));
      let stockCurrentPrice = await this.currentStockPrice(stockName).catch(error => reject(error));

      try {
        let supportLine = supportLines.reduce(function (prev, curr) {
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

    this.isSupportLineBuyable = (supportLines, stockName, candleClosingTime) => new Promise(async (resolve, reject) => {
      let currentPrice = await _sheetReader.default.retrieveStockPriceFromSheet(stockName).catch(error => reject(error));
      let workingSupportLine = await this.workingSupportLine(stockName).catch(error => reject(error));

      try {
        if (currentPrice > workingSupportLine + DEFAULT_OFFSET_TICKS && candleClosingTime.getSeconds() - new Date().getSeconds() > DEFAULT_OFFSET_PERIOD) {
          resolve(true);
        }
      } catch (e) {
        reject(e);
      }

      resolve(false);
    });

    this.isResistenceLineSellable = (resistenceLines, stockName, candleClosingTime) => new Promise(async (resolve, reject) => {
      let currentPrice = await _sheetReader.default.retrieveStockPriceFromSheet(stockName).catch(error => reject(error));
      let workingResistenceLine = await this.workingResistenceLine(stockName).catch(error => reject(error));

      try {
        if (currentPrice > workingResistenceLine - DEFAULT_OFFSET_TICKS && candleClosingTime.getSeconds() - new Date().getSeconds() > DEFAULT_OFFSET_PERIOD) {
          resolve(true);
        }
      } catch (e) {
        reject(e);
      }

      resolve(false);
    });

    this.createOrder = async (candleContext, type) => new Promise((resolve, reject) => {
      let order;

      switch (type) {
        case 'buy':
          order = _orderer.default.createBuyOrder(candleContext);
          break;

        case 'sell':
          order = _orderer.default.createSellOrder(candleContext);
          break;

        default:
          reject("".concat(type, " operation not found!"));
          break;
      }

      resolve(order);
    });

    this.forbiddenPeriods = () => new Promise(async (resolve, reject) => {
      let forbiddenPeriods = await _stocker.default.retrieveForbiddenPeriods().catch(error => reject(error));
      resolve(forbiddenPeriods);
    });
  }

}

var _default = new DataFactory();

exports.default = _default;