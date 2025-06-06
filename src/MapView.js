import { useRef, useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import DetailModal from "./DetailModal";
import { geocodeAddress } from "./geocode";
// Map data is provided by parent via props

// Fix leaflet's default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function MapView({ data, onUpdate, darkMode = false }) {
  const mapRef = useRef();
  const markerRefs = useRef({});
  const [modalIndex, setModalIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const categoryEmojis = {
    bagel: "🥯",
    bakery: "🥐",
    bar: "🍺",
    bbq: "🍖",
    burger: "🍔",
    cafe: "☕️",
    chicken: "🍗",
    deli: "🥪",
    dessert: "🍰",
    indian: "🍛",
    japanese: "🍣",
    korean: "🥘",
    mexican: "🌮",
    noodles: "🍜",
    other: "🍽️",
    pizza: "🍕",
    seafood: "🦞",
    thai: "🥡",
    wine: "🍷",
  };

  const catLabel = (cat) => {
    const emoji = categoryEmojis[cat] || "🍽️";
    return `${emoji} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`;
  };

  const categories = useMemo(() => {
    const cats = new Set();
    for (const item of data) {
      if (item.category) cats.add(item.category);
    }
    return Array.from(cats).sort();
  }, [data]);

  useEffect(() => {
    async function fillMissing() {
      for (const [idx, item] of data.entries()) {
        if (item.latitude === null && item.longitude === null && item.address) {
          try {
            const coords = await geocodeAddress(item.address);
            if (coords) {
              onUpdate &&
                onUpdate(idx, {
                  latitude: coords.lat,
                  longitude: coords.lon,
                });
            }
          } catch (err) {
            console.error("Geocoding failed", err);
          }
        }
      }
    }
    fillMissing();
    // We only want to run when data changes
  }, [data, onUpdate]);

  const markers = data
    .map((m, idx) =>
      m.latitude !== null && m.longitude !== null ? { ...m, idx } : null,
    )
    .filter(Boolean);

  const filteredItems = data
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => {
      const term = search.toLowerCase();
      const matchesTerm =
        item.name.toLowerCase().includes(term) ||
        (item.address && item.address.toLowerCase().includes(term));
      const matchesCat = !activeCat || item.category === activeCat;
      return matchesTerm && matchesCat;
    });

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
    // Open the detail modal just like clicking on the marker
    setModalIndex(idx);
  };

  return (
    <div className="MapWithList">
      <div className="SideList">
        <div className="SearchBar">
          <input
            className="search-input"
            placeholder="Search for food…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            className="filter-btn"
            aria-label="Filters"
            aria-expanded={showFilters}
            onClick={() => setShowFilters(!showFilters)}
          >
            <span role="img" aria-label="Filter">
              ⚙️
            </span>
          </button>
        </div>
        <div className={`CategoryRow${showFilters ? '' : ' collapsed'}`}>
          {categories.map((c) => (
            <button
              key={c}
              className={c === activeCat ? "active" : ""}
              onClick={() => setActiveCat(c === activeCat ? null : c)}
            >
              {catLabel(c)}
            </button>
          ))}
        </div>
        {filteredItems.map(({ item, idx }) => (
          <div
            key={idx}
            className="place-card"
            onClick={() => handleItemClick(idx)}
          >
            <div className="card-info">
              <div className="title">
                <span className="check">{item.visited ? "✅" : "⬜️"}</span>
                {item.name}
              </div>
              {item.address && <div className="address">{item.address}</div>}
            </div>
            <span className="arrow">{"\u27A4"}</span>
          </div>
        ))}
      </div>
      <MapContainer
        className="Map-area"
        center={center}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url={
            darkMode
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
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
