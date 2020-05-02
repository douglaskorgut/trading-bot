import XLSX from "xlsx";

class Stocker {
    constructor() {

        const workbook = XLSX.readFile(`/Users/douglaskorgut/Desktop/trading-bot-js/files/winm20_streaming.xlsx`);
        const firstSheetName = workbook.SheetNames[0];
        this._worksheet = workbook.Sheets[firstSheetName];

        this.retrieveCurrentStockPrice = (stockName) => new Promise(async (resolve, reject) => {
            let cellAddress = null;
            switch (stockName.toUpperCase()) {
                case 'WINM20':
                    cellAddress = `A1`;
                    break;
                case 'WINJ20':
                    cellAddress = 'F1';
                    break;
                default:
                    reject(`${stockName} not found on registered stocks`);
            }

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
    };
}

export default new Stocker();
