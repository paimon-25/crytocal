/**
 * Function to get the price of one or more coins by their unique Coin API IDs.
 *
 * @param {Object} args - Arguments for the coin price query.
 * @param {string} args.ids - The IDs of the coins to query, comma-separated if querying more than one coin.
 * @param {string} args.vs_currencies - The target currency of the coins, comma-separated if querying more than one currency.
 * @param {boolean} [args.include_market_cap=false] - Whether to include market cap in the response.
 * @param {boolean} [args.include_24hr_vol=false] - Whether to include 24hr volume in the response.
 * @param {boolean} [args.include_24hr_change=false] - Whether to include 24hr change in the response.
 * @param {boolean} [args.include_last_updated_at=false] - Whether to include last updated price time in UNIX format.
 * @param {number} [args.precision=5] - The decimal place for currency price value.
 * @returns {Promise<Object>} - The result of the coin price query.
 */
const executeFunction = async ({ ids, vs_currencies, include_market_cap = false, include_24hr_vol = false, include_24hr_change = false, include_last_updated_at = false, precision = 5 }) => {
  const baseUrl = 'https://api.coingecko.com/api/v3';
  const apiKey = process.env.COINGECKO_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/simple/price`);
    url.searchParams.append('ids', ids);
    url.searchParams.append('vs_currencies', vs_currencies);
    url.searchParams.append('include_market_cap', include_market_cap);
    url.searchParams.append('include_24hr_vol', include_24hr_vol);
    url.searchParams.append('include_24hr_change', include_24hr_change);
    url.searchParams.append('include_last_updated_at', include_last_updated_at);
    url.searchParams.append('precision', precision);

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
    console.error('Error fetching coin prices:', error);
    return {
      error: `An error occurred while fetching coin prices: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for fetching coin prices from CoinGecko.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_coin_prices',
      description: 'Get the price of one or more coins by their unique Coin API IDs.',
      parameters: {
        type: 'object',
        properties: {
          ids: {
            type: 'string',
            description: 'The IDs of the coins to query, comma-separated if querying more than one coin.'
          },
          vs_currencies: {
            type: 'string',
            description: 'The target currency of the coins, comma-separated if querying more than one currency.'
          },
          include_market_cap: {
            type: 'boolean',
            description: 'Whether to include market cap in the response.'
          },
          include_24hr_vol: {
            type: 'boolean',
            description: 'Whether to include 24hr volume in the response.'
          },
          include_24hr_change: {
            type: 'boolean',
            description: 'Whether to include 24hr change in the response.'
          },
          include_last_updated_at: {
            type: 'boolean',
            description: 'Whether to include last updated price time in UNIX format.'
          },
          precision: {
            type: 'integer',
            description: 'The decimal place for currency price value.'
          }
        },
        required: ['ids', 'vs_currencies']
      }
    }
  }
};

export { apiTool };