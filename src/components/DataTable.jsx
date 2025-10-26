import React, { useState } from 'react';

function PortfolioInput({ value, onChange }) {
  const [inputValue, setInputValue] = useState(value || '');
  const [isValid, setIsValid] = useState(true);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    // Only allow positive numbers and empty
    if (val === '' || (/^\d*\.?\d*$/.test(val) && parseFloat(val) >= 0)) {
      setIsValid(true);
      onChange(val);
    } else {
      setIsValid(false);
    }
  };

  return (
    <input
      type="number"
      min="0"
      step="0.01"
      value={inputValue}
      onChange={handleChange}
      placeholder="0.00"
      className={`portfolio-input${isValid ? '' : ' invalid'}`}
    />
  );
}

const DataTable = ({ cryptoData, onSelectCrypto, portfolio, onUpdatePortfolio, onClearPortfolio }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'market_cap_rank', direction: 'asc' });

  // === Currency Formatter ===
  const formatCurrency = (value) => {
    if (value >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(value);
  };

  // === Large Number Formatter ===
  const formatLargeNumber = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  // === Sorting Logic ===
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = () => {
    const sorted = [...cryptoData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const sortedData = getSortedData();

  // === Portfolio Calculations ===
  const totalPortfolio = sortedData.reduce((total, crypto) => {
    const amount = portfolio[crypto.id] || 0;
    return total + (crypto.current_price * amount);
  }, 0);

  const hasPortfolio = Object.values(portfolio).some(amount => amount > 0);

  return (
    <section className="data-section">
      {/* === Section Header === */}
      <div className="section-header">
        <h2>📊 Cryptocurrency Market</h2>
        {hasPortfolio && (
          <button onClick={onClearPortfolio} className="clear-portfolio-btn">
            🗑️ Clear Portfolio
          </button>
        )}
      </div>

      {/* === Table Wrapper === */}
      <div className="table-wrapper">
        <table className="crypto-table">
          <thead>
            <tr>
              <th onClick={() => sortData('market_cap_rank')} className="sortable">
                # {sortConfig.key === 'market_cap_rank' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Coin</th>
              <th onClick={() => sortData('current_price')} className="sortable">
                Price {sortConfig.key === 'current_price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => sortData('price_change_percentage_24h')} className="sortable">
                24h % {sortConfig.key === 'price_change_percentage_24h' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => sortData('market_cap')} className="sortable">
                Market Cap {sortConfig.key === 'market_cap' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Portfolio</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {sortedData.map((crypto) => {
              const portfolioAmount = portfolio[crypto.id] || 0;
              const portfolioValue = portfolioAmount * crypto.current_price;

              return (
                <tr key={crypto.id} className="crypto-row">
                  <td className="rank-cell">{crypto.market_cap_rank}</td>
                  <td className="coin-cell">
                    <div className="coin-info">
                      <img src={crypto.image} alt={crypto.name} className="coin-image" />
                      <div className="coin-details">
                        <span className="coin-name">{crypto.name}</span>
                        <span className="coin-symbol">{crypto.symbol.toUpperCase()}</span>
                      </div>
                    </div>
                  </td>

                  <td className="price-cell">{formatCurrency(crypto.current_price)}</td>

                  <td className={`change-cell ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
                    {crypto.price_change_percentage_24h >= 0 ? '▲' : '▼'}{' '}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </td>

                  <td className="marketcap-cell">{formatLargeNumber(crypto.market_cap)}</td>

                  <td className="portfolio-cell">
                    <div className="portfolio-flex">
                      <PortfolioInput
                        value={portfolioAmount}
                        onChange={val => onUpdatePortfolio(crypto.id, val)}
                      />
                      {portfolioAmount > 0 && (
                        <div className="portfolio-value">
                          = {formatCurrency(portfolioValue)}
                        </div>
                      )}
                    </div>
                  </td>


                  <td className="action-cell">
                    <button
                      onClick={() => onSelectCrypto(crypto.id)}
                      className="detail-btn"
                      title={`Lihat detail ${crypto.name}`}
                    >
                      <span style={{fontSize: '1.2em', display: 'inline-block'}}>�</span>
                      Detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* === Portfolio Summary === */}
      {hasPortfolio && (
        <div className="portfolio-summary">
          <h3>💼 Portfolio Summary</h3>
          <div className="summary-content">
            <div className="summary-item">
              <span>Total Coins:</span>
              <strong>{Object.values(portfolio).filter(v => v > 0).length}</strong>
            </div>
            <div className="summary-item total">
              <span>Total Value:</span>
              <strong>{formatCurrency(totalPortfolio)}</strong>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DataTable;
