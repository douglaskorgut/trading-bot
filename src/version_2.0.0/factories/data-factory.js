import Orderer from './data-modules/orderer';
import Stocker from './data-modules/stocker';

class DataFactory {

    constructor() {

        this.currentStockPrice = (stockName) => new Promise(async (resolve, reject) => {
            let currentPrice = await Stocker.retrieveCurrentStockPrice(stockName).catch( (error) => reject(error));
            resolve(currentPrice);
        });

        this.createOrder = async (candleContext, type) => new Promise((resolve, reject) => {
            let order;
            switch (type) {
                case 'buy':
                    order = Orderer.createBuyOrder(candleContext);
                    break;
                case 'sell':
                    order = Orderer.createSellOrder(candleContext);
                    break;
                default:
                    reject(`${type} operation not found!`);
                    break;
            }
            resolve(order);
        });
    };
}

export default new DataFactory();
