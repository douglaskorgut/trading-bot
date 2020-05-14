"use strict";

var _dataFactory = _interopRequireDefault(require("./factories/data-factory"));

var _candleFactory = _interopRequireDefault(require("./factories/candle-factory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const STOCK_NAME = 'WINM20';

async function run() {
  const firstCandle = await _candleFactory.default.retrieveFirstCandle(STOCK_NAME).catch(error => {
    throw error;
  });
  const currentStockPrice = await _dataFactory.default.currentStockPrice(STOCK_NAME).catch(error => {
    throw error;
  });
  const forbiddenPeriods = await _dataFactory.default.forbiddenPeriods().catch(error => {
    throw error;
  });
  console.log(firstCandle);
  console.log(forbiddenPeriods);
  console.log(currentStockPrice);
}

run().catch(error => {
  console.log(error);
});