import StockDataRetriever from './stock-data-retriever';
import RawDataRetriever from './raw-data-retriever';

let STOCK_NAME = 'WINM20';

async function executeBot() {

    let firstCandle = null;

    try {
        const stockDataRetriever = new StockDataRetriever();
        const rawDataRetriever = new RawDataRetriever();


        if (!firstCandle){ firstCandle = await stockDataRetriever.retrieveFirstCandle(STOCK_NAME).catch((error)=>{throw error}); }

        let forbiddenPeriods = await rawDataRetriever.retrieveForbiddenPeriods().catch((error)=>{throw error});

        let currentTime = await rawDataRetriever.retrieveCurrentTime().catch((error) => {throw error});

        console.log(firstCandle);
        console.log(forbiddenPeriods);
        console.log(`Current time: ${currentTime}`);

    } catch (error){
        console.log(error);
    }
}


executeBot().then();




