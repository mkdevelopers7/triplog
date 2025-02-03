// import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";
import Button from "../components/Button";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useGeolocation } from "../hooks/useGeoLocation";
import { useURLPosition } from "../hooks/useURLPosition";

function Map() {
  const [mapLat, mapLng] = useURLPosition();

  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: geoLoactionLoading,
    position: geoLoactionPosition,
    getPosition,
  } = useGeolocation();

  const { cities } = useCities();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geoLoactionPosition)
        setMapPosition([geoLoactionPosition.lat, geoLoactionPosition.lng]);
    },
    [geoLoactionPosition]
  );

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        className={styles.map}
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city?.position?.lat, city?.position?.lng]}
          >
            <Popup>
              <span>{city.emoji}</span> <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
      {!geoLoactionPosition && (
        <Button type="position" onClick={() => getPosition()}>
          {geoLoactionLoading ? "Loading..." : "Use Your Location"}
        </Button>
      )}
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

export default Map;
