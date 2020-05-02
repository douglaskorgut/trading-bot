"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _orderer = _interopRequireDefault(require("./data-modules/orderer"));

var _stocker = _interopRequireDefault(require("./data-modules/stocker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DataFactory {
  constructor() {
    this.currentStockPrice = stockName => new Promise(async (resolve, reject) => {
      let currentPrice = await _stocker.default.retrieveCurrentStockPrice(stockName).catch(error => reject(error));
      resolve(currentPrice);
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
  }

}

var _default = new DataFactory();

exports.default = _default;