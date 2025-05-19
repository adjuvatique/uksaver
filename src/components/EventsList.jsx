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

      console.log('Получено событий с API:', data._embedded?.events?.length || 0);

      let filtered = data._embedded?.events || [];

      // фильтры
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
