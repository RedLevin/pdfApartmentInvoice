import React, { useState, useEffect } from 'react';
  
const BesitzerForm = ({setInvoice, setAuslagen}) => {
    return (
        <div>
            <div style={{margin:"10px"}}>
                <label htmlFor="invoice">Rechnungsnummer </label>
                <input type="number" onChange={(event) => {setInvoice(event.target.value)}} required/>
            </div>
            <div style={{margin:"10px"}}>
                <label htmlFor="auslagerung">Auslagen </label>
                <input type="number" step="0.01" onChange={(event) => {setAuslagen(event.target.value)}} />
            </div>
        </div>        
    );
}
  
export default BesitzerForm;