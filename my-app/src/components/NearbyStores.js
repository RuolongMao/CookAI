import React, { useEffect, useState, useCallback } from "react";
import useLoadGoogleMapsApi from "./useLoadGoogleMapsApi";
import "../css/NearbyStores.css";
import { Modal, Button } from "react-bootstrap";
import StarRating from "./StarRating";

const NearbyStores = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [stores, setStores] = useState([]);
  const isMapsApiLoaded = useLoadGoogleMapsApi();

  const [showModal, setShowModal] = useState(false);

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

  // Calculate distance between two points
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon1 - lon2);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fetch nearby stores using Places API
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
      radius: 5000,
      type: ["supermarket"],
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const storesWithDistance = results.map((store) => ({
          ...store,
          distance: calculateDistance(
            latitude,
            longitude,
            store.geometry.location.lat(),
            store.geometry.location.lng()
          ),
        }));

        storesWithDistance.sort((a, b) => a.distance - b.distance);
        setStores(storesWithDistance);
      } else {
        console.error("Places API error:", status);
        setErrorMsg("Unable to retrieve nearby stores.");
      }
    });
  }, []);

  // Load store data
  useEffect(() => {
    if (location && isMapsApiLoaded) {
      fetchNearbyStores(location.latitude, location.longitude);
    }
  }, [location, isMapsApiLoaded, fetchNearbyStores]);

  // Control modal visibility
  const handleShowMore = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="nearby-stores-container">
      <h2>Nearby Stores</h2>
      {errorMsg && <p className="error">{errorMsg}</p>}
      {!location && !errorMsg && <p>Getting your location...</p>}
      {location && !stores.length && !errorMsg && (
        <p>Searching for nearby stores...</p>
      )}

      {stores.length > 0 && (
        <div className="nstore-row">
          <div className="store-part row">
            {stores.slice(0, 6).map((store) => (
              <div key={store.place_id} className="col-md-2">
                <div className="store-card">
                  <div className="store-card-img-container">
                    {store.photos && store.photos.length > 0 ? (
                      <img
                        src={store.photos[0].getUrl({
                          maxWidth: 800,
                          maxHeight: 600,
                        })}
                        alt={store.name}
                        className="store-card-img-top"
                      />
                    ) : (
                      <div className="store-placeholder-img">
                        No Image Available
                      </div>
                    )}
                  </div>
                  <div className="card-body">
                    <p className="store-name">{store.name}</p>
                    <p className="card-text-vicinity">{store.vicinity}</p>
                    {/* {store.rating && (
                      <p className="card-text">Rating: {store.rating}</p>
                    )} */}
                    {store.rating && (
                      <div className="card-text-rating">
                        <p className="card-rating-text">
                          Rating: {store.rating}
                        </p>
                        <StarRating rating={store.rating} />
                      </div>
                    )}
                    {store.distance && (
                      <p className="card-text">
                        Distance: {store.distance.toFixed(2)} km
                      </p>
                    )}
                    <a
                      href={`https://www.google.com/maps/place/?q=place_id:${store.place_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="unique-modal-store-link1"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="show-more-arrow" onClick={handleShowMore}>
            <i className="show-more-button">show more</i>
          </div>
        </div>
      )}

      {/* Modal Section */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        size="xl"
        className="unique-modal"
      >
        <Modal.Header closeButton className="unique-modal-header">
          <Modal.Title className="unique-modal-title">
            All Nearby Stores
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="30"
              fill="currentColor"
              className="unique-modal-icon"
              viewBox="0 0 16 16"
            >
              <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.37 2.37 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0M1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5M4 15h3v-5H4zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm3 0h-2v3h2z" />
            </svg>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="unique-modal-body">
          <div className="unique-modal-store-list row">
            {stores.map((store) => (
              <div
                key={store.place_id}
                className="unique-modal-store-card col-md-3"
              >
                <div className="unique-modal-store-card-content">
                  <div className="unique-modal-store-img-container">
                    {store.photos && store.photos.length > 0 ? (
                      <img
                        src={store.photos[0].getUrl({
                          maxWidth: 800,
                          maxHeight: 600,
                        })}
                        alt={store.name}
                        className="unique-modal-store-img"
                      />
                    ) : (
                      <div className="unique-modal-placeholder-img">
                        No Image Available
                      </div>
                    )}
                  </div>
                  <div className="unique-modal-card-body">
                    <h5 className="unique-modal-store-name">{store.name}</h5>
                    <p className="unique-modal-store-vicinity">
                      {store.vicinity}
                    </p>
                    {store.rating && (
                      <div className="unique-modal-card-text-rating">
                        <p className="unique-modal-card-rating-text">
                          Rating: {store.rating}
                        </p>
                        <StarRating rating={store.rating} />
                      </div>
                    )}
                    {store.distance && (
                      <p className="unique-modal-store-distance">
                        Distance: {store.distance.toFixed(2)} km
                      </p>
                    )}
                    <a
                      href={`https://www.google.com/maps/place/?q=place_id:${store.place_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="unique-modal-store-link"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="unique-modal-footer">
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NearbyStores;
