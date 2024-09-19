const API_BASE_URL = 'https://mobile.werate.io/api';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

async function register(username: string, password: string) {
  const response = await fetch(proxyUrl + `${API_BASE_URL}/v1/register`, {
    method: 'POST',
    headers: { ['Content-Type']: 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
}

async function login(username: string, password: string) {
  const response = await fetch(proxyUrl + `${API_BASE_URL}/v2/login`, {
    method: 'POST',
    headers: { ['Content-Type']: 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return response.json();
}

async function checkMfa(preAuthToken: string, mfaCode: string) {
  const response = await fetch(proxyUrl + `${API_BASE_URL}/v1/check-mfa`, {
    method: 'POST',
    headers: {
      ['Content-Type']: 'application/json',
      ['Authorization']: `Bearer ${preAuthToken}`
    },
    body: JSON.stringify({ code: mfaCode })
  });
  return response.json();
}

export { register, login, checkMfa };
