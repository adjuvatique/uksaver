import fetch from 'node-fetch';

const API_KEY = 'biPmMH1YGaNtNMOSYhfxt480OahSRcCr';

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || 0;
  const size = url.searchParams.get('size') || 8;
  const city = url.searchParams.get('city');

  let pageNumber = Number(page) + 1; // попытка сдвинуть страницу

  let apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&countryCode=GB&page=${pageNumber}&size=${size}`;
  if (city && city !== 'All') {
    apiUrl += `&city=${encodeURIComponent(city)}`;
  }

  console.log('API URL:', apiUrl);

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      console.error('Ошибка API:', await res.text());
      return new Response('Failed to fetch from Ticketmaster', { status: res.status });
    }
    const data = await res.json();

    console.log('Событий в ответе:', data._embedded?.events?.length || 0);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('Ошибка catch:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
