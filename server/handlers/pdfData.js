const XLSX = require('xlsx');
const fs = require('fs');

// verwalter C:/Users/HP 17-Y005NG/Documents/Ferienwohnungverwaltung/usedom/server/ferienwohnungen.ods
// Victor /home/victor/code/usedom/server/ferienwohnungen.ods
const workbook = XLSX.readFile("./ferienwohnungen.ods");

class PdfData {
    constructor({ apartment, startDate, endDate, firstname, lastname, street, city, plz, price, invoice, tax, cleaning, auslagen, mieterTemplate }) {
        this.apartment = apartment;
        this.startDate = startDate;
        this.endDate = endDate;
        this.firstname = firstname;
        this.lastname = lastname;
        this.street = street;
        this.city = city;
        this.plz = plz;
        this.flatprice = price;
        this.invoice = invoice;
        this.tax = tax;
        this.cleaning = cleaning;
        this.auslagen = auslagen;
        this.mieterTemplate = mieterTemplate;

        this.workbook = workbook;

        this.apartmentId;
        
        this.tenants = [];
        this.tenant = {}; // war vorher ohne = {}
        this.date = {};
        this.overnighters;
        this.holidayflat = {};
        this.price = {};
        this.bookings = [];
        this.owner = {};
    }

    //macht aus der passenden zahl einen buchstaben 
    // A = 1, B = 2, C = 3, ...
    intToChar (int) {
        const code = 'A'.charCodeAt(0);
        return String.fromCharCode(code + int -1);
    }

    //gibt für eine Zahl die passenden Reihe an
    // 1 = A, 2 = B, 3 = C, ..., 27 = AA, 28 = AB, ...
    // ist nicht für mal als sehr viele Einträge ausgelegt, bis Reihe ZZ!
    numberToLetter (x) {
        let letter = "";
        //überprüft, ob es einen zweiten Buchstaben geben muss oder nicht, also bei mehr als 26 Einträgen
        const firstLetter = Math.floor((x-1)/26);
        if(firstLetter !== 0) {
            letter += this.intToChar(firstLetter)
        }
        const secondLetter = x%26;
        if(secondLetter !== 0) {
            letter += this.intToChar(secondLetter)
        } else {
            letter += 'Z';
        }
        return letter;
    }

    //gibt die passende Reihe für das aktive Apartment zurück
    findApartment () {
        let x = 2;
        while(this.apartment !== this.workbook.Sheets.Buchungen[`${this.numberToLetter(x)}1`].w) {
            x+=1;
        }
        return this.numberToLetter(x);
    }

    //passt das Datenformat das auf den Frontendgeschickt wird an das Datenformat an das in Excel benutzt wird
    prepareDateExcel(date) {
        const dateArray = date.replace(/ /g, "").split("-");
        const dateExcel = dateArray[1] + '/' + dateArray[2] + '/' + dateArray[0].slice(2,4);
        return dateExcel;
    }

    //passt das Datum für die PDF an
    prepareDatePDF(date) {
        const dateArray = date.split('-');
        const datePdf = dateArray[2] + "." + dateArray[1] + "." + dateArray[0];
        return datePdf;
    }

    //findet die passende Zeile zu den jeweiligen Datum
    findRow (excelDate) {
        let x = 2;
	console.log(excelDate);
	console.log(`A${x}`);
	console.log(this.workbook.Sheets.Buchungen[`A${x}`].w);

        //x < 400 && warum war das in der while schleife
        while (this.workbook.Sheets.Buchungen[`A${x}`].w !== excelDate) {
            x+=1;
        }

        return x;
    }

    //finde die passende Zeile für den jeweiligen Mieter
    findRow2 (value) {
        let x = 1;

        while (this.workbook.Sheets.Mieter[`A${x}`].w !== value) {
            x+=1;
        }

        return x;
    }

    //findet die passende Ziele für die Ferienwohnung
    findApartmentRow (value) {
        let x = 2;
        while (this.workbook.Sheets.Ferienwohnungen[`B${x}`].w !== value) {
            x+=1;
        }
        return x;
    }

