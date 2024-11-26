// StarRating.js
import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating }) => {
  // 将评分四舍五入到最近的半星
  const roundedRating = Math.round(rating * 2) / 2;

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        const starValue = index + 1;

        if (roundedRating >= starValue) {
          // 全星
          return (
            <FaStar key={index} color="#ffc107" style={{ marginRight: 2 }} />
          );
        } else if (roundedRating + 0.5 === starValue) {
          // 半星
          return (
            <FaStarHalfAlt key={index} color="#ffc107" style={{ marginRight: 2 }} />
          );
        } else {
          // 空星
          return (
            <FaRegStar key={index} color="#e4e5e9" style={{ marginRight: 2 }} />
          );
        }
      })}
    </div>
  );
};

export default StarRating;