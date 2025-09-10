/**
 * Function to get the price of a cryptocurrency by token address.
 *
 * @param {Object} args - Arguments for the token price query.
 * @param {string} args.id - The asset platform's id (required).
 * @param {string} args.contract_addresses - The contract addresses of tokens, comma-separated if querying more than 1 token's contract address (required).
 * @param {string} args.vs_currencies - Target currency of coins, comma-separated if querying more than 1 currency (required).
 * @param {boolean} [args.include_market_cap=false] - Include market capitalization.
 * @param {boolean} [args.include_24hr_vol=false] - Include 24hr volume.
 * @param {boolean} [args.include_24hr_change=false] - Include 24hr change.
 * @param {boolean} [args.include_last_updated_at=false] - Include last updated price time in UNIX.
 * @param {number} [args.precision=5] - Decimal place for currency price value.
 * @returns {Promise<Object>} - The result of the token price query.
 */
const executeFunction = async ({ id, contract_addresses, vs_currencies, include_market_cap = false, include_24hr_vol = false, include_24hr_change = false, include_last_updated_at = false, precision = 5 }) => {
  const baseUrl = 'https://api.coingecko.com/api/v3';
  const apiKey = process.env.COINGECKO_API_API_KEY;
  
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/simple/token_price/${id}`);
    url.searchParams.append('contract_addresses', contract_addresses);
    url.searchParams.append('vs_currencies', vs_currencies);
    url.searchParams.append('include_market_cap', include_market_cap);
    url.searchParams.append('include_24hr_vol', include_24hr_vol);
    url.searchParams.append('include_24hr_change', include_24hr_change);
    url.searchParams.append('include_last_updated_at', include_last_updated_at);
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
    console.error('Error fetching token price:', error);
    return {
      error: `An error occurred while fetching token price: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for fetching cryptocurrency prices by token address.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_token_price',
      description: 'Get the price of a cryptocurrency by token address.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The asset platform\'s id.'
          },
          contract_addresses: {
            type: 'string',
            description: 'The contract addresses of tokens, comma-separated if querying more than 1 token\'s contract address.'
          },
          vs_currencies: {
            type: 'string',
            description: 'Target currency of coins, comma-separated if querying more than 1 currency.'
          },
          include_market_cap: {
            type: 'boolean',
            description: 'Include market capitalization.'
          },
          include_24hr_vol: {
            type: 'boolean',
            description: 'Include 24hr volume.'
          },
          include_24hr_change: {
            type: 'boolean',
            description: 'Include 24hr change.'
          },
          include_last_updated_at: {
            type: 'boolean',
            description: 'Include last updated price time in UNIX.'
          },
          precision: {
            type: 'integer',
            description: 'Decimal place for currency price value.'
          }
        },
        required: ['id', 'contract_addresses', 'vs_currencies']
      }
    }
  }
};

export { apiTool };