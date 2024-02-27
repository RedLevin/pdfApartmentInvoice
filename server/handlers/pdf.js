const pdf = require('html-pdf');

const mieterTemplate = require('../templates/mieter');
const besitzerTemplate = require('../templates/besitzer');
const PdfData = require('./pdfData');

class PdfHandler {
    static async createPdf(req, res, next) {
        let pdfTemplate;
        if(req.body.pdfTemplate === 'Mieter') {
            const data = new PdfData(req.body).prepareDataMieter();
            if(data instanceof Error) {
                console.log('im if error');
                res.send([data.message]);
                return;
            }
            console.log('data', data);
            console.log('typeof(data)', typeof(data));
            pdfTemplate = mieterTemplate(data);            
        } else if (req.body.pdfTemplate === 'Besitzer') {
            const data = new PdfData(req.body).prepareDataBesitzer();
            if(data instanceof Error) {
                console.log('im if error');
                res.send([data.message]);
                return;
            }
            pdfTemplate = besitzerTemplate(data);
        } else {
            console.log('error');
        }
        console.log('hinter error, vor den erstellen der pdf in pdf.js');
        pdf.create(pdfTemplate, {
            childProcessOptions: {
              env: {
                OPENSSL_CONF: '/dev/null',
              },
            }
          }).toFile('result.pdf', error => {
            if (error) {
                console.log(error);
            } else {
                res.sendFile('result.pdf', {root: '.'});
            }
        })
    }
}

module.exports = PdfHandler;