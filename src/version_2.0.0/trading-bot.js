import dataFactory from './factories/data-factory';

const STOCK_NAME = 'WINM20';

async function run(){
    const currentStockPrice = await dataFactory.currentStockPrice(STOCK_NAME).catch( (error) => { throw error });
}

run().catch((error) => {console.log(error)});


