import { useState, useEffect } from 'react';
import './App.css';
import MapView from './MapView';
import AddRestaurantForm from './AddRestaurantForm';
import mapData from './mapData.json';

function App() {
  const [tab, setTab] = useState('home');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [darkMode, setDarkMode] = useState(prefersDark);
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem('mapData');
    return stored ? JSON.parse(stored) : mapData;
  });

  useEffect(() => {
    localStorage.setItem('mapData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    document.body.dataset.theme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const handleAdd = (item) => {
    setData([...data, { ...item, notes: '', visited: false, rating: null, category: '' }]);
  };

  return (
    <div className="App">
      <nav className="Tabs">
        <button
          className={tab === 'home' ? 'active' : ''}
          onClick={() => setTab('home')}
        >
          Home
        </button>
        <button
          className={tab === 'map' ? 'active' : ''}
          onClick={() => setTab('map')}
        >
          Map
        </button>
        <button
          className="toggle"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? 'Light' : 'Dark'}
        </button>
      </nav>
      {tab === 'home' && (
        <div className="Form-wrapper">
          <AddRestaurantForm onAdd={handleAdd} />
        </div>
      )}
      {tab === 'map' && (
        <div className="Map-wrapper">
          <MapView data={data} onUpdate={(idx, updates) =>
            setData((d) =>
              d.map((item, i) => (i === idx ? { ...item, ...updates } : item))
            )
          } />
        </div>
      )}
    </div>
  );
}

export default App;
