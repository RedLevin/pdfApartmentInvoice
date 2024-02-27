const XLSX = require('xlsx');
const fs = require('fs');

const Excel = fs.readFileSync('./ferienwohnungen.ods');

class XlsxHandler {
    static async sendData(req, res, next) {
        const workbook = XLSX.read(Excel);
        const apartmentsSheet = workbook.Sheets.Ferienwohnungen;
        let x = 0;
        while(apartmentsSheet[`A${x+2}`] !== undefined) {
            x++;
        }
        const apartments = [];
        for (let i = 0; i <= x-1; i++) {
            apartments.push(apartmentsSheet[`B${i+2}`].w);              
        }      
        res.send(apartments);
    }
}

module.exports = XlsxHandler;