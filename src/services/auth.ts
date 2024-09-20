import axios from 'axios';

//authentication leaving commented code here to use it with a proxy
/* 
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
  const data = await response.json();

  /* // Store tokens in cookies with expiration based on response, keeping this on hold to take pull changes
  if (data.accessToken && data.refreshToken) {
    const cookies = new Cookies(req, res);

    // Calculate maxAge based on expiration dates
    const accessExpirationDate = new Date(data.accessExpirationDate).getTime() - Date.now();
    const refreshExpirationDate = new Date(data.refreshExpirationDate).getTime() - Date.now();

    cookies.set('accessToken', data.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: accessExpirationDate
    });
    cookies.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: refreshExpirationDate
    });
  } */

  return data;
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
