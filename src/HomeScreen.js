import { useEffect, useState, useMemo } from 'react';
import AddRestaurantForm from './AddRestaurantForm';
import './HomeScreen.css';

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function HomeScreen({ onAdd, data }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    });
  }, []);

  const nearest = useMemo(() => {
    if (!location) return [];
    return data
      .filter((d) => d.latitude !== null && d.longitude !== null)
      .map((d) => ({
        ...d,
        distance: haversine(location.lat, location.lon, d.latitude, d.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
  }, [location, data]);

  return (
    <div className="Home">
      <div className="Intro">
        <h1>Restaurant Explorer</h1>
        <p>
          Discover and keep track of your favourite places to eat. Add new
          restaurants and see them on the map.
        </p>
      </div>
      <div className="FormCard">
        <h2>Add a Restaurant</h2>
        <AddRestaurantForm onAdd={onAdd} />
      </div>
      {nearest.length > 0 && (
        <div className="NearestSection">
          <h2>Nearby Restaurants</h2>
          <div className="NearestList">
            {nearest.map((r, idx) => (
              <div key={idx} className="RestaurantCard">
                <div className="title">{r.name}</div>
                {r.address && <div className="address">{r.address}</div>}
                <div className="distance">{r.distance.toFixed(1)} km</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomeScreen;
