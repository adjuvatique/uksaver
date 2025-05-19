import fetch from 'node-fetch';

const API_KEY = 'biPmMH1YGaNtNMOSYhfxt480OahSRcCr'; // твой ключ Ticketmaster

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || 0;
  const size = url.searchParams.get('size') || 8;
  const city = url.searchParams.get('city') || '';

  // Фильтр по стране + пагинация
  let apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&page=${page}&size=${size}&countryCode=GB`;

  if (city && city !== 'All') {
    apiUrl += `&city=${encodeURIComponent(city)}`;
  }

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return new Response('Failed to fetch from Ticketmaster', { status: res.status });
    }
    const data = await res.json();

    // Забираем события из data._embedded.events
    const events = data._embedded?.events || [];

    return new Response(JSON.stringify({ events }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',  // отключаем кеширование
      }
    });
  } catch (err) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
