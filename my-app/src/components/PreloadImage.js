// PreloadImage.jsx
import { useEffect } from 'react';

const PreloadImage = ({ src, onLoad }) => {
  
  useEffect(() => {
    console.log("Starting to load image:", src); 
    const img = new Image();
    img.src = src;
    img.onload = () => {
        console.log("Image fully loaded:", src); 
        if (onLoad) onLoad();
      };
  }, [src, onLoad]);

  return null;
};

export default PreloadImage;
