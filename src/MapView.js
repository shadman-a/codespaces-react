import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import mapData from './mapData.json';

// Fix leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function MapView() {
  const markers = mapData.filter(
    (m) => m.latitude !== null && m.longitude !== null
  );

  const center =
    markers.length > 0 ? [markers[0].latitude, markers[0].longitude] : [0, 0];

  return (
    <MapContainer
      center={center}
      zoom={11}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {markers.map((marker, idx) => (
        <Marker position={[marker.latitude, marker.longitude]} key={idx}>
          <Popup>
            <strong>{marker.name}</strong>
            {marker.address && <br />}
            {marker.address}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
