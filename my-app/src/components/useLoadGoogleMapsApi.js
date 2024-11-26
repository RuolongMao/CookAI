
import { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const useLoadGoogleMapsApi = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      console.error('Google API Key is missing. Please set REACT_APP_GOOGLE_API_KEY in your .env file.');
      return;
    }

    const loader = new Loader({
      apiKey,
      libraries: ['places'], // Include the Places library
      language: 'en', // Set language to English
      region: 'us',   // Set region to US (optional)
    });

    loader
      .load()
      .then(() => {
        console.log('Google Maps API loaded successfully.');
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load Google Maps API:', err);
      });

    // Clean-up function is not required here as @googlemaps/js-api-loader handles it
  }, [apiKey]);

  return isLoaded;
};

export default useLoadGoogleMapsApi;