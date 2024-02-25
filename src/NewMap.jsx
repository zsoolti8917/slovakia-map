// src/SlovakiaMap.js

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import slovakia from './slovakia_corrected.geojson';
import regions from './corrected_regions.geojson';
import correctedDistricts from './corrected_districts.geojson';
// Component to apply the boundary canvas using the GeoJSON
const BoundaryLayer = ({ geojsonData }) => {
  const map = useMap();
  useEffect(() => {
    if (geojsonData) {
      const boundaryLayer = new L.TileLayer.BoundaryCanvas('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        boundary: geojsonData,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      });

      boundaryLayer.addTo(map);
    }
  }, [geojsonData, map]);

  return null;
};

// Define a style for the hover effect
const hoverStyle = {
  fillColor: 'red',
  fillOpacity: 0.7,
};

// Define normal style
const normalStyle = {
  fillColor: 'white',
  fillOpacity: 0.2,
};

const DistrictsLayer = ({ data }) => {
  // Similar implementation to RegionsLayer
  // Define styles, interaction, etc.
  
};

const RegionsLayer = ({ data }) => {
 /*
    click: (e) => {
      const clickedLayer = e.target;

      resetActiveDistrict();

      setActiveDistrict(clickedLayer);

      activeDistrictIdRef.current = districtId;

    console.log('Clicked District ID:', activeDistrictIdRef.current);

      const bounds = clickedLayer.getBounds();
      const center = bounds.getCenter();
      map.flyTo(center, map.getZoom(), {
        animate: true,
        duration: 0.5 // Duration in seconds, adjust as needed
      });

      // After the flyTo animation, fit the map to the bounds without animation
     map.once('moveend', () => {
        map.fitBounds(bounds, { animate: true, duration: 1});
        // Ensure active district retains hover style after map adjustments
        if (activeDistrict) {
          activeDistrict.setStyle(hoverStyle);
          console.log(activeDistrict.feature.properties.NM4);
        }
      });
    }
  });
};*/
const activeRegionRef = useRef(null);
const map = useMap();

const resetActiveRegion = () => {
  if (activeRegionRef.current) {
    activeRegionRef.current.setStyle(normalStyle);
  }
};

const onEachFeature = (feature, layer) => {
  layer.on({
    mouseover: (e) => {
      const layer = e.target;
      if (layer !== activeRegionRef.current) {
        layer.setStyle(hoverStyle);
      }
    },
    mouseout: (e) => {
      const layer = e.target;
      if (layer !== activeRegionRef.current) {
        layer.setStyle(normalStyle);
      }
    },
    click: (e) => {
      const clickedLayer = e.target;
      resetActiveRegion();
      clickedLayer.setStyle(hoverStyle);
      activeRegionRef.current = clickedLayer;

      const bounds = clickedLayer.getBounds();
      const center = bounds.getCenter();
      map.flyTo(center, map.getZoom(), {
        animate: true,
        duration: 0.5 // Duration in seconds, adjust as needed
      });
    },
  });
};
  return (
    <>
      <GeoJSON
        data={data}
        style={normalStyle}
        onEachFeature={onEachFeature}
      />
    </>
  );
};


// Main map component
const SlovakiaMap = () => {
  const [slovakiaData, setSlovakiaData] = useState(null);
  const [RegionsData, setRegionsData] = useState(null);
  const [districtsData, setDistrictsData] = useState(null);
  useEffect(() => {
    fetch(slovakia)
      .then((response) => response.json())
      .then((data) => setSlovakiaData(data))
      .catch((error) => console.error('Error loading the Slovakia GeoJSON:', error));

    // Adjust the path to your Regions' GeoJSON
    fetch(regions)
      .then((response) => response.json())
      .then((data) => setRegionsData(data))
      .catch((error) => console.error('Error loading the Regions GeoJSON:', error));

      fetch(correctedDistricts)
      .then((response) => response.json())
      .then((data) => setDistrictsData(data))
      .catch((error) => console.error('Error loading the Districts GeoJSON:', error));
  }, []);

  return (
    <div className="map-container">
      <MapContainer center={[48.669, 19.699]} zoom={8} style={{ height: '50vh', width: '100%' }} dragging={true} touchZoom={true} scrollWheelZoom={true} doubleClickZoom={false} zoomControl={false} zoomSnap={0.25}>
        {slovakiaData && <BoundaryLayer geojsonData={slovakiaData} />}
        {RegionsData && <RegionsLayer data={RegionsData} />}
        {districtsData && <DistrictsLayer data={districtsData} />} {/* Render DistrictsLayer */}

      </MapContainer>
    </div>
  );
};

export default SlovakiaMap;
