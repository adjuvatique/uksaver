import fetch from 'node-fetch';

const API_KEY = 'biPmMH1YGaNtNMOSYhfxt480OahSRcCr'; // Твой ключ Ticketmaster

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || 0;
  const size = url.searchParams.get('size') || 8;
  const city = url.searchParams.get('city');

  // API URL с фильтром по Великобритании
  let apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&countryCode=GB&page=${page}&size=${size}`;

  if (city && city !== 'All') {
    apiUrl += `&city=${encodeURIComponent(city)}`;
  }

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return new Response('Failed to fetch from Ticketmaster', { status: res.status });
    }
    const data = await res.json();

    // Отдаем данные клиенту
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
