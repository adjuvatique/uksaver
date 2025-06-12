import React, { useState } from 'react';

export default function SearchForm() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Пример данных, потом заменим на реальный API вызов
    // Можно сделать fetch к API с searchQuery, чтобы получить реальные результаты
    setResults([
      `Скидка на ${searchQuery} - товар 1`,
      `Скидка на ${searchQuery} - товар 2`,
      `Скидка на ${searchQuery} - товар 3`,
    ]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6 max-w-md mx-auto">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Введите продукт"
        className="flex-grow p-2 rounded border border-gray-300"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Найти
      </button>

      {results.length > 0 && (
        <ul className="mt-4 bg-white text-black rounded p-4 w-full max-w-md mx-auto shadow-lg">
          {results.map((item, index) => (
            <li key={index} className="border-b last:border-none py-1">
              {item}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
