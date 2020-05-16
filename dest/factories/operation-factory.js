"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sheetReader = _interopRequireDefault(require("./utils/sheet-reader"));

var _orderer = _interopRequireDefault(require("./data-modules/orderer"));

var _dataFactory = _interopRequireDefault(require("../factories/data-factory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let DEFAULT_OFFSET_TICKS = 40;
let DEFAULT_OFFSET_PERIOD = 40;

class OperationFactory {
  constructor() {
    this.isTimeFrameValid = forbiddenPeriods => new Promise((resolve, reject) => {
      try {
        const currentTime = "".concat(new Date().getHours(), ":").concat(new Date().getMinutes());
        forbiddenPeriods.forEach(forbiddenPeriod => {
          if (currentTime > forbiddenPeriod.begin && currentTime < forbiddenPeriod.end) {
            resolve(false);
          }

          resolve(true);
        });
      } catch (e) {
        reject("Error checking Time frame for validation: ".concat(e));
      }
    });

    this.isSupportLineBuyable = (stockName, candle) => new Promise(async (resolve, reject) => {
      const currentPrice = await _sheetReader.default.retrieveStockPriceFromSheet(stockName).catch(error => reject(error));
      const workingSupportLine = await _dataFactory.default.workingSupportLine(stockName).catch(error => reject(error)); // console.log(`Working support line at ${workingSupportLine}`);

      const buyThresholdPrice = workingSupportLine + DEFAULT_OFFSET_TICKS;
      const buyThresholdTime = new Date(candle.closingTime).valueOf() / 1000 - new Date().valueOf() / 1000;

      try {
        if (currentPrice > buyThresholdPrice && buyThresholdTime > DEFAULT_OFFSET_PERIOD) {
          resolve(true);
        }
      } catch (e) {
        reject(e);
      }

      resolve(false);
    });

    this.isResistenceLineSellable = (stockName, candle) => new Promise(async (resolve, reject) => {
      const currentPrice = await _sheetReader.default.retrieveStockPriceFromSheet(stockName).catch(error => reject(error));
      const workingResistenceLine = await _dataFactory.default.workingResistenceLine(stockName).catch(error => reject(error));
      const sellThresholdPrice = workingResistenceLine - DEFAULT_OFFSET_TICKS;
      const sellThresholdTime = new Date(candle.closingTime).valueOf() / 1000 - new Date().valueOf() / 1000;

      try {
        if (currentPrice < sellThresholdPrice && sellThresholdTime > DEFAULT_OFFSET_PERIOD) {
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
  }

}

var _default = new OperationFactory();

exports.default = _default;