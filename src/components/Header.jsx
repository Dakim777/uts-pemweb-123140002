import React from 'react';

const Header = ({ totalValue, onRefresh, loading }) => {
  // Format currency for portfolio display
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
        {/* === Left Section (Logo & Subtitle) === */}
        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Custom Logo: Lightning Bolt */}
          <span style={{
            fontSize: '2.5rem',
            color: 'var(--secondary)',
            filter: 'drop-shadow(0 0 8px #22d3ee)',
            fontWeight: 'bold',
            userSelect: 'none',
            letterSpacing: '-0.05em',
            marginRight: '0.5rem',
          }}>
            ⚡
          </span>
          <div>
            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: '2rem',
              background: 'linear-gradient(90deg, #22d3ee, #3b82f6)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              margin: 0,
              letterSpacing: '-0.02em',
              textShadow: '0 0 10px #22d3ee',
            }}>
              by Daffa Hakim
            </h1>
            <p className="subtitle" style={{ fontWeight: 600, color: 'var(--primary)', marginTop: '0.2rem' }}>
              Crypto Market & Portfolio | Original Web
            </p>
          </div>
        </div>

        {/* === Right Section (Portfolio + Refresh Button) === */}
        <div className="header-right">
          <div className="portfolio-value">
            <span className="portfolio-label">Portfolio Value</span>
            <span className="portfolio-amount">
              {formatCurrency(totalValue)}
            </span>
          </div>

          <button
            className="refresh-button"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh data"
          >
            <span
              className={`refresh-icon ${loading ? 'spinning' : ''}`}
              aria-hidden="true"
            >
              🔄
            </span>
            {loading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
