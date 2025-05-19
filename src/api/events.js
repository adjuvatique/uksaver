import fetch from 'node-fetch';

const API_KEY = process.env.TICKETMASTER_API_KEY;

export default async function handler(req, res) {
  const { city = 'All', page = '0', size = '8' } = req.query;

  try {
    let allEvents = [];
    let currentPage = 0;
    const maxPages = 5; // ограничение на количество страниц для сбора

    // Формируем базовый URL для Ticketmaster API
    const baseUrl = new URL('https://app.ticketmaster.com/discovery/v2/events.json');

    // Функция для построения URL с параметрами
    function buildUrl(pageNum) {
      baseUrl.searchParams.set('apikey', API_KEY);
      baseUrl.searchParams.set('countryCode', 'GB');
      baseUrl.searchParams.set('size', size);
      baseUrl.searchParams.set('page', pageNum);
      baseUrl.searchParams.set('sort', 'date,asc');
      if (city && city !== 'All') {
        baseUrl.searchParams.set('city', city);
      } else {
        baseUrl.searchParams.delete('city');
      }
      return baseUrl.toString();
    }

    // Загружаем страницы пока не дойдем до нужной или maxPages
    while (currentPage <= parseInt(page) && currentPage < maxPages) {
      const url = buildUrl(currentPage);
      const response = await fetch(url);
      if (!response.ok) {
        const error = await response.json();
        return res.status(500).json({ error });
      }

      const data = await response.json();
      const eventsPage = data._embedded?.events || [];

      // Если загружаем нужную страницу - возвращаем только её события
      if (currentPage === parseInt(page)) {
        return res.status(200).json({ events: eventsPage });
      }
      allEvents = allEvents.concat(eventsPage);
      currentPage++;
    }

    res.status(200).json({ events: allEvents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
