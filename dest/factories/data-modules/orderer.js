"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Orderer {
  constructor() {
    this._orders = [{
      type: 'sell',
      price: 10,
      time: new Date(),
      supportPrice: 6,
      resistencePrice: 12
    }, {
      type: 'buy',
      price: 15,
      time: new Date(),
      supportPrice: 13,
      resistencePrice: 17
    }];

    this.lastOrder = () => {
      return this._orders[this._orders.length - 1];
    };

    this.createBuyOrder = candleContext => {};

    this.createSellOrder = candleContext => {};
  }

}

;

var _default = new Orderer();

exports.default = _default;