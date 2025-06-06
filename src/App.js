import { useState, useEffect } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import MapIcon from '@mui/icons-material/Map';
import PersonIcon from '@mui/icons-material/Person';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
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
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem("mapData");
    return stored ? JSON.parse(stored) : mapData;
  });

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    localStorage.setItem("mapData", JSON.stringify(data));
  }, [data]);

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
      <Paper
        sx={{ position: "fixed", bottom: "var(--bottom-offset)", left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation value={tab} onChange={(e, v) => setTab(v)} showLabels>
          <BottomNavigationAction label="Home" value="home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Explore" value="explore" icon={<ExploreIcon />} />
          <BottomNavigationAction label="Map" value="map" icon={<MapIcon />} />
          <BottomNavigationAction label="Profile" value="profile" icon={<PersonIcon />} />
        </BottomNavigation>
      </Paper>
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
