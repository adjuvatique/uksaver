import React from 'react';

export default function Header({
  city,
  setCity,
  freeFilter,
  setFreeFilter,
  genreFilter,
  setGenreFilter,
  ageFilter,
  setAgeFilter,
  theme,
  toggleTheme,
}) {
  const CITIES = [
    'All',
    'London',
    'Manchester',
    'Birmingham',
    'Glasgow',
    'Leeds',
    'Belfast',
    'Dublin',
    'Edinburgh',
    'Cardiff',
  ];
  const FREE_FILTERS = ['All Events', 'Free Only', 'Paid Only'];
  const GENRES = ['All', 'Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous'];
  const AGES = ['All ages', '18+'];

  return (
    <header className="flex flex-col items-center gap-4 mb-8">
      <div className="flex items-center gap-3 mb-2">
        <img src="/logo.svg" alt="UKSaver logo" className="w-10 h-10" />
        <h1 className="text-white text-2xl font-bold select-none">UKSaver — Events Finder</h1>
        <button
          onClick={toggleTheme}
          className="ml-4 px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 transition"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <select
          className="bg-purple-700 text-white rounded px-4 py-2 min-w-[140px]"
          value={city}
          onChange={e => setCity(e.target.value)}
        >
          {CITIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="bg-purple-700 text-white rounded px-4 py-2 min-w-[140px]"
          value={freeFilter}
          onChange={e => setFreeFilter(e.target.value)}
        >
          {FREE_FILTERS.map(f => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="bg-purple-700 text-white rounded px-4 py-2 min-w-[140px]"
          value={genreFilter}
          onChange={e => setGenreFilter(e.target.value)}
        >
          {GENRES.map(g => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          className="bg-purple-700 text-white rounded px-4 py-2 min-w-[140px]"
          value={ageFilter}
          onChange={e => setAgeFilter(e.target.value)}
        >
          {AGES.map(a => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => {
          setCity('All');
          setFreeFilter('All Events');
          setGenreFilter('All');
          setAgeFilter('All ages');
        }}
        className="mt-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded shadow"
      >
        Reset Filters
      </button>
    </header>
  );
}
