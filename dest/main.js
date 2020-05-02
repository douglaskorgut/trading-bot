"use strict";

var _stockDataRetriever = _interopRequireDefault(require("./stock-data-retriever"));

var _rawDataRetriever = _interopRequireDefault(require("./raw-data-retriever"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let STOCK_NAME = 'WINM20';

async function executeBot() {
  let firstCandle = null;

  try {
    const stockDataRetriever = new _stockDataRetriever.default();
    const rawDataRetriever = new _rawDataRetriever.default();

    if (!firstCandle) {
      firstCandle = await stockDataRetriever.retrieveFirstCandle(STOCK_NAME).catch(error => {
        throw error;
      });
    }

    let forbiddenPeriods = await rawDataRetriever.retrieveForbiddenPeriods().catch(error => {
      throw error;
    });
    let currentTime = await rawDataRetriever.retrieveCurrentTime().catch(error => {
      throw error;
    });
    console.log(firstCandle);
    console.log(forbiddenPeriods);
    console.log("Current time: ".concat(currentTime));
  } catch (error) {
    console.log(error);
  }
}

executeBot().then();