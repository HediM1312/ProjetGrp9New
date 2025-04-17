import React from "react";
import "./shimmer-button.css";

export function ShimmerButton({ children, className = "", ...props }) {
  return (
    <button className={`shimmer-button ${className}`} {...props}>
      {children}
      <div className="shimmer"></div>
    </button>
  );
}
