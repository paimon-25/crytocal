/**
 * Function to retrieve a list of all supported coins from CoinGecko.
 *
 * @param {Object} args - Arguments for the coin list retrieval.
 * @param {boolean} [args.include_platform=false] - Whether to include platform and token's contract addresses.
 * @returns {Promise<Object>} - The list of coins with their id, name, and symbol.
 */
const executeFunction = async ({ include_platform = false }) => {
  const baseUrl = 'https://api.coingecko.com/api/v3';
  const apiKey = process.env.COINGECKO_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/coins/list`);
    url.searchParams.append('include_platform', include_platform.toString());

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
    console.error('Error retrieving coins list:', error);
    return {
      error: `An error occurred while retrieving the coins list: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for retrieving a list of coins from CoinGecko.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_coins_list',
      description: 'Retrieve a list of all supported coins from CoinGecko.',
      parameters: {
        type: 'object',
        properties: {
          include_platform: {
            type: 'boolean',
            description: 'Whether to include platform and token\'s contract addresses.'
          }
        },
        required: []
      }
    }
  }
};

export { apiTool };