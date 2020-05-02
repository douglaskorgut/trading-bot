import SheetReader from './sheet-reader';
import RawDataRetriever from './raw-data-retriever'

let instance = null;

class StockDataRetriever {

    constructor() {
        if (!instance) { instance = this;}

        this.sheetReader = new SheetReader();

        return instance;
    };


    async retrieveCurrentStockPrice(stockName) {
        return new Promise(((resolve, reject) => {

            let cellAddress = null;
            switch (stockName.toUpperCase()) {
                case 'WINM20':
                    cellAddress = `A1`;
                    break;
                case 'WINJ20':
                    cellAddress = 'F1';
                    break;
                default:
                    reject(`${stockName} not found on registered stocks`);
            }

            if (cellAddress) {
                try {
                    resolve(this.sheetReader.readCell(cellAddress))
                } catch (error) {
                    reject(error);
                }
            }
        }));
    };

    async retrieveFirstCandle(stockName) {
        return new Promise((resolve, reject) => {
            const rawDataRetriever = new RawDataRetriever();

            let firstCandle = {
                'openingPrice': undefined,
                'closingPrice': undefined,
                'topPrice': undefined,
                'bottomPrice': undefined,
                'openingTime': new Date(),
                'closingTime': undefined,
            };

            let currentStockPrice = null;

            this.retrieveCurrentStockPrice(stockName).then((_currentStockPrice) => {
                if (!firstCandle.openingPrice) {
                    firstCandle.openingPrice = _currentStockPrice;
                    firstCandle.bottomPrice = _currentStockPrice;
                    firstCandle.topPrice = _currentStockPrice;
                    firstCandle.closingPrice = _currentStockPrice;
                }
                currentStockPrice = _currentStockPrice;

                // Execute loop while 5 min candle isn't achieved
                let interval = setInterval(function() {

                    if (!firstCandle.closingTime) {

                        rawDataRetriever.retrieveCurrentTime().then((currentTime)=>{
                            // Check if 5 minute candle has been achieved
                            if (currentTime.split(':')[1].split(':')[0] % 5 === 0) {

                                firstCandle.closingTime = new Date();
                                firstCandle.closingPrice = currentStockPrice;

                            } else {

                                // Setting first candle params
                                if (currentStockPrice > firstCandle.topPrice) firstCandle.topPrice = currentStockPrice;

                                if (firstCandle.bottomPrice > currentStockPrice) firstCandle.bottomPrice = currentStockPrice
                            }
                        }).catch((error)=>{
                            reject(error)
                        });
                    }
                    else {
                        clearInterval(interval);
                        resolve(firstCandle)
                    }
                }, 1000);
            }).catch((error)=>{
                reject(`Error retrieving first candle: ${error}`)
            });
        });
    }
}


export default StockDataRetriever;
