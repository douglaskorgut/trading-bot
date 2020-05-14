import fs from 'fs';
import SheetReader from '../utils/sheet-reader';

class Stocker {

    constructor() {

        this.retrieveForbiddenPeriods = () => new Promise(async (resolve, reject) => {
            fs.readFile(`/home/ubivisnb24/WebstormProjects/trading-bot/files/forbidden_periods.json`, (err, data) => {
                if (err) {
                    reject(`Error retrieving forbidden periods ${err.message}`);
                }
                try {
                    const forbiddenPeriodsJSON = JSON.parse(data.toString());

                    Object.values(forbiddenPeriodsJSON).forEach((forbiddenPeriods) => {
                        const resultForbiddenPeriods = forbiddenPeriods.map((forbiddenPeriod) => {
                            const interval = forbiddenPeriod.split(`/`);
                            return {'begin': interval[0], 'end': interval[1]};
                        }, []);

                        resolve(resultForbiddenPeriods);

                    });

                } catch (error) {
                    reject(`Error retrieving forbidden periods: ${error.message}`)
                }
            });
        });

        this.retrieveCurrentStockPrice = (stockName) => new Promise(async (resolve, reject) => {
            let currentStockPrice = await SheetReader.retrieveStockPriceFromSheet(stockName).catch((error) => {reject(error)});
            resolve(currentStockPrice);
        });
    }
}

export default new Stocker();
