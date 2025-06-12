import React, { useState, useEffect } from 'react';

function Header({
  city, setCity,
  freeFilter, setFreeFilter,
  genreFilter, setGenreFilter,
  ageFilter, setAgeFilter,
  onResetFilters
}) {
  const CITIES = [
    'All', 'London', 'Manchester', 'Birmingham', 'Glasgow',
    'Leeds', 'Belfast', 'Dublin', 'Edinburgh', 'Cardiff',
  ];
  const FREE_FILTERS = ['All Events', 'Free Only', 'Paid Only'];
  const GENRES = ['All', 'Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous'];
  const AGES = ['All ages', '18+'];

  return (
    <header className="flex flex-col items-center gap-4 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <img src="/logo.svg" alt="UKSaver logo" className="w-10 h-10" />
        <h1 className="text-white text-2xl font-bold select-none">
          UKSaver — Events Finder
        </h1>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <select
          className="bg-purple-700 text-white rounded px-4 py-2 min-w-[140px]"
          value={city}
          onChange={e => setCity(e.target.value)}
        >
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          className="bg-purple-700 text-white rounded px-4 py-2 min-w-[140px]"
          value={freeFilter}
          onChange={e => setFreeFilter(e.target.value)}
        >
          {FREE_FILTERS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <select
          className="bg-purple-700 text-white rounded px-4 py-2 min-w-[140px]"
          value={genreFilter}
          onChange={e => setGenreFilter(e.target.value)}
        >
          {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
        </select>

        <select
          className="bg-purple-700 text-white rounded px-4 py-2 min-w-[140px]"
          value={ageFilter}
          onChange={e => setAgeFilter(e.target.value)}
        >
          {AGES.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <button
        onClick={onResetFilters}
        className="mt-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded shadow"
      >
        Reset Filters
      </button>
    </header>
  );
}

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
        className="border p-2 rounded flex-grow text-black"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Найти
      </button>
    </form>
  );
}

export default function EventsList() {
  const [city, setCity] = useState('All');
  const [freeFilter, setFreeFilter] = useState('All Events');
  const [genreFilter, setGenreFilter] = useState('All');
  const [ageFilter, setAgeFilter] = useState('All ages');

  const [searchQuery, setSearchQuery] = useState('');

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (searchQuery) params.append('search', searchQuery);
      if (city && city !== 'All') params.append('city', city);
      if (freeFilter && freeFilter !== 'All Events') params.append('freeFilter', freeFilter);
      if (genreFilter && genreFilter !== 'All') params.append('genre', genreFilter);
      if (ageFilter && ageFilter !== 'All ages') params.append('age', ageFilter);

      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch events');

      const data = await res.json();
      setEvents(data.events || []);
    } catch (e) {
      setError(e.message);
      setEvents([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [city, freeFilter, genreFilter, ageFilter, searchQuery]);

  const handleResetFilters = () => {
    setCity('All');
    setFreeFilter('All Events');
    setGenreFilter('All');
    setAgeFilter('All ages');
    setSearchQuery('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      <SearchForm onSearch={setSearchQuery} />
      <Header
        city={city} setCity={setCity}
        freeFilter={freeFilter} setFreeFilter={setFreeFilter}
        genreFilter={genreFilter} setGenreFilter={setGenreFilter}
        ageFilter={ageFilter} setAgeFilter={setAgeFilter}
        onResetFilters={handleResetFilters}
      />

      <p className="text-center text-purple-300 mb-4">
        Showing {events.length} event{events.length !== 1 ? 's' : ''}
      </p>

      {loading && <p className="text-center text-purple-300">Loading events...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && events.length === 0 && !error && (
        <p className="text-center text-purple-300">No events found for selected filters.</p>
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
