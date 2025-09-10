/**
 * Function to get historical market chart data for a specific coin.
 *
 * @param {Object} args - Arguments for the historical chart data request.
 * @param {string} args.id - The ID of the coin to retrieve data for.
 * @param {string} args.vs_currency - The target currency of the market data.
 * @param {string} args.days - The number of days ago to retrieve data for.
 * @param {string} [args.interval='daily'] - The data interval (default is daily).
 * @param {number} [args.precision=5] - The decimal place for currency price value (default is 5).
 * @returns {Promise<Object>} - The historical market chart data for the specified coin.
 */
const executeFunction = async ({ id, vs_currency, days, interval = 'daily', precision = 5 }) => {
  const baseUrl = 'https://api.coingecko.com/api/v3';
  const apiKey = process.env.COINGECKO_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/coins/${id}/market_chart`);
    url.searchParams.append('vs_currency', vs_currency);
    url.searchParams.append('days', days);
    url.searchParams.append('interval', interval);
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
    console.error('Error fetching historical market chart data:', error);
    return {
      error: `An error occurred while fetching historical market chart data: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting historical market chart data for a coin.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_historical_market_chart_data',
      description: 'Get historical market chart data for a specific coin.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the coin to retrieve data for.'
          },
          vs_currency: {
            type: 'string',
            description: 'The target currency of the market data.'
          },
          days: {
            type: 'string',
            description: 'The number of days ago to retrieve data for.'
          },
          interval: {
            type: 'string',
            description: 'The data interval.'
          },
          precision: {
            type: 'integer',
            description: 'The decimal place for currency price value.'
          }
        },
        required: ['id', 'vs_currency', 'days']
      }
    }
  }
};

export { apiTool };