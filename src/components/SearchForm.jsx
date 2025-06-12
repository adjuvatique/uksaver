import React, { useState } from 'react';

export default function SearchForm({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
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
