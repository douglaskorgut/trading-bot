import stocker from './data-modules/stocker';
import sheetReader from './utils/sheet-reader';


class DataFactory {

    constructor() {

        this.workingSupportLine = (stockName) => new Promise(async (resolve, reject) => {

            let supportLines = await this.supportLines(stockName).catch(error => reject(error));
            let stockCurrentPrice = await this.currentStockPrice(stockName).catch(error => reject(error));

            try {

                let supportLine = supportLines.reduce(function(prev, curr) {
                    if (curr > stockCurrentPrice) return prev;
                    return (Math.abs(curr - stockCurrentPrice) < Math.abs(prev - stockCurrentPrice) ? curr : prev);
                });
                resolve(supportLine);

            } catch (e) {
                reject(e)
            }

        });

        this.workingResistenceLine = (stockName) => new Promise(async (resolve, reject) => {

            let resistenceLines = await this.resistenceLines(stockName).catch(error => reject(error));
            let stockCurrentPrice = await this.currentStockPrice(stockName).catch(error => reject(error));

            try {

                let resistenceLine = resistenceLines.reduce(function(prev, curr) {
                    if (curr < stockCurrentPrice) return prev;
                    return (Math.abs(curr - stockCurrentPrice) < Math.abs(prev - stockCurrentPrice) ? curr : prev);
                });
                resolve(resistenceLine);

            } catch (e) {
                reject(e)
            }

        });

        this.resistenceLines = (stockName) => new Promise(async (resolve,reject)=>{
            let resistenceLines = await sheetReader.retrieveResistenceLinesFromSheet(stockName).catch(error => reject(error));
            resolve(resistenceLines);
        });

        this.supportLines = (stockName) => new Promise(async (resolve, reject)=>{
            let supportLines = await sheetReader.retrieveSupportLinesFromSheet(stockName).catch(error => reject(error));
            resolve(supportLines);
        });

        this.currentStockPrice = (stockName) => new Promise(async (resolve, reject) => {
            let currentPrice = await sheetReader.retrieveStockPriceFromSheet(stockName).catch( (error) => reject(error));
            resolve(currentPrice);
        });


        this.forbiddenPeriods = () => new Promise (async (resolve,reject)=> {
           let forbiddenPeriods =  await stocker.retrieveForbiddenPeriods().catch( (error) => reject(error));
           resolve(forbiddenPeriods);
        });

    };

}

export default new DataFactory();
