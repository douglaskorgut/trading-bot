"use strict";

var _dataFactory = _interopRequireDefault(require("./factories/data-factory"));

var _candleFactory = _interopRequireDefault(require("./factories/candle-factory"));

var _operationFactory = _interopRequireDefault(require("./factories/operation-factory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const STOCK_NAME = 'WINM20';
let state = {
  position: 'none',
  workingCandle: undefined
};

async function run() {
  const forbiddenPeriods = await _dataFactory.default.forbiddenPeriods().catch(error => {
    throw error;
  });
  const isTimeFrameValid = await _operationFactory.default.isTimeFrameValid(forbiddenPeriods).catch(error => {
    throw error;
  });
  console.log('\nTrading-bot running');

  if (isTimeFrameValid) {
    console.log('Valid current time frame. Starting candle...');
    let workingCandle = await _candleFactory.default.startCandle(STOCK_NAME).catch(error => {
      throw error;
    });
    state.workingCandle = workingCandle;
    console.log("Candle started with price ".concat(workingCandle.currentPrice, ". "));
    let botRunner = setInterval(async function () {
      let isSupportLineBuyable = await _operationFactory.default.isSupportLineBuyable(STOCK_NAME, workingCandle).catch(error => {
        throw error;
      });
      const supportLineValidationMessage = isSupportLineBuyable ? 'Support line is valid! Creating order...' : 'Invalid support line. Moving on to next validation.'; // console.log(`${supportLineValidationMessage}`);

      const isResistencelineSellable = await _operationFactory.default.isResistenceLineSellable(STOCK_NAME, workingCandle).catch(error => {
        throw error;
      });
      const resistenceLineValidationMessage = isResistencelineSellable ? 'Resistence line is valid! Creating order...' : 'Invalid resistence line. Moving on to next validation.'; // console.log(`${resistenceLineValidationMessage}`);
      // console.log(`${resistenceLineValidationMessage}`);
    }, 1000);
  }
}

run().catch(error => {
  console.log(error);
});