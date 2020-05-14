import orderer from './data-modules/orderer';
import stocker from './data-modules/stocker';
import sheetReader from './utils/sheet-reader';

class DataFactory {

    constructor() {

        this.currentStockPrice = (stockName) => new Promise(async (resolve, reject) => {
            let currentPrice = await sheetReader.retrieveStockPriceFromSheet(stockName).catch( (error) => reject(error));
            resolve(currentPrice);
        });

        this.createOrder = async (candleContext, type) => new Promise((resolve, reject) => {
            let order;
            switch (type) {
                case 'buy':
                    order = orderer.createBuyOrder(candleContext);
                    break;
                case 'sell':
                    order = orderer.createSellOrder(candleContext);
                    break;
                default:
                    reject(`${type} operation not found!`);
                    break;
            }
            resolve(order);
        });

        this.forbiddenPeriods = () => new Promise (async (resolve,reject)=> {
           let forbiddenPeriods =  await stocker.retrieveForbiddenPeriods().catch( (error) => reject(error));
           resolve(forbiddenPeriods);
        });

    };
}

export default new DataFactory();
