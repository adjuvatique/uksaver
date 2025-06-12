import fetch from 'node-fetch';

const API_KEY = 'biPmMH1YGaNtNMOSYhfxt480OahSRcCr';

export async function GET({ url }) {
  const search = url.searchParams.get('search') || '';
  const page = url.searchParams.get('page') || 0;
  const size = url.searchParams.get('size') || 8;

  let query = `?apikey=${API_KEY}&page=${page}&size=${size}&countryCode=GB`;

  try {
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json${query}`);
    if (!res.ok) return new Response('Failed to fetch from Ticketmaster', { status: res.status });

    const data = await res.json();

    let events = data._embedded?.events || [];

    if (search) {
      const searchLower = search.toLowerCase();
      events = events.filter(e => e.name.toLowerCase().includes(searchLower));
    }

    return new Response(JSON.stringify({ events }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
