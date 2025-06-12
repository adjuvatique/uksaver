import fetch from 'node-fetch';

const API_KEY = 'biPmMH1YGaNtNMOSYhfxt480OahSRcCr';

export async function GET(request) {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || 0;
  const size = url.searchParams.get('size') || 8;
  const city = url.searchParams.get('city');
  const genre = url.searchParams.get('genre');
  const age = url.searchParams.get('age');
  const keyword = url.searchParams.get('keyword');

  let query = `?apikey=${API_KEY}&page=${page}&size=${size}&countryCode=GB`;

  if (keyword && keyword.trim() !== '') {
    query += `&keyword=${encodeURIComponent(keyword.trim())}`;
  }

  try {
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json${query}`);
    console.log(`Request URL: https://app.ticketmaster.com/discovery/v2/events.json${query}`);
    if (!res.ok) {
      return new Response('Failed to fetch from Ticketmaster', { status: res.status });
    }

    const data = await res.json();
    let events = data._embedded?.events || [];

    // Фильтрация по городу
    if (city && city !== 'All') {
      events = events.filter(event => {
        const eventCity = event._embedded?.venues?.[0]?.city?.name || '';
        return eventCity.toLowerCase() === city.toLowerCase();
      });
    }

    // Фильтрация по жанру
    if (genre && genre !== 'All') {
      events = events.filter(event => {
        const segment = event.classifications?.[0]?.segment?.name || '';
        return segment.toLowerCase() === genre.toLowerCase();
      });
    }

    // Фильтрация по возрасту
    if (age === '18+') {
      events = events.filter(e => e.ageRestrictions?.legalAgeEnforced);
    } else if (age === 'All ages') {
      events = events.filter(e => !e.ageRestrictions?.legalAgeEnforced);
    }

    return new Response(JSON.stringify({ events }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
