import React from 'react';
import {    PRIMARY_COLOR,
  SECONDARY_COLOR,
  LARGER_COLOR,
  SMALLER_COLOR,
  DONE_COLOR } from "../SortingVisualizer/SortingVisualizer";

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
    height: '15px',
    backgroundColor: SMALLER_COLOR,
    position: 'relative',
    top: -15,
    left: 0,
  };
  
  const labelStyle = {
    position: 'relative',
    top: 0,
    left: 10,
    fontSize: '16px',
    color: 'white',
  };

  return (
    <div>
      <div style={labelStyle}>
        {/* Estimated Progress */}
        <br />
        {/* Current Case: {comparisons} - Worse Case: {totalComparisons} */}
      </div>

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