    //gibt den Wert einer bestimmten Zelle zurück
    getCellValue (cell) {
        return this.workbook.Sheets.Buchungen[cell].w;
    }

    validateDate (startDate, endDate, worksheet) {
        if(worksheet.length === 0) {
            return true;
        }
        let startDateTime = new Date(startDate).getTime();
        let endDateTime = new Date(endDate).getTime();
        let n;
        for(let i = 0; i < worksheet.length; i++) {
            let leaveTime = new Date(worksheet[i]["Abreise"]).getTime();
            if(leaveTime <= startDateTime) {
                n = i+1;
            }
            if(i === worksheet.length -1 && leaveTime <= startDateTime) {
                return true;
            }
            if(leaveTime >= startDateTime) {
                break;
            }        
        }
        if(typeof(n)==='undefined') {
            n = 0;
        } 
        let arrive = new Date(worksheet[n]["Anreise"]);
        let arriveTime = arrive.getTime();
        return arriveTime >= endDateTime;
    }

    validateDate2 (startDate, endDate, worksheet) {
        let startDateTime = new Date(startDate).getTime();
        let endDateTime = new Date(endDate).getTime();
        for(let i = 0; i < worksheet.length; i++) {
            let arriveTime = new Date(worksheet[i]["Anreise"]).getTime();
            let leaveTime = new Date(worksheet[i]["Abreise"]).getTime();
            if(((arriveTime < startDate) && (leaveTime > startDateTime)) || ((arriveTime < endDateTime) && (leaveTime > endDateTime))) {
                return false;
            }      
        }
        return true;
    }
  
    prepareDataMieter () {

        console.log('tax', this.tax);

        this.tenant = { 
            firstname:this.firstname, 
            lastname:this.lastname, 
            street:this.street, 
            city:this.city, 
            zipCode:this.plz 
        };
        this.price.flatprice = this.flatprice;        
        this.date.startDate = this.prepareDatePDF(this.startDate);
        this.date.endDate = this.prepareDatePDF(this.endDate);

        let d1 = new Date(this.startDate);
        let d2 = new Date(this.endDate);
        let differenceInSecond = d2.getTime() - d1.getTime();
        let differenceInDays = differenceInSecond / (1000 * 3600 * 24);
        this.overnighters = differenceInDays; 

        const apartmentRow = this.findApartmentRow(this.apartment);
        this.apartmendId = this.workbook.Sheets.Ferienwohnungen[`A${apartmentRow}`].w;
        this.holidayflat.name = this.workbook.Sheets.Ferienwohnungen[`B${apartmentRow}`].w;
        this.holidayflat.street = this.workbook.Sheets.Ferienwohnungen[`C${apartmentRow}`].w;
        this.holidayflat.city = this.workbook.Sheets.Ferienwohnungen[`D${apartmentRow}`].w;
        this.holidayflat.zipCode = this.workbook.Sheets.Ferienwohnungen[`E${apartmentRow}`].w;
        this.holidayflat.cleaning = this.workbook.Sheets.Ferienwohnungen[`F${apartmentRow}`].w;
        
        this.price.overnighters = this.price.flatprice * this.overnighters;
        this.price.total = parseInt(this.price.overnighters) + parseInt(this.holidayflat.cleaning);

        const worksheetApartment = XLSX.utils.sheet_to_json(this.workbook.Sheets[this.apartmendId]);

        let dateValid = this.validateDate(this.startDate, this.endDate, worksheetApartment);

        if(dateValid === false) {
            return new Error('Der Aufenthalt des neuen Mieters überschneiden sich mit dem eines bereits existierenden Mieters!');
        }

        worksheetApartment.push({
            "Vorname": this.tenant.firstname,
            "Nachname": this.tenant.lastname,
            "Straße": this.tenant.street,
            "PLZ": this.tenant.zipCode,
            "Ort": this.tenant.city,            
            "Preis": this.price.flatprice,
            "Übernachtungen": this.overnighters,
            "Anreise": this.startDate,
            "Abreise": this.endDate            
        });

        function customComperator(a, b) {
            let timeA = new Date(a["Anreise"]).getTime();
            let timeB = new Date(b["Anreise"]).getTime();
            return timeA - timeB;
        }

        const sortedWorksheetApartment = worksheetApartment.sort(customComperator);

        XLSX.utils.sheet_add_json(this.workbook.Sheets[this.apartmendId], sortedWorksheetApartment);
        XLSX.writeFile(this.workbook, 'ferienwohnungen.ods');

        console.log('cleaning', this.cleaning);

        return { 
            tenant: this.tenant, 
            date: this.date,
            overnighters: this.overnighters,
            holidayflat: this.holidayflat,
            price: this.price,
            tax: this.tax,
            cleaning: this.cleaning,
            mieterTemplate: this.mieterTemplate
        };
    }

