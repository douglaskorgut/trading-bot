import XLSX from "xlsx";

class SheetReader{
    constructor() {

        const workbook = XLSX.readFile(`/Users/douglaskorgut/Desktop/trading-bot-js/files/winm20_streaming.xlsx`);
        const firstSheetName = workbook.SheetNames[0];
        this._worksheet = workbook.Sheets[firstSheetName];

        this.getCurrentPriceCellAddress = (stockName) => new Promise(async (resolve,reject)=>{
            let cellAddress = null;
            switch (stockName.toUpperCase()) {
                case 'WINM20':
                    cellAddress = `E2`;
                    break;
                case 'WINJ20':
                    cellAddress = 'F1';
                    break;
                default:
                    reject(`${stockName} not found on registered stocks`);
            };
            return resolve(cellAddress);
        });

        this.retrieveSupportLinesFromSheet = (stockName) => new Promise(async (resolve,reject)=>{
            const supportLines = [];
            const firstCellNumber = 2;
            const lastCellNumber = 5;

            for (let counter = firstCellNumber; counter <= lastCellNumber ; counter++){
                try {
                    const value = this._worksheet[`A${counter}`];
                    if (value) supportLines.push(value.v);
                } catch (e) {
                    reject(`Error retrieving support line from sheet` + e)
                }
            }
            resolve(supportLines);
        });

        this.retrieveResistenceLinesFromSheet = (stockName) => new Promise(async (resolve,reject)=>{
            const resistenceLines = [];
            const firstCellNumber = 2;
            const lastCellNumber = 5;

            for (let counter = firstCellNumber; counter <= lastCellNumber ; counter++){
                try {
                    const value = this._worksheet[`B${counter}`];
                    if (value) resistenceLines.push(value.v);
                } catch (e) {
                    reject(e)
                }
            }
            resolve(resistenceLines);
        });


        this.retrieveStockPriceFromSheet = (stockName) => new Promise(async (resolve, reject) => {
            let cellAddress = await this.getCurrentPriceCellAddress(stockName).catch(error => reject(error));
            if (cellAddress) {
                try {
                    const cell = this._worksheet[cellAddress];
                    if (cell) {
                        resolve(cell.v);
                    } else {
                        reject(`${cellAddress} is empty. No value will be returned!`);
                    }
                } catch (error) {
                    reject(error);
                }
            }
        });
    }
};

export default new SheetReader();
