import fetch from 'node-fetch';

const API_KEY = 'biPmMH1YGaNtNMOSYhfxt480OahSRcCr'; // твой Ticketmaster API ключ

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || 0;
  const size = url.searchParams.get('size') || 8;
  const city = url.searchParams.get('city') || '';

  // Формируем URL для Ticketmaster Discovery API
  // Добавляем фильтр по Великобритании (countryCode=GB)
  // и по городу, если выбран (city != '')
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

    // В ответ возвращаем только массив событий или пустой массив
    return new Response(
      JSON.stringify({ events: data._embedded?.events || [] }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      }
    );
  } catch (err) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
