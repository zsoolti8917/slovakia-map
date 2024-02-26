import React from 'react'

export const regionsLayerflyto = () => {
  return (
    <div>regionsLayerflyto
        
    </div>
  )
}

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