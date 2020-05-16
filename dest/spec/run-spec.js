"use strict";

var _dataFactory = _interopRequireDefault(require("/src/factories/data-factory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('Calculator', () => {
  it('should add two numbers', () => {
    let currentStockPrice = _dataFactory.default.currentStockPrice('WINM20');

    expect(currentStockPrice).toBe(10);
  });
});