import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// Fix Leaflet marker icon problem in React/Vite

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});


// Component to move map

function ChangeMapView({ position }) {

  const map = useMap();

  useEffect(() => {

    if (position) {

      map.setView(position, 15);

    }

  }, [position, map]);

  return null;
}


function FarmMap({ location }) {

  const [position, setPosition] = useState([
    9.9312,
    76.2673
  ]);

  const [placeName, setPlaceName] = useState(
    "Kochi, Kerala"
  );


  // Search location using OpenStreetMap Nominatim

  const searchLocation = async () => {

    if (!location || location.trim() === "") {

      alert("Please enter a location first.");

      return;

    }

    try {

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          location
        )}&limit=1`
      );


      const data = await response.json();


      if (data.length === 0) {

        alert(
          "Location not found. Please enter a valid location."
        );

        return;

      }


      const latitude = parseFloat(data[0].lat);

      const longitude = parseFloat(data[0].lon);


      setPosition([
        latitude,
        longitude
      ]);


      setPlaceName(data[0].display_name);

    }

    catch (error) {

      console.error(error);

      alert(
        "Unable to find the location. Please try again."
      );

    }

  };


  return (

    <div className="farm-map-container">


      <div className="map-header">

        <div>

          <h2>📍 Farm Location</h2>

          <p>
            Search your farm location and select it on the map.
          </p>

        </div>


        <button
          type="button"
          onClick={searchLocation}
          className="map-search-button"
        >
          Search Location
        </button>

      </div>


      <div className="map-wrapper">

        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          className="farm-map"
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          <ChangeMapView
            position={position}
          />


          <Marker
            position={position}
          >

            <Popup>

              <strong>
                📍 Farm Location
              </strong>

              <br />

              {placeName}

            </Popup>

          </Marker>

        </MapContainer>

      </div>


      <div className="location-info">

        <strong>
          Selected Location:
        </strong>

        <p>
          {placeName}
        </p>

        <div className="coordinates">

          <span>
            Latitude: {position[0].toFixed(6)}
          </span>

          <span>
            Longitude: {position[1].toFixed(6)}
          </span>

        </div>

      </div>


    </div>

  );
}


export default FarmMap;