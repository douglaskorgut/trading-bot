"use strict";

var _dataFactory = _interopRequireDefault(require("./factories/data-factory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const STOCK_NAME = 'WINM20';

async function run() {
  const currentStockPrice = await _dataFactory.default.currentStockPrice(STOCK_NAME).catch(error => {
    throw error;
  });
}

run().catch(error => {
  console.log(error);
});