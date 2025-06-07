import { useState, useEffect } from 'react';
import { MdHome, MdExplore, MdMap, MdPerson, MdMenu } from 'react-icons/md';
import './App.css';
import MapView from './MapView';
import HomeScreen from './HomeScreen';
import ExploreScreen from './ExploreScreen';
import ProfileScreen from './ProfileScreen';
import LoadingScreen from './LoadingScreen';
import mapData from './mapData.json';


function App() {
  const [tab, setTab] = useState("home");
  const [loading, setLoading] = useState(true);
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [darkMode, setDarkMode] = useState(prefersDark);
  const [menuOpen, setMenuOpen] = useState(false);
  // Data is no longer persisted to localStorage. It simply
  // initializes from the bundled mapData.json file.
  const [data, setData] = useState(mapData);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(id);
  }, []);



  useEffect(() => {
    document.body.dataset.theme = darkMode ? "dark" : "light";
  }, [darkMode]);

  const handleAdd = (item) => {
    setData([
      ...data,
      { ...item, notes: "", visited: false, rating: null, category: "" },
    ]);
  };

  return (
    <div className="App">
      {loading && <LoadingScreen />}
      <nav className="Tabs">
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <MdMenu />
        </button>
        <div className={`Menu${menuOpen ? " open" : ""}`}>
          <button
            className={tab === "home" ? "active" : ""}
            onClick={() => {
              setTab("home");
              setMenuOpen(false);
            }}
          >
            <span className="icon" aria-label="Home">
              <MdHome />
            </span>
            <span className="label">Home</span>
          </button>
          <button
            className={tab === "explore" ? "active" : ""}
            onClick={() => {
              setTab("explore");
              setMenuOpen(false);
            }}
          >
            <span className="icon" aria-label="Explore">
              <MdExplore />
            </span>
            <span className="label">Explore</span>
          </button>
          <button
            className={tab === "map" ? "active" : ""}
            onClick={() => {
              setTab("map");
              setMenuOpen(false);
            }}
          >
            <span className="icon" aria-label="Map">
              <MdMap />
            </span>
            <span className="label">Map</span>
          </button>
          <button
            className={tab === "profile" ? "active" : ""}
            onClick={() => {
              setTab("profile");
              setMenuOpen(false);
            }}
          >
            <span className="icon" aria-label="Profile">
              <MdPerson />
            </span>
            <span className="label">Profile</span>
          </button>
        </div>
      </nav>
      {tab === 'home' && <HomeScreen onAdd={handleAdd} data={data} />}
      {tab === 'explore' && <ExploreScreen data={data} />}
      {tab === 'map' && (
        <div className="Map-wrapper">
          <MapView
            data={data}
            darkMode={darkMode}
            onUpdate={(idx, updates) =>
              setData((d) =>
                d.map((item, i) =>
                  i === idx ? { ...item, ...updates } : item,
                ),
              )
            }
          />
        </div>
      )}
      {tab === 'profile' && (
        <ProfileScreen darkMode={darkMode} setDarkMode={setDarkMode} />
      )}
    </div>
  );
}

export default App;
