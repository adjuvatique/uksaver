import fetch from 'node-fetch';

const API_KEY = 'biPmMH1YGaNtNMOSYhfxt480OahSRcCr';

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || 0;
  const size = url.searchParams.get('size') || 8;

  // Запрос всех событий по Великобритании без фильтра по городу
  const apiUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&page=${page}&size=${size}&countryCode=GB`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return new Response('Failed to fetch from Ticketmaster', { status: res.status });
    }
    const data = await res.json();

    return new Response(
      JSON.stringify({ events: data._embedded?.events || [] }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store'
        },
      }
    );
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
