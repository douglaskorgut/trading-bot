import sheetReader from "./utils/sheet-reader";
import orderer from "./data-modules/orderer";
import dataFactory from '../factories/data-factory';

let DEFAULT_OFFSET_TICKS = 40;
let DEFAULT_OFFSET_PERIOD = 40;

class OperationFactory {

    constructor(){

        this.isTimeFrameValid = (forbiddenPeriods) => new Promise((resolve,reject) =>{

            try {
                const currentTime =  `${(new Date ()).getHours()}:${(new Date ()).getMinutes()}`;
                forbiddenPeriods.forEach(forbiddenPeriod =>{
                    if (currentTime > forbiddenPeriod.begin && currentTime <forbiddenPeriod.end){
                        resolve(false);
                    }
                    resolve(true)
                });
            } catch (e) {
                reject(`Error checking Time frame for validation: ${e}`)
            }

        });

        this.isSupportLineBuyable = (stockName, candle) => new Promise(async (resolve, reject) => {

            const currentPrice = await sheetReader.retrieveStockPriceFromSheet(stockName).catch( (error) => reject(error));
            const workingSupportLine = await dataFactory.workingSupportLine(stockName).catch(error => reject(error));

            // console.log(`Working support line at ${workingSupportLine}`);

            const buyThresholdPrice = workingSupportLine + DEFAULT_OFFSET_TICKS;
            const buyThresholdTime = (
                new Date(candle.closingTime).valueOf()/1000 - (new Date().valueOf()/1000));

            try {
                if ( (currentPrice > buyThresholdPrice)
                    && buyThresholdTime > DEFAULT_OFFSET_PERIOD ) {
                    resolve(true);
                }
            } catch (e) {
                reject(e)
            }
            resolve(false)
        });

        this.isResistenceLineSellable = (stockName, candle) => new Promise(async (resolve, reject) =>{

            const currentPrice = await sheetReader.retrieveStockPriceFromSheet(stockName).catch( (error) => reject(error));
            const workingResistenceLine = await dataFactory.workingResistenceLine(stockName).catch(error => reject(error));

            const sellThresholdPrice = workingResistenceLine - DEFAULT_OFFSET_TICKS;
            const sellThresholdTime = (
                new Date(candle.closingTime).valueOf()/1000 - (new Date().valueOf()/1000));

            try {
                if ( (currentPrice < sellThresholdPrice)
                    && sellThresholdTime > DEFAULT_OFFSET_PERIOD ) {
                    resolve(true);
                }
            } catch (e) {
                reject(e)
            }
            resolve(false)
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

    };
}

export default new OperationFactory();
