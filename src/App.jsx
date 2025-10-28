import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import DetailCard from './components/DetailCard';
import DataTable from './components/DataTable';
import './App.css';

const App = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [portfolio, setPortfolio] = useState({});

  const BASE_URL = 'https://api.coingecko.com/api/v3';
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  // Utility function to delay execution
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Fetch with retry logic
  const fetchWithRetry = async (url, options = {}, retries = MAX_RETRIES) => {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        // Check if we hit rate limit
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Tunggu sebentar...');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (retries > 0) {
        await delay(RETRY_DELAY);
        return fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  };

  // Load portfolio from localStorage on mount
  useEffect(() => {
    const savedPortfolio = localStorage.getItem('cryptoPortfolio');
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
    fetchCryptoData();
  }, []);

  // Fetch cryptocurrency data
  const fetchCryptoData = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await fetchWithRetry(
        `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`
      );

      setCryptoData(data);
      setFilteredData(data);
    } catch (err) {
      let errorMsg = 'Terjadi kesalahan saat mengambil data';
      if (err.message.includes('Rate limit')) {
        errorMsg = err.message;
      } else if (err && err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg + '\nMencoba ulang dalam beberapa detik...');
      setCryptoData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle price filter
  const handleFilterByPrice = (min, max) => {
    setPriceRange({ min, max });

    if (min === '' && max === '') {
      setFilteredData(cryptoData);
      return;
    }

    const filtered = cryptoData.filter(crypto => {
      const price = crypto.current_price;
      const minPrice = min === '' ? 0 : parseFloat(min);
      const maxPrice = max === '' ? Infinity : parseFloat(max);
      return price >= minPrice && price <= maxPrice;
    });

    setFilteredData(filtered);
  };

  // Handle crypto selection for detail view
  const handleSelectCrypto = async (cryptoId) => {
    try {
      setDetailLoading(true);
      setError('');
      
      // Fetch detailed data with retry
      const [detailData, chartData] = await Promise.all([
        fetchWithRetry(`${BASE_URL}/coins/${cryptoId}`),
        fetchWithRetry(`${BASE_URL}/coins/${cryptoId}/market_chart?vs_currency=usd&days=7`)
      ]);

      if (!detailData || !chartData?.prices) {
        throw new Error('Data tidak lengkap dari API');
      }

      setSelectedCrypto({
        ...detailData,
        chartData: chartData.prices
      });
    } catch (err) {
      let errorMsg = 'Gagal mengambil detail cryptocurrency';
      if (err.message.includes('Rate limit')) {
        errorMsg = err.message;
      } else if (err && err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg + '\nMencoba ulang dalam beberapa detik...');
      setSelectedCrypto(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Close detail view
  const handleCloseDetail = () => {
    setSelectedCrypto(null);
    setDetailLoading(false);
    setError('');
  };

  // Portfolio calculator
  const calculatePortfolio = (cryptoId, amount) => {
    const newPortfolio = {
      ...portfolio,
      [cryptoId]: parseFloat(amount) || 0
    };

    setPortfolio(newPortfolio);
    localStorage.setItem('cryptoPortfolio', JSON.stringify(newPortfolio));
  };

  // Get total portfolio value
  const getTotalPortfolioValue = () => {
    return Object.entries(portfolio).reduce((total, [cryptoId, amount]) => {
      const crypto = cryptoData.find(c => c.id === cryptoId);
      if (crypto && amount > 0) {
        return total + (crypto.current_price * amount);
      }
      return total;
    }, 0);
  };

  // Clear portfolio
  const clearPortfolio = () => {
    setPortfolio({});
    localStorage.removeItem('cryptoPortfolio');
  };

  // Create animated particles
  const createParticles = () => {
    const particles = [];
    for (let i = 0; i < 20; i++) {
      const moveX = Math.random() * window.innerWidth - 100;
      const moveY = Math.random() * window.innerHeight - 100;
      const delay = Math.random() * 15;
      const style = {
        left: Math.random() * 100 + '%',
        top: Math.random() * 100 + '%',
        '--move-x': moveX + 'px',
        '--move-y': moveY + 'px',
        animationDelay: delay + 's'
      };
      particles.push(<div key={i} className="particle" style={style} />);
    }
    return particles;
  };

  return (
    <div className="App">
      {/* Glowing Lines */}
      <div className="glow-line"></div>
      <div className="glow-line"></div>
      <div className="glow-line"></div>
      <div className="glow-line"></div>

      {/* Floating Particles */}
      <div className="particles">
        {createParticles()}
      </div>

      <Header 
        totalValue={getTotalPortfolioValue()}
        onRefresh={fetchCryptoData}
        loading={loading}
      />
      
      <main className="container">
        <SearchForm 
          onFilterByPrice={handleFilterByPrice}
          priceRange={priceRange}
          resultCount={filteredData.length}
          totalCount={cryptoData.length}
        />

        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}

        {(loading || detailLoading) && (
          <div className="loading">
            <div className="spinner"></div>
            <p>
              {detailLoading 
                ? 'Memuat detail cryptocurrency...' 
                : 'Memuat data cryptocurrency...'}
              {error && '\nMencoba mengambil data kembali...'}
            </p>
          </div>
        )}

        {!loading && filteredData.length === 0 && cryptoData.length > 0 && (
          <div className="no-results">
            <h3>🔍 Tidak ada cryptocurrency dalam range harga tersebut</h3>
            <p>Coba ubah filter harga Anda</p>
          </div>
        )}

        {!selectedCrypto && filteredData.length > 0 && (
          <DataTable 
            cryptoData={filteredData}
            onSelectCrypto={handleSelectCrypto}
            portfolio={portfolio}
            onUpdatePortfolio={calculatePortfolio}
            onClearPortfolio={clearPortfolio}
          />
        )}

        {selectedCrypto && (
          <DetailCard 
            crypto={selectedCrypto}
            onClose={handleCloseDetail}
            portfolio={portfolio}
            onUpdatePortfolio={calculatePortfolio}
          />
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Cryptocurrency Tracker - UTS Pemrograman Aplikasi Web</p>
        <p>NIM: 123140002 | Data from CoinGecko API</p>
      </footer>
    </div>
  );
};

export default App;