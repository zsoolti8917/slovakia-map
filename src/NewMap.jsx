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

const selectedRegionStyle = {
  fillColor: 'blue',
  fillOpacity: 0.7,
};

// Define normal style
const normalStyle = {
  fillColor: 'white',
  fillOpacity: 0.2,
};



const RegionsLayer = ({ data , setActiveRegionIDN4 }) => {

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
      setActiveRegionIDN4(clickedLayer.feature.properties.IDN4);
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

const DistrictsLayer = ({ data, activeRegionIDN4 }) => {
  const map = useMap();
  const activeDistrictRef = useRef(null);

  const resetActiveDistrict = () => {
    if (activeDistrictRef.current) {
      activeDistrictRef.current.setStyle(normalStyle); // Revert to normal style
    }
  };

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle(hoverStyle);
      },
      mouseout: (e) => {
        const layer = e.target;
        if (layer !== activeDistrictRef.current) {
          layer.setStyle(normalStyle); // Only revert style if it's not the active district
        }
      },
      click: (e) => {
        const clickedLayer = e.target;

        resetActiveDistrict(); // Reset style of previously active district

        clickedLayer.setStyle({
          // Define the style for the active district
          fillColor: 'blue', // Example color, adjust as needed
          fillOpacity: 1, // Example opacity, adjust as needed
        });

        activeDistrictRef.current = clickedLayer; // Set the clicked layer as the active district

        const bounds = clickedLayer.getBounds();
        map.fitBounds(bounds); // Zoom to the district
      },
    });
  };

  useEffect(() => {
    if (!activeRegionIDN4) return; // Do not display districts if there's no active region IDN4

    const filteredData = {
      ...data,
      features: data.features.filter(district => String(district.properties.IDN3)[0] === String(activeRegionIDN4)) // Filter districts by matching the first digit of IDN3 with IDN4 of the active region
    };

    

    L.geoJSON(filteredData, {
      style: normalStyle, // Define as needed
      onEachFeature: onEachFeature,
    }).addTo(map);

    // Return a cleanup function to remove the layer when the component unmounts or activeRegionIDN4 changes
    return () => {
      map.eachLayer(layer => {
        if (layer.feature && String(layer.feature.properties.IDN3)[0] === String(activeRegionIDN4)) {
          map.removeLayer(layer);
        }
      });
    };
  }, [activeRegionIDN4, data, map]);

  return null;
};
// Main map component
const SlovakiaMap = () => {
  const [slovakiaData, setSlovakiaData] = useState(null);
  const [RegionsData, setRegionsData] = useState(null);
  const [districtsData, setDistrictsData] = useState(null);
  const [activeRegionIDN4, setActiveRegionIDN4] = useState(null); // Now tracking the IDN4 of the active region

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
        {RegionsData && <RegionsLayer data={RegionsData} setActiveRegionIDN4={setActiveRegionIDN4} />}
        {districtsData && activeRegionIDN4 && <DistrictsLayer data={districtsData} activeRegionIDN4={activeRegionIDN4} />}

      </MapContainer>
    </div>
  );
};

export default SlovakiaMap;
