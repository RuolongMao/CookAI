// src/NearbyStores.js
import React, { useEffect, useState, useCallback } from "react";
import useLoadGoogleMapsApi from "./useLoadGoogleMapsApi";
import "../css/NearbyStores.css"; // Create a corresponding CSS file to style the interface

const NearbyStores = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [stores, setStores] = useState([]);
  const isMapsApiLoaded = useLoadGoogleMapsApi();

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setErrorMsg("User denied the geolocation request.");
              break;
            case error.POSITION_UNAVAILABLE:
              setErrorMsg("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setErrorMsg("The request to get user location timed out.");
              break;
            default:
              setErrorMsg(
                "An unknown error occurred while retrieving location information."
              );
              break;
          }
        }
      );
    } else {
      setErrorMsg("Your browser does not support geolocation.");
    }
  }, []);



    // Calculate distance between two latitude/longitude points
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const toRadians = (degrees) => (degrees * Math.PI) / 180;
      const R = 6371; // Earth radius in kilometers
      const dLat = toRadians(lat2 - lat1);
      const dLon = toRadians(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
          Math.cos(toRadians(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in kilometers
    };

  // Use useCallback to cache the fetchNearbyStores function, avoiding infinite loops due to dependency changes
  const fetchNearbyStores = useCallback((latitude, longitude) => {
    if (!window.google || !window.google.maps) {
      console.error("Google Maps API has not loaded yet.");
      return;
    }

    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    const request = {
      location: new window.google.maps.LatLng(latitude, longitude),
      radius: 5000, // Search radius in meters
      type: ["supermarket"], // Type of place
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setStores(results);
      } else {
        console.error("Places API error:", status);
        setErrorMsg("Unable to retrieve nearby stores.");
      }
    });
  }, []);

  // Call Places API to get nearby stores
  useEffect(() => {
    if (location && isMapsApiLoaded) {
      fetchNearbyStores(location.latitude, location.longitude);
    }
  }, [location, isMapsApiLoaded, fetchNearbyStores]);

  return (
    // <div className="nearby-stores-container">
    //   <h2>Nearby Stores</h2>
    //   {errorMsg && <p className="error">{errorMsg}</p>}
    //   {!location && !errorMsg && <p>Getting your location...</p>}
    //   {location && !stores.length && !errorMsg && (
    //     <p>Searching for nearby stores...</p>
    //   )}
    //   {stores.length > 0 && (
    //     <div className="row">
    //       {stores.map((store) => (

            
    //         <div key={store.place_id} className="col-md-4 mb-4">
    //           <div className="card" style={{ width: "18rem" }}>
                
    //             <div className="card-img-container">
    //               {store.photos && store.photos.length > 0 ? (
    //                 <img
    //                   src={store.photos[0].getUrl({
    //                     maxWidth: 150,
    //                     maxHeight: 200,
    //                   })}
    //                   alt={store.name}
    //                   className="card-img-top"
    //                 />
    //               ) : (
    //                 <div className="placeholder-img">No Image Available</div>
    //               )}
    //             </div>

    //             <div className="card-body">
                  

    //               <h6>{store.name}</h6>
        
    //               <p className="card-text">{store.vicinity}</p>
    //               {store.rating && (
    //                 <p className="card-text">Rating: {store.rating}</p>
    //               )}
    //               {store.opening_hours && (
    //                 <p className="card-text">
    //                   {store.opening_hours.isOpen() ? "Open now" : "Closed"}
    //                 </p>
    //               )}
    //               <a
    //                 href={`https://www.google.com/maps/place/?q=place_id:${store.place_id}`}
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //                 className="btn btn-primary"
    //               >
    //                 View Details
    //               </a>
    //             </div>
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   )}
    // </div>
    <div className="nearby-stores-container">
    <h2>Nearby Stores</h2>
    {errorMsg && <p className="error">{errorMsg}</p>}
    {!location && !errorMsg && <p>Getting your location...</p>}
    {location && !stores.length && !errorMsg && (
      <p>Searching for nearby stores...</p>
    )}
    {stores.length > 0 && (
      <div className="row">
        {stores.map((store) => {
          const distance = location
            ? calculateDistance(
                location.latitude,
                location.longitude,
                store.geometry.location.lat(),
                store.geometry.location.lng()
              )
            : null;

          return (
            <div key={store.place_id} className="col-md-4 mb-4">
              <div className="card" style={{ width: "18rem" }}>
                <div className="card-img-container">
                  {store.photos && store.photos.length > 0 ? (
                    <img
                      src={store.photos[0].getUrl({
                        maxWidth: 150,
                        maxHeight: 200,
                      })}
                      alt={store.name}
                      className="card-img-top"
                    />
                  ) : (
                    <div className="placeholder-img">No Image Available</div>
                  )}
                </div>

                <div className="card-body">
                  <h6>{store.name}</h6>
                  <p className="card-text">{store.vicinity}</p>
                  {store.rating && (
                    <p className="card-text">Rating: {store.rating}</p>
                  )}
                  {distance && (
                    <p className="card-text">
                      Distance: {distance.toFixed(2)} km
                    </p>
                  )}
                  {store.opening_hours && (
                    <p className="card-text">
                      {store.opening_hours.isOpen() ? "Open now" : "Closed"}
                    </p>
                  )}
                  <a
                    href={`https://www.google.com/maps/place/?q=place_id:${store.place_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
  );
};

export default NearbyStores;
