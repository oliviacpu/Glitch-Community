const fs = require('fs').promises;
const axios = require('axios');

const { API_URL } = require('./constants').current;
const { getAllPages } = require('Shared/api');

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

async function saveHomeDataToFile ({ data, persistentToken }) {
  
}