const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const { API_URL } = require('./constants').current;
const { getAllPages } = require('Shared/api');

const GLITCH_TEAM_ID = 74;

const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

let homeCache = null;
let pupdateCache = null;

async function getHomeData() {
  if (!homeCache) {
    const json = await fs.readFile(path.join(__dirname, '../src/curated/home.json'));
    homeCache = JSON.parse(json);
  }
  return homeCache;
}

async function saveHomeDataToFile({ data, persistentToken }) {
  const teams = await getAllPages(api, `/v1/users/by/persistentToken/teams?persistentToken=${persistentToken}&limit=100`);
  if (!teams.some((team) => team.id === GLITCH_TEAM_ID)) throw new Error('Forbidden');

  homeCache = data;
  await fs.writeFile(path.join(__dirname, '../src/curated/pupdate.json'), JSON.stringify(data), { encoding: 'utf8' });
}

async function getPupdateData() {
  if (!pupdateCache) {
    const json = await fs.readFile(path.join(__dirname, '../src/curated/pupdate.json'));
    pupdateCache = JSON.parse(json);
  }
  return pupdateCache;
}

async function savePupdateDataToFile({ data, persistentToken }) {
  const teams = await getAllPages(api, `/v1/users/by/persistentToken/teams?persistentToken=${persistentToken}&limit=100`);
  if (!teams.some((team) => team.id === GLITCH_TEAM_ID)) throw new Error('Forbidden');

  pupdateCache = data;
  await fs.writeFile(path.join(__dirname, '../src/curated/pupdates.json'), JSON.stringify(data), { encoding: 'utf8' });
}

module.exports = { getHomeData, saveHomeDataToFile, getPupdateData, savePupdateDataToFile };
