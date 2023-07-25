import React from 'react';

const ProgressBar = ({ comparisons, totalComparisons  }) => {
  const maxWidth = '69%';
  const progressWidth = `${(comparisons / totalComparisons) * parseFloat(maxWidth)}%`;

  const progressBarStyle = {
    width: progressWidth,
    position: 'fixed',
    top: 50,
    left: 100,
    height: '10px',
    backgroundColor: 'green'
  };
  
  const backgroundStyle = {
    width: maxWidth,
    height: '10px',
    backgroundColor: 'red',
    position: 'fixed',
    top: 50,
    left: 100,
  };
  
  const labelStyle = {
    position: 'fixed',
    top: 30,
    left: 100,
    fontSize: '16px',
    color: 'white',
  };

  return (
    <div>

      <div style={labelStyle}>
        Estimated Progress
        <br />
        Current Case: {comparisons} - Worse Case: {totalComparisons}
      </div>

      <div className="progress" style={backgroundStyle}>
        <div
          className="progress-bar bg-success"
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