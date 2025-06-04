import { useState } from 'react';
import { geocodeAddress } from './geocode';

function AddRestaurantForm({ onAdd }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    let lat = latitude ? parseFloat(latitude) : null;
    let lon = longitude ? parseFloat(longitude) : null;
    if (lat === null && lon === null && address) {
      try {
        const result = await geocodeAddress(address);
        if (result) {
          lat = result.lat;
          lon = result.lon;
        }
      } catch (err) {
        console.error('Geocoding failed', err);
      }
    }
    onAdd({
      name,
      address: address || null,
      latitude: lat,
      longitude: lon,
    });
    setName('');
    setAddress('');
    setLatitude('');
    setLongitude('');
  };

  return (
    <form className="AddForm" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type="number"
        step="any"
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
      />
      <input
        type="number"
        step="any"
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddRestaurantForm;
