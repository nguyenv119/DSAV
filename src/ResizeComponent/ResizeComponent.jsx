import React, { useEffect, useState } from 'react';

const ResizeComponent = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    // Update window size when the component mounts
    updateWindowSize();

    // Event listener for window resize
    window.addEventListener('resize', updateWindowSize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  const updateWindowSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  // Render your components using the windowSize state
  return (
    <div>
      <p>Window width: {windowSize.width}</p>
      <p>Window height: {windowSize.height}</p>
      {/* Add your resizable components or logic here */}
    </div>
  );
};

export default ResizeComponent;
