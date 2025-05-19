import fetch from 'node-fetch';

const API_KEY = 'biPmMH1YGaNtNMOSYhfxt480OahSRcCr';

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || '0';
  const city = url.searchParams.get('city') || 'All';
  const size = city === 'All' ? '50' : '20'; // Больше для всех городов, меньше для конкретного

  // Формируем базовый URL
  let apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&page=${page}&size=${size}&countryCode=GB&sort=date,asc`;

  if (city !== 'All') {
    apiUrl += `&city=${encodeURIComponent(city)}`;
  }

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return new Response('Failed to fetch from Ticketmaster', { status: res.status });
    }
    const data = await res.json();

    // Важно: если данных нет, возвращаем пустой список, чтобы не сломать клиент
    const events = data._embedded?.events || [];

    return new Response(JSON.stringify({ events }), {
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
