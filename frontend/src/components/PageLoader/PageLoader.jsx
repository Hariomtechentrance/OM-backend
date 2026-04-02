import React from 'react';
import './PageLoader.css';

/** Lightweight route transition shell — avoids raw "Loading..." flash */
const PageLoader = () => (
  <div className="page-loader" aria-busy="true" aria-label="Loading page">
    <div className="page-loader__inner">
      <div className="page-loader__spinner" />
      <span className="page-loader__text">Loading</span>
    </div>
  </div>
);

export default PageLoader;
