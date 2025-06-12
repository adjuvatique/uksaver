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

  if (city && city !== 'All') {
    query += `&city=${encodeURIComponent(city)}`;
  }

  if (genre && genre !== 'All') {
    query += `&segmentName=${encodeURIComponent(genre)}`;
  }

  try {
    const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json${query}`);
    if (!res.ok) {
      return new Response('Failed to fetch from Ticketmaster', { status: res.status });
    }

    const data = await res.json();
    let events = data._embedded?.events || [];

    // Фильтрация по возрасту
    if (age === '18+') {
      events = events.filter(e => e.ageRestrictions?.legalAgeEnforced);
    } else if (age === 'All ages') {
      events = events.filter(e => !e.ageRestrictions?.legalAgeEnforced);
    }

    // Фильтрация по ключевому слову (название)
    if (keyword && keyword.trim() !== '') {
      const keywordLower = keyword.toLowerCase();
      events = events.filter(e => e.name.toLowerCase().includes(keywordLower));
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
