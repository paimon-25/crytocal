/**
 * Function to get coin tickers by coin ID from the CoinGecko API.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.id - The ID of the coin to get tickers for.
 * @param {string} [args.exchange_ids] - Comma-separated list of exchange IDs to filter tickers.
 * @param {boolean} [args.include_exchange_logo=false] - Whether to include exchange logos.
 * @param {number} [args.page=1] - The page number for paginated results.
 * @param {boolean} [args.depth=false] - Whether to include order book depth information.
 * @returns {Promise<Object>} - The result of the coin tickers request.
 */
const executeFunction = async ({ id, exchange_ids, include_exchange_logo = false, page = 1, depth = false }) => {
  const baseUrl = 'https://api.coingecko.com/api/v3';
  const apiKey = process.env.COINGECKO_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/coins/${id}/tickers`);
    if (exchange_ids) url.searchParams.append('exchange_ids', exchange_ids);
    url.searchParams.append('include_exchange_logo', include_exchange_logo.toString());
    url.searchParams.append('page', page.toString());
    url.searchParams.append('order', 'trust_score_desc');
    url.searchParams.append('depth', depth.toString());

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
    console.error('Error fetching coin tickers:', error);
    return {
      error: `An error occurred while fetching coin tickers: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting coin tickers by coin ID from the CoinGecko API.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_coin_tickers',
      description: 'Get coin tickers by coin ID from the CoinGecko API.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the coin to get tickers for.'
          },
          exchange_ids: {
            type: 'string',
            description: 'Comma-separated list of exchange IDs to filter tickers.'
          },
          include_exchange_logo: {
            type: 'boolean',
            description: 'Whether to include exchange logos.'
          },
          page: {
            type: 'integer',
            description: 'The page number for paginated results.'
          },
          depth: {
            type: 'boolean',
            description: 'Whether to include order book depth information.'
          }
        },
        required: ['id']
      }
    }
  }
};

export { apiTool };