    prepareDataBesitzer () {
        this.date.startDate = this.prepareDatePDF(this.startDate);
        this.date.endDate = this.prepareDatePDF(this.endDate);
        
        const apartmentRow = this.findApartmentRow(this.apartment);
        this.apartmendId = this.workbook.Sheets.Ferienwohnungen[`A${apartmentRow}`].w;
        this.holidayflat.apartmendId = this.workbook.Sheets.Ferienwohnungen[`A${apartmentRow}`].w;
        this.holidayflat.name = this.workbook.Sheets.Ferienwohnungen[`B${apartmentRow}`].w;
        this.holidayflat.street = this.workbook.Sheets.Ferienwohnungen[`C${apartmentRow}`].w;
        this.holidayflat.zipCode = this.workbook.Sheets.Ferienwohnungen[`D${apartmentRow}`].w;
        this.holidayflat.city = this.workbook.Sheets.Ferienwohnungen[`E${apartmentRow}`].w;
        this.holidayflat.cleaning = this.workbook.Sheets.Ferienwohnungen[`F${apartmentRow}`].w;
        this.holidayflat.comission = this.workbook.Sheets.Ferienwohnungen[`G${apartmentRow}`].w;
        this.owner.name = this.workbook.Sheets.Ferienwohnungen[`H${apartmentRow}`].w;
        this.owner.street = this.workbook.Sheets.Ferienwohnungen[`I${apartmentRow}`].w;
        this.owner.zipCode = this.workbook.Sheets.Ferienwohnungen[`J${apartmentRow}`].w;
        this.owner.city = this.workbook.Sheets.Ferienwohnungen[`K${apartmentRow}`].w;
       
        const worksheetApartment = XLSX.utils.sheet_to_json(this.workbook.Sheets[this.apartmendId]);

        let startDateTime = new Date(this.startDate).getTime();
        let endDateTime = new Date(this.endDate).getTime();

        let dateValid = this.validateDate2(this.startDate, this.endDate, worksheetApartment);
        
        if(dateValid === false) {
            return new Error('Der Rechnungszeitraum deckt den Aufenthaltszeitraum mindestens eines Mieters nur teilweise ab!');
        }

        worksheetApartment.forEach(e => {
            let arriveTime = new Date(e["Anreise"]).getTime();
            let leaveTime = new Date(e["Abreise"]).getTime();
            if(arriveTime >= startDateTime && leaveTime <= endDateTime) {
                console.log(e["Preis"]);
                console.log(e["Übernachtungen"]);
                console.log(e["Preis"]*e["Übernachtungen"]);
                this.tenants.push(e);
            }
        })

        this.tenants.forEach(tenant => {
            this.bookings.push({
                start: this.prepareDatePDF(tenant["Anreise"]),
                end: this.prepareDatePDF(tenant["Abreise"]),
                name: tenant["Nachname"],
                money: tenant["Preis"]*tenant["Übernachtungen"]
            })
        })

        console.log('this.invoice in pdfData', this.invoice);


        //eigentümer informationen fehlen noch

        //genau preis berechnung fehlt noch

        return {
            date: this.date,
            holidayflat: this.holidayflat,
            owner: this.owner,
            bookings: this.bookings,
            invoice: this.invoice,
            auslagen: this.auslagen         
        }
    }
  }
  
module.exports = PdfData;
