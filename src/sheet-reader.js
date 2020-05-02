import XLSX from 'xlsx';
import path from 'path';

let instance = null;
class SheetReader {

    constructor(){

        if (!instance){ instance = this; }

        const workbook = XLSX.readFile(`${path.dirname(__dirname)}/files/winm20_streaming.xlsx`);
        const firstSheetName = workbook.SheetNames[0];
        this.worksheet = workbook.Sheets[firstSheetName];

        return instance;
    }

    readCell(cellAddress){
        const cell = this.worksheet[cellAddress];
        if (cell) {
            return cell.v;
        } else {
            throw Error(`${cellAddress} is empty. No value will be returned!`)
        }
    };
}

export default SheetReader;
