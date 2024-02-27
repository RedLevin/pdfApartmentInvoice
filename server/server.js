const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');

const PdfHandler = require('./handlers/pdf');
const XlsxHandler = require('./handlers/xlsx');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/xlsx/', XlsxHandler.sendData);
app.post('/pdf/', PdfHandler.createPdf);

app.listen(3000);