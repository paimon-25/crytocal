/**
 * Function to get BTC-to-Currency exchange rates from CoinGecko.
 *
 * @returns {Promise<Object>} - The exchange rates for BTC against other currencies.
 */
const executeFunction = async () => {
  const baseUrl = 'https://api.coingecko.com/api/v3';
  const apiKey = process.env.COINGECKO_API_API_KEY;
  try {
    // Construct the URL for the exchange rates endpoint
    const url = `${baseUrl}/exchange_rates`;

    // Set up headers for the request
    const headers = {
      'Accept': 'application/json'
    };

    // If an API key is provided, add it to the headers
    if (apiKey) {
      headers['x-cg-demo-api-key'] = apiKey;
    }

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return {
      error: `An error occurred while fetching exchange rates: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for fetching BTC-to-Currency exchange rates from CoinGecko.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_btc_exchange_rates',
      description: 'Fetch BTC-to-Currency exchange rates from CoinGecko.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };