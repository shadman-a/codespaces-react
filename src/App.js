import { useState } from 'react';
import './App.css';
import MapView from './MapView';

function App() {
  const [tab, setTab] = useState('home');

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
      </nav>
      {tab === 'home' && (
        <header className="App-header">
          <img
            src={process.env.PUBLIC_URL + '/Octocat.png'}
            className="App-logo"
            alt="logo"
          />
          <p>
            GitHub Codespaces <span className="heart">♥️</span> React
          </p>
          <p className="small">
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </p>
        </header>
      )}
      {tab === 'map' && (
        <div className="Map-wrapper">
          <MapView />
        </div>
      )}
    </div>
  );
}

export default App;
