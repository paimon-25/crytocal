/**
 * Function to get historical data for a coin by its ID from CoinGecko.
 *
 * @param {Object} args - Arguments for the historical data request.
 * @param {string} args.id - The ID of the coin to query.
 * @param {string} args.date - The date of data snapshot in `dd-mm-yyyy` format.
 * @param {boolean} [args.localization=true] - Include all localized languages in response.
 * @returns {Promise<Object>} - The historical data for the specified coin.
 */
const executeFunction = async ({ id, date, localization = true }) => {
  const baseUrl = 'https://api.coingecko.com/api/v3';
  const apiKey = process.env.COINGECKO_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/coins/${id}/history`);
    url.searchParams.append('date', date);
    url.searchParams.append('localization', localization.toString());

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
    console.error('Error fetching historical data:', error);
    return {
      error: `An error occurred while fetching historical data: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for fetching historical data for a coin from CoinGecko.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_coin_historical_data',
      description: 'Get historical data for a coin by its ID from CoinGecko.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the coin to query.'
          },
          date: {
            type: 'string',
            description: 'The date of data snapshot in `dd-mm-yyyy` format.'
          },
          localization: {
            type: 'boolean',
            description: 'Include all localized languages in response.'
          }
        },
        required: ['id', 'date']
      }
    }
  }
};

export { apiTool };