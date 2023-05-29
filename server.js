const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.COINMARKETCAP_API_KEY;

app.use(express.static('public'));

app.get('/api/recommendation', async (req, res) => {
  try {
    const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      params: {
        start: 1,
        limit: 5,
        convert: 'USD',
      },
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });

    const cryptocurrencies = response.data.data;
    if (cryptocurrencies.length > 0) {
      const mostValuableToken = cryptocurrencies[0].symbol;
      const recommendation = `Based on the latest market data, consider investing in ${mostValuableToken}.`;
      res.send(recommendation);
    } else {
      res.status(404).send('No data available. Try again later.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred. Please try again.');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});