import dataFactory from '/src/factories/data-factory';

describe('Calculator', () => {
    it('should add two numbers', () => {
        let currentStockPrice = dataFactory.currentStockPrice('WINM20');
        expect(currentStockPrice).toBe(10);

    });
});
