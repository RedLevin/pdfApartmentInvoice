import React, { useState, useEffect } from 'react';
  
const MieterForm = ({setFirstname, setLastname, setStreet, setCity, setPlz, setPrice, tax, setTax, cleaning, setCleaning, setMieterTemplate}) => {


    return (
        <div>
            <div style={{margin:"10px"}}>
                <legend>Mietertemplate</legend>
            </div >
            <div style={{margin:"10px"}}>          
                <div>
                    <input type="radio" id="bar" name="mieterTemplate" value="bar" onClick={(event) => {setMieterTemplate(event.target.value)}} required />
                    <label htmlFor="bar">Bar</label>
                </div>
                <div>
                    <input type="radio" id="100" name="mieterTemplate" value="100" onClick={(event) => {setMieterTemplate(event.target.value)}} />
                    <label htmlFor="100">100%</label>
                </div>
                <div>
                    <input type="radio" id="20" name="mieterTemplate" value="a1" onClick={(event) => {setMieterTemplate(event.target.value)}} />
                    <label htmlFor="20">Anzahlung 1 Woche</label>
                </div>
                <div>
                    <input type="radio" id="20" name="mieterTemplate" value="a2" onClick={(event) => {setMieterTemplate(event.target.value)}} />
                    <label htmlFor="20">Anzahlung 2 Woche</label>
                </div>
                <div>
                    <input type="radio" id="20" name="mieterTemplate" value="a3" onClick={(event) => {setMieterTemplate(event.target.value)}} />
                    <label htmlFor="20">Anzahlung 3 Woche</label>
                </div>
            </div>
            <div style={{margin:"10px"}}>
                <legend>Mieterdaten</legend>
            </div >
            <div style={{margin:"10px"}}>
                <label htmlFor="firstname">Vorname </label>
                <input type="text" onChange={(event) => {setFirstname(event.target.value)}} required/>
            </div>
            <div style={{margin:"10px"}}>
                <label htmlFor="lastname">Nachname </label>
                <input type="text" onChange={(event) => {setLastname(event.target.value)}} required/>
            </div> 
            <div style={{margin:"10px"}}>
                <label htmlFor="street">Straße </label>
                <input type="text" onChange={(event) => {setStreet(event.target.value)}} required/>
            </div>  
            <div style={{margin:"10px"}}>
                <label htmlFor="city">Stadt </label>
                <input type="text" onChange={(event) => {setCity(event.target.value)}} required/>
            </div>  
            <div style={{margin:"10px"}}>
                <label htmlFor="plz">PLZ </label>
                <input type="number" onChange={(event) => {setPlz(event.target.value)}} required/>
            </div>  
            <div style={{margin:"10px"}}>
                <label htmlFor="price">Preis(pro Nacht) </label>
                <input type="number" onChange={(event) => {setPrice(event.target.value)}} required/>
            </div>
            <div style={{margin:"10px"}}>
                <label htmlFor="tax">Steuernummer </label>
                <input type="checkbox" onClick={(event) => {setTax(!tax)}} />
            </div>  
            <div style={{margin:"10px"}}>
                <label htmlFor="tax">Reinigung separat </label>
                <input type="checkbox" onClick={(event) => {setCleaning(!cleaning)}} />
            </div>                
        </div>        
    );
}
  
export default MieterForm;