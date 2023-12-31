import React from 'react';
import {
  LARGER_COLOR,
  SMALLER_COLOR,
  } from "../SortingVisualizer/SortingVisualizer";

const ProgressBar = ({ comparisons, totalComparisons  }) => {
  const maxWidth = '100%';
  const progressWidth = `${(comparisons / totalComparisons) * parseFloat(maxWidth)}%`;

  const progressBarStyle = {
    width: progressWidth,
    position: 'relative',
    top: 0,
    left: 0,
    height: '15px',
    backgroundColor: LARGER_COLOR
  };
  
  const backgroundStyle = {
    width: maxWidth,
    height: '10px',
    borderRadius: '0',
    backgroundColor: SMALLER_COLOR,
    position: 'relative',
    top: 0,
    left: 0,
  };

  return (
    <div>
      <div className="progress" style={backgroundStyle}>
        <div
          className="progress-bar"
          role="progressbar"
          style={progressBarStyle}
          aria-valuenow={comparisons}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;