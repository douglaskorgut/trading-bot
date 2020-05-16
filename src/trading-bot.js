import dataFactory from './factories/data-factory';
import candleFactory from './factories/candle-factory';
import operationFactory from './factories/operation-factory';

const STOCK_NAME = 'WINM20';

let state = {
    position: 'none',
    workingCandle: undefined
};

async function run() {

    const forbiddenPeriods = await dataFactory.forbiddenPeriods().catch((error) => {
        throw error
    });

    const isTimeFrameValid = await operationFactory.isTimeFrameValid(forbiddenPeriods).catch((error) => {
        throw error
    });

    console.log('\nTrading-bot running');

    if (isTimeFrameValid) {

        console.log('Valid current time frame. Starting candle...');
        let workingCandle = await candleFactory.startCandle(STOCK_NAME).catch((error) => {
            throw error
        });
        state.workingCandle = workingCandle;

        console.log(`Candle started with price ${workingCandle.currentPrice}. `);

        let botRunner = setInterval(async function () {

            let isSupportLineBuyable = await operationFactory
                .isSupportLineBuyable(
                    STOCK_NAME,
                    workingCandle
                ).catch((error) => {
                    throw (error)
                });

            const supportLineValidationMessage = isSupportLineBuyable
                ? 'Support line is valid! Creating order...'
                : 'Invalid support line. Moving on to next validation.';

            // console.log(`${supportLineValidationMessage}`);

            const isResistencelineSellable = await operationFactory
                .isResistenceLineSellable(
                    STOCK_NAME,
                    workingCandle)
                .catch((error) => {
                    throw (error)
                });

            const resistenceLineValidationMessage = isResistencelineSellable
                ? 'Resistence line is valid! Creating order...'
                : 'Invalid resistence line. Moving on to next validation.';

            // console.log(`${resistenceLineValidationMessage}`);
            // console.log(`${resistenceLineValidationMessage}`);


        }, 1000);

    }

}

run().catch((error) => {
    console.log(error)
});


