import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-boundary-canvas';
import { Popup } from 'react-leaflet';
import cities from './slovakia_corrected.geojson';
import regions from './corrected_regions.geojson';
import './map.css'
///static/media/slovakia_corrected.d0638925c0f8ac17604c.geojson
///static/media/corrected_districts.361863feb02e8003adb9.geojson
///static/media/corrected_regions.59043419ebb09e03b589.geojson
////static/media/corrected_cities.f48279542248cc54f324.geojson
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

const DistrictsLayer = ({ data }) => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState(null);
  const map = useMap();

  // Default style for districts
  const districtStyle = {
    fillColor: 'transparent',
    weight: 1,
    opacity: 1,
    color: 'black', // Border color for all districts
    fillOpacity: 0, // No fill for non-selected districts
  };

  // Style for the hovered district
  const hoverStyle = {
    weight: 3,
    color: '#666', // Dark grey border for hover
    fillColor: 'lightred', // Light red fill for hover
    fillOpacity: 0.5,
  };

  // Style for the selected district
  const selectedStyle = {
    fillColor: 'red', // Red fill for the selected district
    color: 'black', // Black border for the selected district
    weight: 2,
    fillOpacity: 0.7, // Solid fill for the selected district
  };

  const onEachDistrict = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        if (layer !== selectedLayer) {
          layer.setStyle(hoverStyle);
        }
      },
      mouseout: (e) => {
        if (layer !== selectedLayer) {
          layer.setStyle(districtStyle);
        }
      },
      click: (e) => {
        // Reset previously selected district's style, if there is one
        if (selectedLayer) {
          selectedLayer.setStyle(districtStyle);
        }
        // Update state with newly selected district's info and layer
        setSelectedDistrict({ name: feature.properties.NM4 });
        setSelectedLayer(layer);
        // Apply the selected style to the new selected district
        layer.setStyle(selectedStyle);
      
        // Calculate the center of the district's bounds
        const districtCenter = layer.getBounds().getCenter();
        console.log('District Center:', districtCenter);

        // Smoothly pan and zoom the map to the district's center. Specify a zoom level if needed.
        const zoomLevel = map.getZoom(); // You can adjust this zoom level as needed
        map.flyTo([districtCenter.lat, districtCenter.lng], zoomLevel);
      },
    });
  };

  useEffect(() => {
    // If there is a selected district, fit the map's view to its bounds
    if (selectedDistrict) {
      map.fitBounds(selectedLayer.getBounds());
    }
  }, [selectedDistrict, selectedLayer, map]);

  return (
    <>
      <GeoJSON data={data} style={districtStyle} onEachFeature={onEachDistrict} />
      {selectedDistrict && selectedLayer && (
  <Popup position={selectedLayer.getBounds().getCenter()}>
    {selectedDistrict.name}
  </Popup>
)}
    </>
  );
};

const Map = () => {
  const [slovakiaData, setSlovakiaData] = useState(null);
  const [districtsData, setDistrictsData] = useState(null);

  useEffect(() => {
    fetch(cities)
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
      <MapContainer center={[48.669, 19.699]} zoom={8} style={{ height: '100vh', width: '100%' }} dragging={false} touchZoom={false} scrollWheelZoom={true} doubleClickZoom={false} zoomControl={false}>
        {slovakiaData && <BoundaryLayer geojsonData={slovakiaData} />}
        {districtsData && <DistrictsLayer data={districtsData} />}
      </MapContainer>
    </div>
  );
};

export default Map;