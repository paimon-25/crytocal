/**
 * Function to retrieve a list of coins with market data from CoinGecko.
 *
 * @param {Object} args - Arguments for the coin market data retrieval.
 * @param {string} args.vs_currency - The target currency of coins and market data (required).
 * @param {string} [args.ids] - Comma-separated coin IDs if querying more than one coin.
 * @param {string} [args.category] - Filter based on coins' category.
 * @param {string} [args.order='id_asc'] - Sort result by field, default is 'id_asc'.
 * @param {number} [args.per_page=100] - Total results per page, default is 100 (valid values: 1...250).
 * @param {number} [args.page=1] - Page through results, default is 1.
 * @param {boolean} [args.sparkline=false] - Include sparkline 7 days data, default is false.
 * @param {string} [args.price_change_percentage] - Include price change percentage timeframe.
 * @param {string} [args.locale='ar'] - Language background, default is 'ar'.
 * @param {number} [args.precision=5] - Decimal place for currency price value.
 * @returns {Promise<Object>} - The result of the coin market data retrieval.
 */
const executeFunction = async ({
  vs_currency,
  ids,
  category,
  order = 'id_asc',
  per_page = 100,
  page = 1,
  sparkline = false,
  price_change_percentage,
  locale = 'ar',
  precision = 5
}) => {
  const baseUrl = 'https://api.coingecko.com/api/v3';
  const apiKey = process.env.COINGECKO_API_API_KEY;
  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/coins/markets`);
    url.searchParams.append('vs_currency', vs_currency);
    if (ids) url.searchParams.append('ids', ids);
    if (category) url.searchParams.append('category', category);
    url.searchParams.append('order', order);
    url.searchParams.append('per_page', per_page.toString());
    url.searchParams.append('page', page.toString());
    url.searchParams.append('sparkline', sparkline.toString());
    if (price_change_percentage) url.searchParams.append('price_change_percentage', price_change_percentage);
    url.searchParams.append('locale', locale);
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
    console.error('Error retrieving coin market data:', error);
    return {
      error: `An error occurred while retrieving coin market data: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for retrieving a list of coins with market data from CoinGecko.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_coins_markets',
      description: 'Retrieve a list of coins with market data from CoinGecko.',
      parameters: {
        type: 'object',
        properties: {
          vs_currency: {
            type: 'string',
            description: 'The target currency of coins and market data.'
          },
          ids: {
            type: 'string',
            description: 'Comma-separated coin IDs if querying more than one coin.'
          },
          category: {
            type: 'string',
            description: 'Filter based on coins\' category.'
          },
          order: {
            type: 'string',
            description: 'Sort result by field.'
          },
          per_page: {
            type: 'integer',
            description: 'Total results per page.'
          },
          page: {
            type: 'integer',
            description: 'Page through results.'
          },
          sparkline: {
            type: 'boolean',
            description: 'Include sparkline 7 days data.'
          },
          price_change_percentage: {
            type: 'string',
            description: 'Include price change percentage timeframe.'
          },
          locale: {
            type: 'string',
            description: 'Language background.'
          },
          precision: {
            type: 'integer',
            description: 'Decimal place for currency price value.'
          }
        },
        required: ['vs_currency']
      }
    }
  }
};

export { apiTool };