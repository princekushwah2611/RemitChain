import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Fetch real-time exchange rate from backend
 */
export async function fetchExchangeRate(fromCurrency = 'USD', toCurrency = 'INR') {
  try {
    const response = await axios.get(`${API_BASE_URL}/rate`, {
      params: { from: fromCurrency, to: toCurrency },
      timeout: 3000,
    });
    if (response.data && response.data.success) {
      return {
        rate: response.data.rate,
        source: response.data.source,
      };
    }
  } catch (error) {
    console.warn('API Service error, using client fallback rate:', error.message);
  }

  // Client-side fallback calculation if backend is unreachable
  const fallbacks = {
    'USD-INR': 83.50,
    'USD-PHP': 56.20,
    'USD-MXN': 17.15,
    'USD-NGN': 1450.00,
    'USD-BDT': 110.00,
    'USD-PKR': 279.50,
  };

  const key = `${fromCurrency.toUpperCase()}-${toCurrency.toUpperCase()}`;
  return {
    rate: fallbacks[key] || 83.50,
    source: 'fallback',
  };
}

/**
 * Sync transaction record to backend database
 */
export async function syncTransactionOffchain(txData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/transaction/sync`, txData, {
      timeout: 3000,
    });
    return response.data;
  } catch (error) {
    console.warn('Offchain transaction sync error:', error.message);
    return { success: false };
  }
}
