import dataFactory from './factories/data-factory';
import candleFactory from './factories/candle-factory';

const STOCK_NAME = 'WINM20';

async function run(){

    const firstCandle = await candleFactory.retrieveFirstCandle(STOCK_NAME).catch( (error) => { throw error });
    const currentStockPrice = await dataFactory.currentStockPrice(STOCK_NAME).catch( (error) => { throw error });
    const forbiddenPeriods = await dataFactory.forbiddenPeriods().catch( (error) => { throw error });

    console.log(firstCandle);
    console.log(forbiddenPeriods);
    console.log(currentStockPrice);
}

run().catch((error) => {console.log(error)});


