/**
 * Function to get the OHLC chart of a coin by its ID from the CoinGecko API.
 *
 * @param {Object} args - Arguments for the OHLC chart request.
 * @param {string} args.id - The ID of the coin.
 * @param {string} args.vs_currency - The target currency of price data.
 * @param {number} [args.days=365] - The number of days of historical data to retrieve.
 * @param {number} [args.precision=5] - The decimal places for currency price value.
 * @returns {Promise<Array>} - The OHLC chart data for the specified coin.
 */
const executeFunction = async ({ id, vs_currency, days = 365, precision = 5 }) => {
  const baseUrl = 'https://api.coingecko.com/api/v3';
  const apiKey = process.env.COINGECKO_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/coins/${id}/ohlc`);
    url.searchParams.append('vs_currency', vs_currency);
    url.searchParams.append('days', days.toString());
    url.searchParams.append('precision', precision.toString());

    // Set up headers for the request
    const headers = {
      'Accept': 'application/json',
      'x-cg-demo-api-key': apiKey
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
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
    console.error('Error fetching OHLC chart:', error);
    return {
      error: `An error occurred while fetching the OHLC chart: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting the OHLC chart of a coin from CoinGecko.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_coin_ohlc',
      description: 'Get the OHLC chart of a coin by its ID.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the coin.'
          },
          vs_currency: {
            type: 'string',
            description: 'The target currency of price data.'
          },
          days: {
            type: 'integer',
            description: 'The number of days of historical data to retrieve.'
          },
          precision: {
            type: 'integer',
            description: 'The decimal places for currency price value.'
          }
        },
        required: ['id', 'vs_currency']
      }
    }
  }
};

export { apiTool };