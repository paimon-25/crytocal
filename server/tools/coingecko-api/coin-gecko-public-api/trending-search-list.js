/**
 * Function to retrieve the trending search list from CoinGecko.
 *
 * This endpoint allows you to query trending search coins, NFTs, and categories on CoinGecko in the last 24 hours.
 *
 * @returns {Promise<Object>} - The result of the trending search list.
 */
const executeFunction = async () => {
  const baseUrl = 'https://api.coingecko.com/api/v3';
  const apiKey = process.env.COINGECKO_API_API_KEY;

  try {
    // Construct the URL for the request
    const url = `${baseUrl}/search/trending`;

    // Set up headers for the request
    const headers = {
      'Accept': 'application/json',
      'x-cg-demo-api-key': apiKey
    };

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
    console.error('Error retrieving trending search list:', error);
    return {
      error: `An error occurred while retrieving the trending search list: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for retrieving the trending search list from CoinGecko.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_trending_search_list',
      description: 'Retrieve the trending search list from CoinGecko.',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
};

export { apiTool };