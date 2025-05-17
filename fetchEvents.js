import fetch from 'node-fetch';

const API_KEY = 'biPmMH1YGaNtNMOSYhfxt480OahSRcCr';

async function getEvents(city = 'London') {
  const url = new URL('https://app.ticketmaster.com/discovery/v2/events.json');

  url.searchParams.append('apikey', API_KEY);
  url.searchParams.append('countryCode', 'GB');
  url.searchParams.append('city', city);
  url.searchParams.append('size', '10');
  url.searchParams.append('sort', 'date,asc'); // сортировка по дате по возрастанию

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      const error = await response.json();
      console.error('API Error:', error);
      return;
    }

    const data = await response.json();
    if (data._embedded && data._embedded.events) {
      console.log(`Events in ${city}:`);
      data._embedded.events.forEach(event => {
        console.log(`- ${event.name} at ${event._embedded.venues[0].name} on ${event.dates.start.localDate}`);
      });
    } else {
      console.log(`No events found in ${city}`);
    }
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

getEvents();
