// server.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());

const API_KEY = 'biPmMH1YGaNtNMOSYhfxt480OahSRcCr';

app.get('/events', async (req, res) => {
  const city = req.query.city || 'London';
  const page = parseInt(req.query.page) || 0;
  const size = parseInt(req.query.size) || 8;
  const maxPages = 5;

  let allEvents = [];
  let currentPage = page;
  let totalPages = maxPages;

  try {
    while (currentPage < totalPages && allEvents.length < size) {
      const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
      url.searchParams.append('apikey', API_KEY);
      url.searchParams.append('countryCode', 'GB');
      url.searchParams.append('city', city);
      url.searchParams.append('page', currentPage);
      url.searchParams.append('size', size);
      url.searchParams.append('sort', 'date,asc');

      const response = await fetch(url.toString());
      if (!response.ok) {
        const error = await response.json();
        return res.status(500).json({ error });
      }

      const data = await response.json();

      if (data.page) {
        totalPages = data.page.totalPages;
      }

      if (data._embedded && data._embedded.events) {
        const newEvents = data._embedded.events.filter(
          e => !allEvents.some(existing => existing.id === e.id)
        );
        allEvents = allEvents.concat(newEvents);
      }

      currentPage++;
      if (allEvents.length >= size) break;
    }

    const eventsToReturn = allEvents.slice(0, size);

    res.json({ events: eventsToReturn, city, page });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
