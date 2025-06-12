import React, { useState, useEffect } from 'react';
import SearchForm from './SearchForm';

export default function EventsList() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm) {
      setEvents([]);
      return;
    }

    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/events?search=${encodeURIComponent(searchTerm)}`);
        if (!res.ok) throw new Error('Ошибка загрузки событий');
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        setError(err.message);
        setEvents([]);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [searchTerm]);

  return (
    <div>
      <SearchForm onSearch={setSearchTerm} />

      {loading && <p className="text-center text-white mt-4">Загрузка...</p>}
      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {!loading && events.length === 0 && searchTerm && (
        <p className="text-center text-white mt-4">События не найдены</p>
      )}

      <ul className="mt-6 space-y-4 max-w-4xl mx-auto">
        {events.map(event => (
          <li key={event.id} className="bg-purple-800 rounded p-4 shadow">
            <h3 className="font-bold text-lg text-white">{event.name}</h3>
            {/* Здесь можно расширить отображение */}
          </li>
        ))}
      </ul>
    </div>
  );
}
