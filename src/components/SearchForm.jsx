import React, { useState } from 'react';

const SearchForm = ({ onFilterByPrice, priceRange, resultCount, totalCount }) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterByPrice(minPrice, maxPrice);
  };

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    onFilterByPrice('', '');
  };

  // Quick filter presets
  const applyPreset = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    onFilterByPrice(min, max);
  };

  return (
    <div className="filter-section">
      <div className="filter-header">
        <h2>🔍 Filter Cryptocurrency</h2>
        <div className="result-info">
          Menampilkan <strong>{resultCount}</strong> dari <strong>{totalCount}</strong> crypto
        </div>
      </div>

      <form onSubmit={handleSubmit} className="filter-form">
        <div className="filter-inputs">
          <div className="input-group">
            <label htmlFor="minPrice">Harga Minimum (USD)</label>
            <input
              type="number"
              id="minPrice"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="$0"
              min="0"
              step="0.01"
              className="price-input"
            />
          </div>

          <div className="range-separator">—</div>

          <div className="input-group">
            <label htmlFor="maxPrice">Harga Maksimum (USD)</label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="$∞"
              min="0"
              step="0.01"
              className="price-input"
            />
          </div>
        </div>

        <div className="filter-actions">
          <button type="submit" className="filter-button">
            💰 Filter
          </button>
          <button 
            type="button" 
            onClick={handleReset}
            className="reset-button"
          >
            🔄 Reset
          </button>
        </div>
      </form>

      <div className="quick-filters">
        <p className="quick-filter-label">Quick Filters:</p>
        <div className="preset-buttons">
          <button 
            onClick={() => applyPreset('0', '1')}
            className="preset-btn"
          >
            &lt; $1
          </button>
          <button 
            onClick={() => applyPreset('1', '10')}
            className="preset-btn"
          >
            $1 - $10
          </button>
          <button 
            onClick={() => applyPreset('10', '100')}
            className="preset-btn"
          >
            $10 - $100
          </button>
          <button 
            onClick={() => applyPreset('100', '1000')}
            className="preset-btn"
          >
            $100 - $1K
          </button>
          <button 
            onClick={() => applyPreset('1000', '')}
            className="preset-btn"
          >
            &gt; $1K
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;