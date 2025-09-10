/**
 * Function to get coin data by ID from CoinGecko.
 *
 * @param {Object} args - Arguments for the coin data retrieval.
 * @param {string} args.id - The ID of the coin to retrieve data for.
 * @param {boolean} [args.localization=true] - Include all the localized languages in the response.
 * @param {boolean} [args.tickers=true] - Include tickers data.
 * @param {boolean} [args.market_data=true] - Include market data.
 * @param {boolean} [args.community_data=true] - Include community data.
 * @param {boolean} [args.developer_data=true] - Include developer data.
 * @param {boolean} [args.sparkline=false] - Include sparkline 7 days data.
 * @returns {Promise<Object>} - The result of the coin data retrieval.
 */
const executeFunction = async ({ id, localization = true, tickers = true, market_data = true, community_data = true, developer_data = true, sparkline = false }) => {
  const baseUrl = 'https://api.coingecko.com/api/v3';
  const apiKey = process.env.COINGECKO_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/coins/${id}`);
    url.searchParams.append('localization', localization);
    url.searchParams.append('tickers', tickers);
    url.searchParams.append('market_data', market_data);
    url.searchParams.append('community_data', community_data);
    url.searchParams.append('developer_data', developer_data);
    url.searchParams.append('sparkline', sparkline);

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
    console.error('Error retrieving coin data:', error);
    return {
      error: `An error occurred while retrieving coin data: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for retrieving coin data by ID from CoinGecko.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_coin_data_by_id',
      description: 'Retrieve coin data by ID from CoinGecko.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the coin to retrieve data for.'
          },
          localization: {
            type: 'boolean',
            description: 'Include all the localized languages in the response.'
          },
          tickers: {
            type: 'boolean',
            description: 'Include tickers data.'
          },
          market_data: {
            type: 'boolean',
            description: 'Include market data.'
          },
          community_data: {
            type: 'boolean',
            description: 'Include community data.'
          },
          developer_data: {
            type: 'boolean',
            description: 'Include developer data.'
          },
          sparkline: {
            type: 'boolean',
            description: 'Include sparkline 7 days data.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };