"use strict";

var _stockDataRetriever = _interopRequireDefault(require("./stock-data-retriever"));

var _rawDataRetriever = _interopRequireDefault(require("./raw-data-retriever"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let STOCK_NAME = 'WINM20';

async function executeBot() {
  let firstCandle = null;
  const CandleSchema = new _mongoose.default.Schema({
    id: _mongoose.default.ObjectId,
    openingPrice: Number,
    closingPrice: Number,
    topPrice: Number,
    bottomPrice: Number,
    openingTime: Date,
    closingTime: Date
  });

  try {
    const conn = _mongoose.default.createConnection('mongodb://localhost:27017/candles', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('connected!');
    const CandleSchemaModel = conn.model('Candle', CandleSchema);
    const candleSchemaInstance = new CandleSchemaModel({
      'openingPrice': 4,
      'closingPrice': 7,
      'topPrice': 9,
      'bottomPrice': 3,
      'openingTime': new Date(),
      'closingTime': new Date()
    });
    await candleSchemaInstance.save().catch(error => {
      console.log(error);
    });
    conn.close().catch(error => {
      console.log('error closing db connection');
    });
  } catch (error) {
    console.log(error);
  } //
  // try {
  //     const stockDataRetriever = new StockDataRetriever();
  //     const rawDataRetriever = new RawDataRetriever();
  //
  //
  //
  //
  //     // if (!firstCandle){ firstCandle = await stockDataRetriever.retrieveFirstCandle(STOCK_NAME).catch((error)=>{throw error}); }
  //     //
  //     // let forbiddenPeriods = await rawDataRetriever.retrieveForbiddenPeriods().catch((error)=>{throw error});
  //     //
  //     // let currentTime = await rawDataRetriever.retrieveCurrentTime().catch((error) => {throw error});
  //     //
  //     // console.log(firstCandle);
  //     // console.log(forbiddenPeriods);
  //     // console.log(`Current time: ${currentTime}`);
  //
  // } catch (error){
  //     console.log(error);
  // }

}

executeBot().then();