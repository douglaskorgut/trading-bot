import sheetReader from './utils/sheet-reader';
import timeReader from './utils/time-reader';

class CandleFactory{
    constructor() {

        this.retrieveFirstCandle = (stockName) => new Promise(async (resolve, reject) => {
            let firstCandle = {
                'openingPrice': undefined,
                'closingPrice': undefined,
                'topPrice': undefined,
                'bottomPrice': undefined,
                'openingTime': new Date(),
                'closingTime': undefined,
            };

            let currentStockPrice = await sheetReader.retrieveStockPriceFromSheet(stockName).catch((error) => {resolve(error)});

            if (!firstCandle.openingPrice) {
                firstCandle.openingPrice = currentStockPrice;
                firstCandle.bottomPrice = currentStockPrice;
                firstCandle.topPrice = currentStockPrice;
                firstCandle.closingPrice = currentStockPrice;
            }
            // Execute loop while 5 min candle-modules isn't achieved
            let interval = setInterval(async function() {

                if (!firstCandle.closingTime) {

                    const currentTime = await timeReader.currentTime().catch((error)=>{ reject(error) });

                    // Check if 5 minute candle-modules has been achieved
                    if (currentTime.split(':')[1].split(':')[0] % 5 === 0) {

                        firstCandle.closingTime = new Date();
                        firstCandle.closingPrice = currentStockPrice;

                    } else {
                        // Setting first candle-modules params
                        if (currentStockPrice > firstCandle.topPrice) firstCandle.topPrice = currentStockPrice;

                        if (firstCandle.bottomPrice > currentStockPrice) firstCandle.bottomPrice = currentStockPrice
                    }
                }
                else {
                    clearInterval(interval);
                    resolve(firstCandle)
                }
            }, 1000);
        });
    };
}

export default new CandleFactory();