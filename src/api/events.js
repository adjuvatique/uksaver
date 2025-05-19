// /api/events.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { page = 0, size = 8, city } = req.query;
  const apiKey = process.env.TICKETMASTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  let url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&countryCode=GB&page=${page}&size=${size}&sort=date,asc`;
  if (city && city !== 'All') url += `&city=${encodeURIComponent(city)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.status(200).json({ events: data._embedded?.events || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
