import fetch from 'node-fetch';

const API_KEY = 'ТВОЙ_TICKETMASTER_API_KEY_ЗДЕСЬ'; // Вставь сюда свой ключ

export async function GET({ url }) {
  const city = url.searchParams.get('city') || '';
  const page = parseInt(url.searchParams.get('page')) || 0;
  const size = parseInt(url.searchParams.get('size')) || 50;

  const maxPages = 5;
  let allEvents = [];
  let currentPage = page;

  try {
    while (currentPage < maxPages) {
      const apiUrl = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
      apiUrl.searchParams.append('apikey', API_KEY);
      apiUrl.searchParams.append('countryCode', 'GB');
      if (city) apiUrl.searchParams.append('city', city);
      apiUrl.searchParams.append('size', size);
      apiUrl.searchParams.append('page', currentPage);
      apiUrl.searchParams.append('sort', 'date,asc');

      const response = await fetch(apiUrl.toString());
      if (!response.ok) {
        const error = await response.json();
        return new Response(JSON.stringify({ error }), { status: 500 });
      }

      const data = await response.json();
      if (data._embedded && data._embedded.events) {
        allEvents = allEvents.concat(data._embedded.events);
      }

      if (!data.page || data.page.number === data.page.totalPages - 1) {
        break;
      }

      currentPage++;
    }

    // Уникальные события (без дубликатов)
    const seen = new Set();
    const uniqueEvents = [];
    for (const ev of allEvents) {
      if (!seen.has(ev.id)) {
        uniqueEvents.push(ev);
        seen.add(ev.id);
      }
    }

    return new Response(JSON.stringify({ events: uniqueEvents.slice(0, size) }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
