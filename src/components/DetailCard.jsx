import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DetailCard = ({ crypto, onClose, portfolio, onUpdatePortfolio }) => {
  const [portfolioAmount, setPortfolioAmount] = useState(portfolio[crypto.id] || 0);

  // === Format Currency ===
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: value >= 1 ? 2 : 6
    }).format(value);
  };

  // === Format Large Numbers ===
  const formatLargeNumber = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  // === Chart Data ===
  const chartData = crypto.chartData?.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: price
  })) || [];

  // === Portfolio Handler ===
  const handlePortfolioChange = (value) => {
    setPortfolioAmount(value);
    onUpdatePortfolio(crypto.id, value);
  };

  const portfolioValue = portfolioAmount * crypto.market_data.current_price.usd;

  return (
    <div
      className="detail-overlay"
      onClick={e => {
        // Only close if clicking the overlay, not the modal itself
        if (e.target.classList.contains('detail-overlay')) {
          onClose();
        }
      }}
    >
      <div className="detail-modal">
        {/* === Close Button === */}
        <button onClick={onClose} className="close-button" title="Close">✕</button>
        {/* ...existing code... */}
        <div className="detail-header">
          <img src={crypto.image.large} alt={crypto.name} className="detail-coin-image" />
          <div className="detail-title">
            <h2>{crypto.name}</h2>
            <span className="detail-symbol">{crypto.symbol.toUpperCase()}</span>
            <span className="detail-rank">Rank #{crypto.market_cap_rank}</span>
          </div>
        </div>
        {/* ...existing code... */}
        {/* === Price Section === */}
        <div className="price-section">
          <div className="current-price">
            <span className="price-label">Current Price</span>
            <span className="price-value">
              {formatCurrency(crypto.market_data.current_price.usd)}
            </span>
          </div>
          <div className={`price-change ${crypto.market_data.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}`}>
            {crypto.market_data.price_change_percentage_24h >= 0 ? '▲' : '▼'}{' '}
            {Math.abs(crypto.market_data.price_change_percentage_24h).toFixed(2)}% (24h)
          </div>
        </div>
        {/* ...existing code... */}
        {/* === Chart Section === */}
        <div className="chart-section">
          <h3>📈 Price Chart (7 Days)</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  dataKey="date" 
                  stroke="#cbd5e1"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#cbd5e1"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                  formatter={(value) => [formatCurrency(value), 'Price']}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#3b82f6" 
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* ...existing code... */}
        {/* === Market Stats Section === */}
        <div className="market-stats">
          <h3>📊 Market Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Market Cap</span>
              <span className="stat-value">{formatLargeNumber(crypto.market_data.market_cap.usd)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">24h Volume</span>
              <span className="stat-value">{formatLargeNumber(crypto.market_data.total_volume.usd)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Circulating Supply</span>
              <span className="stat-value">
                {new Intl.NumberFormat('en-US').format(crypto.market_data.circulating_supply)} {crypto.symbol.toUpperCase()}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Max Supply</span>
              <span className="stat-value">
                {crypto.market_data.max_supply 
                  ? new Intl.NumberFormat('en-US').format(crypto.market_data.max_supply) + ' ' + crypto.symbol.toUpperCase()
                  : '∞'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">All-Time High</span>
              <span className="stat-value">{formatCurrency(crypto.market_data.ath.usd)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">All-Time Low</span>
              <span className="stat-value">{formatCurrency(crypto.market_data.atl.usd)}</span>
            </div>
          </div>
        </div>
        {/* ...existing code... */}
        {/* === Portfolio Calculator === */}
        <div className="portfolio-calculator">
          <h3>💼 Portfolio Calculator</h3>
          <div className="calculator-content">
            <div className="calculator-input">
              <label htmlFor="portfolioAmount">Amount of {crypto.symbol.toUpperCase()}</label>
              <input
                type="number"
                id="portfolioAmount"
                min="0"
                step="0.01"
                value={portfolioAmount || ''}
                onChange={(e) => handlePortfolioChange(e.target.value)}
                placeholder="0.00"
                className="calculator-field"
              />
            </div>
            {portfolioAmount > 0 && (
              <div className="calculator-result">
                <div className="result-item">
                  <span>Total Value:</span>
                  <strong>{formatCurrency(portfolioValue)}</strong>
                </div>
                <div className="result-item">
                  <span>Average Price:</span>
                  <strong>{formatCurrency(crypto.market_data.current_price.usd)}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* ...existing code... */}
        {/* === Description Section === */}
        {crypto.description?.en && (
          <div className="description-section">
            <h3>📝 About {crypto.name}</h3>
            <div 
              className="description-text"
              dangerouslySetInnerHTML={{ 
                __html: crypto.description.en.split('. ').slice(0, 3).join('. ') + '.' 
              }}
            />
          </div>
        )}
        {/* ...existing code... */}
        {/* === Links Section === */}
        <div className="links-section">
          <h3>🔗 Links</h3>
          <div className="links-grid">
            {crypto.links?.homepage[0] && (
              <a 
                href={crypto.links.homepage[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="link-button"
              >
                🌐 Website
              </a>
            )}
            {crypto.links?.blockchain_site[0] && (
              <a 
                href={crypto.links.blockchain_site[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="link-button"
              >
                ⛓️ Explorer
              </a>
            )}
            {crypto.links?.repos_url?.github[0] && (
              <a 
                href={crypto.links.repos_url.github[0]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="link-button"
              >
                💻 GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCard;
