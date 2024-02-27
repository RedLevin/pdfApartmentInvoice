const { css } = require('./css');
const verwalter = require('./verwalter');

const date = new Date();
const today = date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear();

function numberToMoney(number) {
    console.log('number', number, typeof(number));
    console.log(number);
    let numberNew = number.toFixed(2);
    console.log(numberNew);
    let numberString = numberNew.toString();
    console.log(numberString);
    numberString = numberString.replace('.', ',');
    console.log(numberString);
    return numberString;
}

module.exports = ({ date, holidayflat, owner, bookings, invoice, auslagen }) => {
    let s = '\u00A0'
    
    let totalPrice = 0;
    bookings.forEach(booking => {
        console.log(booking);
        totalPrice += booking.money;
    })

    console.log('auslagen', auslagen);

    let commision = Math.round((totalPrice*(holidayflat.comission/100) + Number.EPSILON) * 100) / 100;
    let MwSt = Math.round((commision*0.19 + Number.EPSILON) * 100) / 100;
    let netto = Math.round(((commision - MwSt) + Number.EPSILON) * 100) / 100;
    let ownerMoney = totalPrice - commision;
    if(auslagen) {
        ownerMoney = ownerMoney - auslagen;
    }

    if(auslagen) {
        auslagenTable = `<tr><th>Auslagen</th> <th>${auslagen.toString().replace(".",",")} Euro</th></tr>`
    }

    commision = numberToMoney(commision);
    MwSt = numberToMoney(MwSt);
    netto = numberToMoney(netto);
    ownerMoney = numberToMoney(ownerMoney);

    const buchungenHtml = [];
    for (let i = 0; i < bookings.length; i++) {
        buchungenHtml.push(`<tr><th>${bookings[i].start}</th> <th>${bookings[i].end}</th> <th>${bookings[i].name}</th> <th>${bookings[i].money},00 Euro</th></tr>`);
    };

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
                <p>${owner.name}<br>
                ${owner.street}<br>
                ${owner.zipCode} ${owner.city}</p>
                </address>
                <p class="right">${verwalter.city}, ${today}</p>
                <p><b>Objekt: ${holidayflat.street}, Wohnung ${holidayflat.name} ${holidayflat.zipCode} ${holidayflat.city}</b></p>
                <p><b>Abrechnungen der Buchungen vom ${date.startDate} bis ${date.endDate}</b></p>
                <p>Rechnung Nr. : ${invoice}/${date.startDate[8]}${date.startDate[9]}/${holidayflat.apartmendId}</p>
                <p>Buchungsbetrag:</p>
                <table>
                    <tr>
                        <th><b>Gesamt</b></th>
                        <th><b>${totalPrice},00 Euro</b></th>
                    </tr>
                    <tr>
                        <th>${holidayflat.comission} % Provision</th>
                        <th>${commision} Euro</th>
                    </tr>
                    <tr>
                        <th>19% MwSt</th>
                        <th>${MwSt} Euro</th>
                    </tr>
                    <tr>
                        <th>Netto </th>
                        <th>${netto} Euro</th>
                    </tr>
                    ${auslagen ? auslagenTable : ""}
                    <tr>
                        <th><b>Auszahlungsbetrag</b></th>
                        <th><b>${ownerMoney} Euro</b></th>
                    </tr>
                </table>
                <p>Buchungen:</p>
                <table>
                    <tr>
                        <th><b>Von</b></th>
                        <th><b>Bis</b></th>
                        <th><b>Name</b></th>
                        <th><b>Mietpreis</b></th>
                    </tr>
                ${buchungenHtml.join("")}
                </table>
                <p>Der ausgewiesene Auszahlungsbetrag wurde auf Ihr Konto überwiesen.</p>
                <p>Mit freundlichen Grüßen<br>
                ${verwalter.name}<br>                
                Tel. Nr. ${verwalter.phone}</p>
                <p class="blue">Bankverbindung:<br>
                ${verwalter.bank2}</p>
            </div>
        </body>
    </html>
    `;
};