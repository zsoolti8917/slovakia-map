// src/SlovakiaMap.js

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import slovakia from './slovakia_corrected.geojson';
import regions from './corrected_regions.geojson';

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
 /* const [activeDistrict, setActiveDistrict] = useState(null);
  const activeDistrictIdRef = useRef(null);

  const map = useMap();

  // Function to reset the style of all districts
  const resetActiveDistrict = () => {
    map.eachLayer((layer) => {
      if (layer.feature && layer.feature.properties && layer.feature.properties.NM4 !== activeDistrictIdRef.current) {
        layer.setStyle(normalStyle);
      }
    });
  };


  useEffect(() => {
    console.log('Active District1:', activeDistrictIdRef.current);
    console.log('Active District2:', activeDistrictIdRef);

    if (activeDistrict) {
      activeDistrict.setStyle(hoverStyle);
    }
  }, [activeDistrict]);


  const onEachFeature = (feature, layer) => {
    const districtId = feature.properties.NM4;
    
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        if (districtId !== activeDistrictIdRef.current) {
          layer.setStyle(hoverStyle);
        }
      },
      mouseout: (e) => {
        const layer = e.target;
        if (districtId !== activeDistrictIdRef.current) {
          layer.setStyle(normalStyle);
        }
      },
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
const activeDistrictRef = useRef(null);
const map = useMap();

const resetActiveDistrict = () => {
  if (activeDistrictRef.current) {
    activeDistrictRef.current.setStyle(normalStyle);
  }
};

const onEachFeature = (feature, layer) => {
  layer.on({
    mouseover: (e) => {
      const layer = e.target;
      if (layer !== activeDistrictRef.current) {
        layer.setStyle(hoverStyle);
      }
    },
    mouseout: (e) => {
      const layer = e.target;
      if (layer !== activeDistrictRef.current) {
        layer.setStyle(normalStyle);
      }
    },
    click: (e) => {
      const clickedLayer = e.target;
      resetActiveDistrict();
      clickedLayer.setStyle(hoverStyle);
      activeDistrictRef.current = clickedLayer;

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
  const [districtsData, setDistrictsData] = useState(null);

  useEffect(() => {
    fetch(slovakia)
      .then((response) => response.json())
      .then((data) => setSlovakiaData(data))
      .catch((error) => console.error('Error loading the Slovakia GeoJSON:', error));

    // Adjust the path to your districts' GeoJSON
    fetch(regions)
      .then((response) => response.json())
      .then((data) => setDistrictsData(data))
      .catch((error) => console.error('Error loading the districts GeoJSON:', error));
  }, []);

  return (
    <div className="map-container">
      <MapContainer center={[48.669, 19.699]} zoom={8} style={{ height: '50vh', width: '100%' }} dragging={true} touchZoom={true} scrollWheelZoom={true} doubleClickZoom={false} zoomControl={false} zoomSnap={0.25}>
        {slovakiaData && <BoundaryLayer geojsonData={slovakiaData} />}
        {districtsData && <DistrictsLayer data={districtsData} />}

      </MapContainer>
    </div>
  );
};

export default SlovakiaMap;
