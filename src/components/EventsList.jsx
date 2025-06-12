import React, { useState, useEffect } from 'react';

function SearchForm({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Введите продукт"
        className="border p-2 rounded flex-grow"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Найти
      </button>
    </form>
  );
}

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const url = query
          ? `/api/events?search=${encodeURIComponent(query)}`
          : `/api/events`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        setError(err.message);
        setEvents([]);
      }
      setLoading(false);
    }

    fetchEvents();
  }, [query]);

  return (
    <div className="max-w-4xl mx-auto text-white p-4">
      <SearchForm onSearch={setQuery} />

      {loading && <p className="text-center text-purple-300">Загрузка событий...</p>}
      {error && <p className="text-center text-red-500">Ошибка: {error}</p>}
      {!loading && events.length === 0 && (
        <p className="text-center text-purple-300">События не найдены.</p>
      )}

      <ul className="divide-y divide-purple-700 rounded-lg overflow-hidden shadow-lg bg-purple-900">
        {events.map(event => (
          <li
            key={event.id}
            className="flex flex-col gap-2 px-6 py-4 hover:bg-purple-700 transition rounded"
          >
            <div className="flex items-center gap-4">
              {event.images?.[0]?.url ? (
                <img
                  src={event.images[0].url}
                  alt={event.name}
                  className="w-24 h-14 object-cover rounded-md flex-shrink-0"
                  loading="lazy"
                />
              ) : (
                <div className="w-24 h-14 bg-purple-700 rounded-md flex-shrink-0 flex items-center justify-center text-sm text-purple-300">
                  No Image
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-white text-xl font-semibold">{event.name}</h3>
                <p className="text-purple-300 text-sm">
                  {event.dates?.start?.localDate} at {event.dates?.start?.localTime} |{' '}
                  {event._embedded?.venues?.[0]?.name || 'Unknown venue'}
                </p>
                <p className="mt-1 text-sm text-purple-300">
                  Genre: {event.classifications?.[0]?.segment?.name || 'N/A'} | Age:{' '}
                  {event.ageRestrictions?.legalAgeEnforced ? '18+' : 'All ages'} | Status:{' '}
                  {event.dates?.status?.code || 'unknown'} |{' '}
                  <span
                    className={
                      event.priceRanges?.some(p => p.min === 0) ? 'font-semibold' : ''
                    }
                  >
                    {event.priceRanges?.some(p => p.min === 0) ? 'Free' : 'Paid'}
                  </span>
                </p>
                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 px-3 py-1 bg-pink-600 hover:bg-pink-700 rounded text-white font-semibold text-sm whitespace-nowrap"
                >
                  Buy Tickets
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
