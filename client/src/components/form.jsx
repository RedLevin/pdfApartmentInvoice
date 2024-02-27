import React, { useState, useEffect } from 'react';
import axios from "axios";
import { saveAs } from 'file-saver';

import MieterForm from './mieterForm';
import BesitzerForm from './besizterForm';

const Form = ({ apartments }) => {
    const [pdfTemplate, setPdfTemplate] = useState("");
    const [apartment, setApartment] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [plz, setPlz] = useState("");
    const [price, setPrice] = useState("");
    const [invoice, setInvoice] = useState("");
    const [tax, setTax] = useState(false);
    const [cleaning, setCleaning] = useState(false);
    const [auslagen, setAuslagen] = useState("");
    const [mieterTemplate, setMieterTemplate] = useState("");

    const nextDay = (date) => {
        let dateTime = new Date(date).getTime();
        let nextDayTime = dateTime + (1000 * 3600 * 24);
        let nextDay = new Date(nextDayTime);
        let nextDayFormat = nextDay.getFullYear()+'-'+(nextDay.getMonth()+1).toString().padStart(2, '0')+'-'+nextDay.getDate().toString().padStart(2, '0');
        return nextDayFormat;
    }

    const lastDay = (date) => {
      let dateTime = new Date(date).getTime();
      let lastDayTime = dateTime - (1000 * 3600 * 24);
      let lastDay = new Date(lastDayTime);
      let lastDayFormat = lastDay.getFullYear()+'-'+(lastDay.getMonth()+1).toString().padStart(2, '0')+'-'+lastDay.getDate().toString().padStart(2, '0');
      return lastDayFormat;
    }

    const prepareDatePDF = (date) =>{
      const dateArray = date.split('-');
      const datePdf = dateArray[2] + "." + dateArray[1] + "." + dateArray[0];
      return datePdf;
  }

    const createPdf = async (event) => {
      event.preventDefault();
      let startDateTime = new Date(startDate).getTime();
      let endDateTime = new Date(endDate).getTime();
      if(startDateTime >= endDateTime) {
        alert('Das Enddatum muss größer als das Startdatum sein!');
        return
      }
      console.log('createPdf');
      const response = await axios.post('http://localhost:3000/pdf/', {pdfTemplate, apartment, startDate, endDate, firstname, lastname, street, city, plz, price, invoice, tax, cleaning, auslagen, mieterTemplate }, { responseType: 'blob' },);
      if(response.data.type === "application/json") {
        const errorMessage = JSON.parse(await response.data.text())[0];
        alert(errorMessage);
      } else {
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
        let pdfName;
        if(pdfTemplate === "Mieter") {
          pdfName = lastname + " von " + prepareDatePDF(startDate) + " bis " + prepareDatePDF(endDate);
        } else if(pdfTemplate === "Besitzer") {
          pdfName = apartment + " von " + prepareDatePDF(startDate) + " bis " + prepareDatePDF(endDate);
        } else {
          pdfName = "error";
        }
        saveAs(pdfBlob, pdfName + '.pdf');
      }      
  }

  return (
    <div>
      <form onSubmit={createPdf}>
          <fieldset>
          <div style={{margin:"10px"}}>
            <legend>PDF Vorlage:</legend>
          </div>
          
          <div style={{margin:"10px"}}>          
            <div>
              <input type="radio" id="Mieter" name="pdfTemplate" value="Mieter" onClick={(event) => {setPdfTemplate(event.target.value)}} required />
              <label htmlFor="Mieter">Mieter</label>
            </div>
            <div>
              <input type="radio" id="Besitzer" name="pdfTemplate" value="Besitzer" onClick={(event) => {setPdfTemplate(event.target.value)}} />
              <label htmlFor="Besitzer">Besitzer</label>
            </div>
          </div>

          <div style={{margin:"10px"}}>
              <label htmlFor="apartments">Ferienwohnung </label>
              <select name="apartments" id="apartments" value={apartment} onChange={(event) => {setApartment(event.target.value)}} required >
              <option hidden disabled value=""></option>
              {apartments.map((apartment) => {
                  return <option key={apartment} value={apartment}>{apartment}</option>
              })}
              </select>
          </div>

          <div style={{margin:"10px"}}>
              <label htmlFor="start">Startdatum </label>
              <input type="date" id="start" value={startDate} name="invoice-start" onChange={(event) => {setStartDate(event.target.value); if(endDate === "") {setEndDate(nextDay(event.target.value))}}} required />
          </div> 
          <div>
              <label htmlFor="end">Enddatum </label>
              <input type="date" id="start" value={endDate} name="invoice-start" onChange={(event) => {setEndDate(event.target.value); if(startDate === "") {setStartDate(lastDay(event.target.value))}}} required />
          </div> 

          {pdfTemplate === 'Mieter' && <MieterForm setFirstname={setFirstname} setLastname={setLastname} setStreet={setStreet} setCity={setCity} setPlz={setPlz} setPrice={setPrice} tax={tax} setTax={setTax} cleaning={cleaning} setCleaning={setCleaning} mieterTemplate={mieterTemplate} setMieterTemplate={setMieterTemplate}  />}
          {pdfTemplate === 'Besitzer' && <BesitzerForm setInvoice={setInvoice} setAuslagen={setAuslagen} />}

          <div style={{margin:"10px"}}>
              <button type="submit">PDF erstellen</button>
          </div> 
        </fieldset>
      </form>   
    </div>    
  )
}

export default Form