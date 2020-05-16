"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xlsx = _interopRequireDefault(require("xlsx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class SheetReader {
  constructor() {
    const workbook = _xlsx.default.readFile("/Users/douglaskorgut/Desktop/trading-bot-js/files/winm20_streaming.xlsx");

    const firstSheetName = workbook.SheetNames[0];
    this._worksheet = workbook.Sheets[firstSheetName];

    this.getCurrentPriceCellAddress = stockName => new Promise(async (resolve, reject) => {
      let cellAddress = null;

      switch (stockName.toUpperCase()) {
        case 'WINM20':
          cellAddress = "B2";
          break;

        case 'WINJ20':
          cellAddress = 'F1';
          break;

        default:
          reject("".concat(stockName, " not found on registered stocks"));
      }

      ;
      return resolve(cellAddress);
    });

    this.retrieveSupportLinesFromSheet = stockName => new Promise(async (resolve, reject) => {
      const resistenceLines = [];
      const firstCellNumber = 2;
      const lastCellNumber = 5;

      for (let counter = firstCellNumber; counter <= lastCellNumber; counter++) {
        try {
          resistenceLines.push(this._worksheet["C".concat(counter)].v);
        } catch (e) {
          reject(e);
        }
      }

      resolve(resistenceLines);
    });

    this.retrieveResistenceLinesFromSheet = stockName => new Promise(async (resolve, reject) => {
      const resistenceLines = [];
      const firstCellNumber = 2;
      const lastCellNumber = 5;

      for (let counter = firstCellNumber; counter <= lastCellNumber; counter++) {
        try {
          resistenceLines.push(this._worksheet["D".concat(counter)].v);
        } catch (e) {
          reject(e);
        }
      }

      resolve(resistenceLines);
    });

    this.retrieveStockPriceFromSheet = stockName => new Promise(async (resolve, reject) => {
      let cellAddress = await this.getCurrentPriceCellAddress(stockName).catch(error => reject(error));

      if (cellAddress) {
        try {
          const cell = this._worksheet[cellAddress];

          if (cell) {
            resolve(cell.v);
          } else {
            reject("".concat(cellAddress, " is empty. No value will be returned!"));
          }
        } catch (error) {
          reject(error);
        }
      }
    });
  }

}

;

var _default = new SheetReader();

exports.default = _default;