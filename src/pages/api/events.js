try {
  const res = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json${query}`);
  console.log(`Request URL: https://app.ticketmaster.com/discovery/v2/events.json${query}`);
  if (!res.ok) {
    return new Response('Failed to fetch from Ticketmaster', { status: res.status });
  }

  const data = await res.json();
  console.log(`Total events from API: ${data.page?.totalElements || 0}`);
  
  let events = data._embedded?.events || [];
  console.log(`Events before filtering: ${events.length}`);

  // Фильтрация по городу
  if (city && city !== 'All') {
    events = events.filter(event => {
      const eventCity = event._embedded?.venues?.[0]?.city?.name || '';
      return eventCity.toLowerCase() === city.toLowerCase();
    });
    console.log(`Events after city filter (${city}): ${events.length}`);
  }

  // Фильтрация по жанру
  if (genre && genre !== 'All') {
    events = events.filter(event => {
      const segment = event.classifications?.[0]?.segment?.name || '';
      return segment.toLowerCase() === genre.toLowerCase();
    });
    console.log(`Events after genre filter (${genre}): ${events.length}`);
  }

  // Фильтрация по возрасту
  if (age === '18+') {
    events = events.filter(e => e.ageRestrictions?.legalAgeEnforced);
  } else if (age === 'All ages') {
    events = events.filter(e => !e.ageRestrictions?.legalAgeEnforced);
  }
  console.log(`Events after age filter (${age}): ${events.length}`);

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
