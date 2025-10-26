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
  const [error, setError] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [portfolio, setPortfolio] = useState({});

  const BASE_URL = 'https://api.coingecko.com/api/v3';

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

      const response = await fetch(
        `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`
      );

      if (!response.ok) {
        throw new Error('Gagal mengambil data cryptocurrency');
      }

      const data = await response.json();
      setCryptoData(data);
      setFilteredData(data);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data');
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
      setLoading(true);
      
      // Fetch detailed data
      const [detailResponse, chartResponse] = await Promise.all([
        fetch(`${BASE_URL}/coins/${cryptoId}`),
        fetch(`${BASE_URL}/coins/${cryptoId}/market_chart?vs_currency=usd&days=7`)
      ]);

      const detailData = await detailResponse.json();
      const chartData = await chartResponse.json();

      setSelectedCrypto({
        ...detailData,
        chartData: chartData.prices
      });
    } catch (err) {
      setError('Gagal mengambil detail cryptocurrency');
    } finally {
      setLoading(false);
    }
  };

  // Close detail view
  const handleCloseDetail = () => {
    setSelectedCrypto(null);
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

  return (
    <div className="App">
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

        {loading && !selectedCrypto && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Memuat data cryptocurrency...</p>
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
        <p>© 2025 Cryptocurrency Tracker - UTS Pengembangan Aplikasi Web</p>
        <p>NIM: 123140002 | Data from CoinGecko API</p>
      </footer>
    </div>
  );
};

export default App;