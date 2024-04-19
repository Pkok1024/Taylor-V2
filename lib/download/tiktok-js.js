class TiktokJs {
  // The base API URL for the TikTok downloader API
  constructor() {
    this.apiUrl = 'https://tiktokjs-downloader.vercel.app/api/v1/';
  }

  // Fetches data from the TikTok downloader API
  async fetchData(tiktok, endpoint, method = 'POST') {
    const url = `${this.apiUrl}${endpoint}${method === 'GET' ? `?url=${encodeURIComponent(tiktok)}` : ''}`;

    const options = {
      method: method,
      headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
      },
      body: method === 'POST' ? JSON.stringify({
        url: tiktok
      }) : null
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error.message);
      return method === 'POST' ? this.fetchData(tiktok, endpoint, 'GET') : Promise.reject(error);
    }
  }

  // Displays the available endpoints for the TikTok downloader API
  displayEndpoints() {
    return [
      'aweme', 'musicaldown', 'savetik', 'snaptik', 'snaptikpro',
      'ssstik', 'tikcdn', 'tikmate', 'tiktokdownloadr', 'tikwm', 'ttdownloader'
    ];
  }

  // Fetches data for the 'aweme' endpoint
  async aweme(link) {
    return await this.fetchData(link, 'aweme');
  }

  // Fetches data for the 'musicaldown' endpoint
  async musicaldown(link) {
    return await this.fetchData(link, 'musicaldown');
  }

  // Fetches data for the 'savetik' endpoint
  async savetik(link) {
    return await this.fetchData(link, 'savetik');
  }

  // Fetches data for the 'snaptik' endpoint
  async snaptik(link) {
    return await this.fetchData(link, 'snaptik');
  }

  // Fetches data for the 'snaptikpro' endpoint
  async snaptikpro(link) {
    return await this.fetchData(link, 'snaptikpro');
 
