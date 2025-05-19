import fetch from 'node-fetch';

export async function GET({ url }) {
  const page = url.searchParams.get('page') || 0;
  const size = url.searchParams.get('size') || 8;
  const city = url.searchParams.get('city') || '';

  const API_KEY = 'biPmMH1YGaNtNMOSYhfxt480OahSRcCr'; // твой ключ

  // Формируем URL запроса к Ticketmaster
  let tmUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&countryCode=GB&page=${page}&size=${size}&sort=date,asc`;

  if (city && city !== 'All') {
    tmUrl += `&city=${encodeURIComponent(city)}`;
  }

  try {
    const response = await fetch(tmUrl);
    if (!response.ok) {
      return new Response('Failed to fetch from Ticketmaster', { status: 500 });
    }
    const data = await response.json();

    // Возвращаем только массив событий (или пустой массив)
    return new Response(JSON.stringify({
      events: data._embedded?.events || []
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
