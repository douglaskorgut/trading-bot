"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _xlsx = _interopRequireDefault(require("xlsx"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let instance = null;

class SheetReader {
  constructor() {
    if (!instance) {
      instance = this;
    }

    const workbook = _xlsx.default.readFile("".concat(_path.default.dirname(__dirname), "/files/winm20_streaming.xlsx"));

    const firstSheetName = workbook.SheetNames[0];
    this.worksheet = workbook.Sheets[firstSheetName];
    return instance;
  }

  readCell(cellAddress) {
    const cell = this.worksheet[cellAddress];

    if (cell) {
      return cell.v;
    } else {
      throw Error("".concat(cellAddress, " is empty. No value will be returned!"));
    }
  }

}

;
var _default = SheetReader;
exports.default = _default;