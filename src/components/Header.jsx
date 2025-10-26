import React from 'react';

const Header = ({ totalValue, onRefresh, loading }) => {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1>₿ Cryptocurrency Tracker</h1>
          <p className="subtitle">Real-time Crypto Market Data</p>
        </div>
        
        <div className="header-right">
          <div className="portfolio-value">
            <span className="portfolio-label">Portfolio Value:</span>
            <span className="portfolio-amount">{formatCurrency(totalValue)}</span>
          </div>
          
          <button 
            className="refresh-button"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh data"
          >
            <span className={`refresh-icon ${loading ? 'spinning' : ''}`}>🔄</span>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;