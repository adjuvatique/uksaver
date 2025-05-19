import fetch from 'node-fetch';

export async function GET(request) {
  // Можно получить query параметры, например page, size и city из URL
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '0';
  const size = url.searchParams.get('size') || '8';
  const city = url.searchParams.get('city') || '';

  // Подставьте сюда ваш реальный URL API с ключом
  const TICKETMASTER_API_KEY = 'biPmMH1YGaNtNMOSYhfxt480OahSRcCr';

  let apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&countryCode=GB&size=${size}&page=${page}&sort=date,asc`;

  if (city) {
    apiUrl += `&city=${encodeURIComponent(city)}`;
  }

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return new Response('Failed to fetch from Ticketmaster API', { status: 500 });
    }
    const data = await res.json();

    // Вернём только нужные события из _embedded.events или пустой массив
    const events = data._embedded?.events || [];

    return new Response(JSON.stringify({ events }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
