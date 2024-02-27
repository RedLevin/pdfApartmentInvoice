import './App.css';

import React, { useState, useEffect } from 'react';
import axios from "axios";

import Form from './components/form';


function App() {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:3000/xlsx/');

      setApartments(response.data);
    }
    fetchData();
  }, []);

  return (
    <div className="App">
      <Form apartments={apartments} />
    </div>
  );
}

export default App;
