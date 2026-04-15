import React, { useState } from 'react';
import Navbar from './components/Layout/Navbar';
import CurrentWeather from './components/CurrentWeather/CurrentWeather';
import Historical from './components/Historical/Historical';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('current');

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'current' ? <CurrentWeather /> : <Historical />}
    </div>
  );
}

export default App;