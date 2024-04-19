import fetch from 'node-fetch'

const apiKey = '414ed3dd91mshcc92bca3c605999p125f24jsnf2650ad70ac3';
const apiHost = 'robomatic-ai.p.rapidapi.com';
const apiPath = '/api.php';

const requestOptions = {
  method: 'POST',
  headers: {
    'content-type': 'application/x-www-form-urlencoded',
    'X-RapidAPI-Host': apiHost,
    'X-RapidAPI-Key': apiKey,
  },
};

const handler = async (m, { conn, args, text }) => {
  if (!text) {
    throw 'Input text';
  }

  const encodedParams = new URLSearchParams();
  encodedParams.append('in', text);
  encodedParams.append('op', 'in');
  encodedParams.append('cbot', '1');
  encodedParams.append('SessionID', 'RapidAPI1');
  encodedParams.append('ChatSource', 'RapidAPI');
  encodedParams.append('cbid', '1');
  encodedParams.append('key', 'RHMN5hnQ4wTYZBGCF3dfxzypt68rVP');

  requestOptions.body = encodedParams;

  try {
    const response = await fetch(`https://${apiHost}${apiPath}`, requestOptions);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.message || 'Unexpected error');
    }

    m.reply(json.out);
  } catch (e) {
    m.reply(`An error occurred: ${e.message}`);
  }
};

