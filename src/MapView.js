import { useRef, useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { MdFilterList } from "react-icons/md";
import TextField from "@mui/material/TextField";
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
  const [sort, setSort] = useState("default");
  const [location, setLocation] = useState(null);

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

  const haversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const categories = useMemo(() => {
    const cats = new Set();
    for (const item of data) {
      if (item.category) cats.add(item.category);
    }
    return Array.from(cats).sort();
  }, [data]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      });
    }
  }, []);

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
    })
    .map(({ item, idx }) => {
      let distance = null;
      if (
        sort === "distance" &&
        location &&
        item.latitude !== null &&
        item.longitude !== null
      ) {
        distance = haversine(
          location.lat,
          location.lon,
          item.latitude,
          item.longitude,
        );
      }
      return { item, idx, distance };
    })
    .sort((a, b) => {
      if (sort === "alphabetical") {
        return a.item.name.localeCompare(b.item.name);
      }
      if (sort === "distance") {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      }
      return 0;
    });

  const center = location
    ? [location.lat, location.lon]
    : markers.length > 0
      ? [markers[0].latitude, markers[0].longitude]
      : [0, 0];

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.flyTo([location.lat, location.lon], 13);
    }
  }, [location]);

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
          <TextField
            variant="standard"
            className="search-input"
            placeholder="Search for food…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{ disableUnderline: true }}
            fullWidth
            sx={{ flex: 1 }}
          />
          <button
            className="filter-btn"
            aria-label="Filters"
            aria-expanded={showFilters}
            onClick={() => setShowFilters(!showFilters)}
          >
            <MdFilterList size={24} />
          </button>
        </div>
        <div className="CategoryRow">
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
        <div className={`Filters${showFilters ? '' : ' collapsed'}`}>
          <div className="SortRow">
            <label htmlFor="sort-select">Sort:</label>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="default">None</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>
        {filteredItems.map(({ item, idx, distance }) => (
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
              {sort === "distance" && distance !== null && (
                <div className="distance">{distance.toFixed(1)} km</div>
              )}
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
        {location && (
          <Circle
            center={[location.lat, location.lon]}
            radius={50}
            pathOptions={{ color: "blue" }}
          />
        )}
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
