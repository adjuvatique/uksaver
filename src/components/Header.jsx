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
        <h1
          className={`text-2xl font-bold select-none ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          UKSaver — Events Finder
        </h1>

        <button
          onClick={toggleTheme}
          className="ml-4 px-3 py-1 rounded border border-gray-300 hover:bg-gray-300 hover:text-gray-800 transition"
          aria-label="Toggle theme"
          title="Toggle light/dark theme"
        >
          {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <select
          className="bg-purple-700 text-white rounded px-4 py-2 min-w-[140px] transition duration-300 ease-in-out hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
          className="bg-purple-700 text-white rounded px-4 py-2 min-w-[140px] transition duration-300 ease-in-out hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
          className="bg-purple-700 text-white rounded px-4 py-2 min-w-[140px] transition duration-300 ease-in-out hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
          className="bg-purple-700 text-white rounded px-4 py-2 min-w-[140px] transition duration-300 ease-in-out hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
        className="mt-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded shadow transition transform hover:scale-105 active:scale-95"
      >
        Reset Filters
      </button>
    </header>
  );
}
