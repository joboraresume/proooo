import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FitFields({ positions, selectedPosition }) {
  const map = useMap();

  useEffect(() => {
    if (selectedPosition) {
      map.setView(selectedPosition, 14);
      return;
    }
    if (!positions.length) return;
    if (positions.length === 1) {
      map.setView(positions[0], 13);
      return;
    }
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [28, 28] });
  }, [map, positions, selectedPosition]);

  return null;
}

/**
 * Multi-field farm map.
 * @param {Array<{id:string,name?:string,lat?:number,lng?:number,locationLabel?:string}>} fields
 * @param {string|null} selectedFieldId
 * @param {(fieldId:string)=>void} onSelectField
 * @param {string} [height]
 */
function FarmMap({
  fields = [],
  selectedFieldId = null,
  onSelectField,
  height = 260,
}) {
  const markers = useMemo(
    () =>
      fields
        .map((field) => {
          const lat = Number(field.lat);
          const lng = Number(field.lng);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
          return {
            id: field.id,
            name: field.name || field.id,
            position: [lat, lng],
            label: field.locationLabel || "",
          };
        })
        .filter(Boolean),
    [fields]
  );

  const selected = markers.find((m) => m.id === selectedFieldId);
  const center = selected?.position || markers[0]?.position || [9.9312, 76.2673];

  if (!markers.length) {
    return (
      <div className="farm-map-empty" style={{ height: "100%", width: "100%" }}>
        No field locations yet. Register a field with a map pin to see it here.
      </div>
    );
  }

  return (
    <div className="farm-map-multi" style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", borderRadius: 12 }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitFields
          positions={markers.map((m) => m.position)}
          selectedPosition={selected?.position || null}
        />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            eventHandlers={{
              click: () => onSelectField?.(marker.id),
            }}
          >
            <Popup>
              <strong>{marker.name}</strong>
              {marker.label ? (
                <>
                  <br />
                  {marker.label}
                </>
              ) : null}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default FarmMap;
