const axios = require('axios');

const client = axios.create({
  baseURL: 'https://points-app-backend.vercel.app',
  headers: {
    'Content-Type': 'application/json'
  }
});

module.exports = client;