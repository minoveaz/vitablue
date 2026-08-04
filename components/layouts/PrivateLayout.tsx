import React from 'react';

/** Private application shell. It deliberately has no public navigation or analytics UI. */
const PrivateLayout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="min-h-screen bg-background-light font-sans text-text-main">
    {children}
  </div>
);

export default PrivateLayout;
