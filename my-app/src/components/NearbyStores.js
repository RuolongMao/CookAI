

import React, { useEffect, useState, useCallback } from "react";
import useLoadGoogleMapsApi from "./useLoadGoogleMapsApi";
import "../css/NearbyStores.css"; // Create a corresponding CSS file to style the interface

const NearbyStores = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [stores, setStores] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // 当前显示的组
  const isMapsApiLoaded = useLoadGoogleMapsApi();

  const STORES_PER_PAGE = 6; // 每页显示的商店数量

  // 获取用户位置
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

  // 计算两点间的距离
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;
    const R = 6371; // 地球半径（公里）
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 返回距离，单位为公里
  };

  // 调用 Places API 获取附近商店
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
      radius: 5000, // 搜索半径（米）
      type: ["supermarket"], // 商店类型
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

  // 加载商店数据
  useEffect(() => {
    if (location && isMapsApiLoaded) {
      fetchNearbyStores(location.latitude, location.longitude);
    }
  }, [location, isMapsApiLoaded, fetchNearbyStores]);

  // 分页处理
  const totalPages = Math.ceil(stores.length / STORES_PER_PAGE);
  const currentStores = stores.slice(
    currentPage * STORES_PER_PAGE,
    (currentPage + 1) * STORES_PER_PAGE
  );

  // 切换页面
  const nextPage = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
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
        <div className="store-part row">
          {currentStores.map((store) => (
            <div key={store.place_id} className="col-md-2">
              <div className="store-card">
                <div className="store-card-img-container">
                  {store.photos && store.photos.length > 0 ? (
                    <img
                      src={store.photos[0].getUrl({
                        maxWidth: 150,
                        maxHeight: 200,
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
                  <h5 className="store-name">{store.name}</h5>
                  <p className="card-text-vicinity">{store.vicinity}</p>
                  {store.rating && (
                    <p className="card-text">Rating: {store.rating}</p>
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
                    className="btn btn-primary"
                  >
                    View Details
                  </a>
                </div>
              </div>
            </div>
          ))}

          <div className="carousel-controls">
            <button
              className="btn btn-outline-primary"
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              &lt;
            </button>
            <button
              className="btn btn-outline-primary"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyStores;
