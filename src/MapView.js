import { useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DetailModal from './DetailModal';
// Map data is provided by parent via props

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

function MapView({ data, onUpdate }) {
  const mapRef = useRef();
  const markerRefs = useRef({});
  const [modalIndex, setModalIndex] = useState(null);

  const markers = data
    .map((m, idx) =>
      m.latitude !== null && m.longitude !== null ? { ...m, idx } : null
    )
    .filter(Boolean);

  const center =
    markers.length > 0 ? [markers[0].latitude, markers[0].longitude] : [0, 0];

  const handleItemClick = (idx) => {
    const item = data[idx];
    if (item.latitude !== null && item.longitude !== null && mapRef.current) {
      mapRef.current.flyTo([item.latitude, item.longitude], 13);
      const ref = markerRefs.current[idx];
      if (ref) {
        ref.openPopup();
      }
    }
  };

  return (
    <div className="MapWithList">
      <div className="SideList">
        <ul>
          {data.map((item, idx) => (
            <li key={idx} onClick={() => handleItemClick(idx)}>
              <span className="arrow">\u279C</span> {item.name}
            </li>
          ))}
        </ul>
      </div>
      <MapContainer
        className="Map-area"
        center={center}
        zoom={11}
        style={{ height: '400px', width: '100%' }}
      >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {markers.map((marker) => (
        <Marker
          position={[marker.latitude, marker.longitude]}
          key={marker.idx}
          ref={(ref) => {
            if (ref) markerRefs.current[marker.idx] = ref;
          }}
          eventHandlers={{
            click: () => setModalIndex(marker.idx),
          }}
        >
          <Popup>
            <strong>{marker.name}</strong>
            {marker.address && <br />}
            {marker.address}
          </Popup>
        </Marker>
      ))}
      </MapContainer>
      {modalIndex !== null && (
        <DetailModal
          item={data[modalIndex]}
          onClose={() => setModalIndex(null)}
          onSave={(updates) => {
            onUpdate && onUpdate(modalIndex, updates);
            setModalIndex(null);
          }}
        />
      )}
    </div>
  );
}

export default MapView;
