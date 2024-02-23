// App.jsx
import React from 'react';
import Map from './Map'; // Make sure the path is correct based on your file structure
import './App.css'; // Importing App specific styles
import SlovakiaMap from './NewMap.jsx';

const App = () => {
  return (
    <div className="App">
      <SlovakiaMap />
    </div>
  );
};

export default App;
