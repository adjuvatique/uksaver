import React, { useState, useEffect } from 'react';
import Header from './Header';

export default function EventsList() {
  const [city, setCity] = useState('All');
  const [freeFilter, setFreeFilter] = useState('All Events');
  const [genreFilter, setGenreFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState('All ages');

  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const PAGE_SIZE = 8;

  // Сбрасываем при смене фильтров
  useEffect(() => {
    setEvents([]);
    setPage(0);
    setHasMore(true);
  }, [city, freeFilter, genreFilter, ageFilter]);

  // Загрузка событий с сервера
  useEffect(() => {
    async function fetchEvents() {
      if (!hasMore && page !== 0) return;

      setLoading(true);

      let url = `/api/events?page=${page}&size=${PAGE_SIZE}`;
      if (city !== 'All') url += `&city=${encodeURIComponent(city)}`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();

        const fetchedEvents = data._embedded?.events || [];

        let filtered = fetchedEvents;

        if (freeFilter === 'Free Only') {
          filtered = filtered.filter(e => e.priceRanges?.some(p => p.min === 0));
        } else if (freeFilter === 'Paid Only') {
          filtered = filtered.filter(e => !e.priceRanges?.some(p => p.min === 0));
        }

        if (genreFilter !== 'All') {
          filtered = filtered.filter(e =>
            e.classifications?.some(c => c.segment?.name === genreFilter)
          );
        }

        if (ageFilter === '18+') {
          filtered = filtered.filter(e => e.ageRestrictions?.legalAgeEnforced);
        }

        setEvents(prev => (page === 0 ? filtered : [...prev, ...filtered]));
        setHasMore(filtered.length === PAGE_SIZE);
      } catch (err) {
        console.error(err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [city, freeFilter, genreFilter, ageFilter, page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-purple-500 p-8 text-white">
      <Header
        city={city} setCity={setCity}
        freeFilter={freeFilter} setFreeFilter={setFreeFilter}
        genreFilter={genreFilter} setGenreFilter={setGenreFilter}
        ageFilter={ageFilter} setAgeFilter={setAgeFilter}
      />

      <ul className="space-y-4 max-w-4xl mx-auto">
        {events.length === 0 && !loading && (
          <p className="text-center">No events found.</p>
        )}

        {events.map(event => (
          <li key={event.id} className="bg-purple-800 rounded p-4 flex gap-4 shadow hover:shadow-lg transition-shadow duration-300">
            {event.images?.[0]?.url && (
              <img
                src={event.images[0].url}
                alt={event.name}
                className="w-24 h-24 object-cover rounded"
                loading="lazy"
              />
            )}
            <div className="flex-1">
              <h3 className="font-bold text-lg">{event.name}</h3>
              <p className="text-sm">
                {event.dates?.start?.localDate} at {event.dates?.start?.localTime} | {event._embedded?.venues?.[0]?.name || 'Unknown venue'}
              </p>
              <p className="mt-2 text-xs text-gray-300">
                Genre: {event.classifications?.[0]?.segment?.name || 'N/A'} | Age: {event.ageRestrictions?.legalAgeEnforced ? '18+' : 'All ages'} | Status: {event.dates?.status?.code || 'unknown'} |{' '}
                <span className={event.priceRanges?.some(p => p.min === 0) ? 'font-semibold' : ''}>
                  {event.priceRanges?.some(p => p.min === 0) ? 'Free' : 'Paid'}
                </span>
              </p>
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-1 text-sm rounded bg-pink-600 hover:bg-pink-700 transition-colors"
              >
                Buy Tickets
              </a>
            </div>
          </li>
        ))}
      </ul>

      {loading && (
        <p className="text-center mt-4">Loading...</p>
      )}

      {hasMore && !loading && (
        <div className="text-center mt-6">
          <button
            onClick={() => setPage(p => p + 1)}
            className="px-6 py-2 rounded bg-purple-600 hover:bg-purple-700 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
