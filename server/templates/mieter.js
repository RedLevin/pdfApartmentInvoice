const { css } = require('./css');
const verwalter = require('./verwalter');

const date = new Date();
const today = date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear();

module.exports = ({ tenant, date, overnighters, holidayflat, price, tax, cleaning, mieterTemplate }) => {
    let price20 = Math.round(price.total*0.2);
    let price80 = price.total - price20;

    let startDateArray = date.startDate.split('.');
    let startDateNew = startDateArray[2] + "-" + startDateArray[1] + "-" + startDateArray[0];
    let startDate2 = new Date(startDateNew);
    let startDateNewTime = startDate2.getTime();
    let datePaymenttime = startDateNewTime - (1000 * 3600 * 24 * 5 * 7);
    let datePayment = new Date(datePaymenttime);
    const datePaymentPdf = datePayment.getDate().toString().padStart(2, '0')+'.'+(datePayment.getMonth()+1).toString().padStart(2, '0')+'.'+datePayment.getFullYear();
    console.log("datePaymentPdf",datePaymentPdf)

    let zahlungsart;

    console.log('mieterTemplate', mieterTemplate);

    if(mieterTemplate === 'bar') {
        zahlungsart = `Bringen Sie bitte den Betrag von ${price.total},00 Euro Bar zur Anreise mit. ${date.startDate}`;
    }
    if(mieterTemplate === '100') {
        zahlungsart = `Überweisen Sie bitte den Betrag von ${price.total},00 Euro innerhalb 1 Woche nach Rechnungseingang auf das angegebene Konto.`;
    }
    if(mieterTemplate === 'a1') {
        zahlungsart = `Eine Anzahlung auf den Buchungspreis in Höhe von 20 % ${price20},00 Euro überweisen Sie bitte 1 Woche nach Rechnungseingang auf das angegebene Konto, die restliche Summe ${price80},00 Euro ist 5 Wochen vor Anreise zu zahlen. ${datePaymentPdf}`;
    }
    if(mieterTemplate === 'a2') {
        zahlungsart = `Eine Anzahlung auf den Buchungspreis in Höhe von 20 % ${price20},00 Euro überweisen Sie bitte 2 Wochen nach Rechnungseingang auf das angegebene Konto, die restliche Summe ${price80},00 Euro ist 5 Wochen vor Anreise zu zahlen. ${datePaymentPdf}`;
    }
    if(mieterTemplate === 'a3') {
        zahlungsart = `Eine Anzahlung auf den Buchungspreis in Höhe von 20 % ${price20},00 Euro überweisen Sie bitte 3 Wochen nach Rechnungseingang auf das angegebene Konto, die restliche Summe ${price80},00 Euro ist 5 Wochen vor Anreise zu zahlen. ${datePaymentPdf}`;
    }

    return `
    <!doctype html>
    <html>
        <head>
            <meta charset="utf-8">
            ${css}
        </head>
        <body class="marginZero">
            <div class="center">
                <address>
                <p>${tax ? 'Firma' : 'Familie'}<br>
                ${tenant.lastname}<br>
                ${tenant.street}<br>
                ${tenant.zipCode} ${tenant.city}</p> 
                </address>
                <p class="right">${verwalter.city}, ${today}</p>
                <p><b>Hier: Rechnung zur Buchungsbestätigung Wohnung ${holidayflat.name} ${holidayflat.street} in ${holidayflat.zipCode} ${holidayflat.city}</b></p>
                <p>Sehr geehrte ${tax ? 'Firma' : 'Familie'} ${tenant.lastname},</p>
                <p>vielen Dank für Ihre Urlaubsbuchung.<br>
                Für Ihre Buchung der Ferienwohnung in der Zeit vom <b>${date.startDate} bis ${date.endDate} berechnen wir Ihnen einen Mietpreis von</b></p>
                <table>
                    <tr>
                        <th><b>je ${overnighters} Übernachtung/en</b></th>
                        <th><b>${price.flatprice},00 Euro</b></th>
                    </tr>
                    ${cleaning ? "" : `<tr><th><b>Endreinigung</b></th><th><b>${holidayflat.cleaning},00 Euro</b></th></tr>`}                    
                    <tr>
                        <th><b>Gesamtpreis</b></th>
                        <th><b>${price.total},00 Euro</b></th>
                    </tr>
                </table>
                <p>${zahlungsart}</p>
                <p>${cleaning ? "Die Kosten für die Kurtaxe und die Endreinigugn von 70,00 Euro bezahlen Sie bitte vor ort bei Herrn Krebs der die Schlüsselübergabe vor Ort übernimmt. " : "Die Kurtaxe bezahlen Sie bitte am Anreisetag vor Ort in bar. "}Die Ferienwohnung steht am Anreisetag ab 16:00 Uhr und am Abreisetag bis 9:00 Uhr zur Verfügung. Ihre Anreise besprechen wir telefonisch 1 Woche vor Urlaubsbeginn bitte rufen Sie mich an, die Schlüsselübergabe mache ich persönlich an der Ferienwohnung.</p>
                <p>Wir wünschen Ihnen einen schönen Urlaub und stehen für Rückfragen gerne zur Verfügung.</p>
                <p>Mit freundlichen Grüßen<br>
                ${verwalter.name}<br>                
                Tel. Nr. ${verwalter.phone}</p>
                <p class="blue">Bankverbindung:<br>
                ${tax ? verwalter.bank2 : verwalter.bank}</p>
            </div>
        </body>
    </html>
    `;
};