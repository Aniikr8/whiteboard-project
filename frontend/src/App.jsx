import React from 'react';
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Whiteboard from "./components/Whiteboard";
import Home from "./components/Home"
import './App.css'

function App() {


  return (
    <>
     
        <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Whiteboard />} />
      </Routes>
    </Router>
      
    </>
  )
}

export default App
