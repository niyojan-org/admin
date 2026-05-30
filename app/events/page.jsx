'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { toast } from 'sonner';
import EventsHeader from './components/EventsHeader';
import EventsFiltersBar from './components/EventsFiltersBar';
import EventsSkeleton from './components/EventsSkeleton';
import EventsGrid from './components/EventsGrid';
import EventsEmptyState from './components/EventsEmptyState';
import EventsPagination from './components/EventsPagination';

const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
  totalItems: 0,
  totalPages: 1,
  hasPrevPage: false,
  hasNextPage: false,
  prevPage: null,
  nextPage: null,
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState({
    page: '1',
    limit: '10',
    status: 'all',
    isPublished: 'all',
    search: '',
  });
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((prev) => ({
        ...prev,
        page: '1',
        search: searchInput.trim(),
      }));
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {
          page: query.page,
          limit: query.limit,
          ...(query.status !== 'all' ? { status: query.status } : {}),
          ...(query.isPublished !== 'all' ? { isPublished: query.isPublished } : {}),
          ...(query.search ? { search: query.search } : {}),
        };

        const { data } = await api.get('/events/admin', { params });

        setEvents(data?.events || []);
        setPagination(data?.pagination || DEFAULT_PAGINATION);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [query]);

  const hasActiveFilters = Boolean(query.search) || query.status !== 'all' || query.isPublished !== 'all';

  const handlePageChange = (nextPage) => {
    setQuery((prev) => ({ ...prev, page: String(nextPage) }));
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setQuery((prev) => ({
      ...prev,
      page: '1',
      status: 'all',
      isPublished: 'all',
      search: '',
    }));
  };

  if (loading) {
    return <EventsSkeleton />;
  }

  const publishedCount = events.filter((event) => event.status === 'published').length;
  const draftCount = events.filter((event) => event.status === 'draft').length;
  const seatsOnPage = events.reduce((total, event) => {
    if (!event.tickets?.length) return total;
    return total + event.tickets.reduce((ticketTotal, ticket) => ticketTotal + (ticket.capacity || 0), 0);
  }, 0);

  return (
    <div className="space-y-5 h-full">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <EventsHeader
          totalEvents={pagination.totalItems || events.length}
          pageCount={events.length}
          publishedCount={publishedCount}
          draftCount={draftCount}
          seatsOnPage={seatsOnPage}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="space-y-5"
      >
        <EventsFiltersBar
          searchQuery={searchInput}
          onSearchQueryChange={setSearchInput}
          status={query.status}
          onStatusChange={(value) => setQuery((prev) => ({ ...prev, page: '1', status: value }))}
          isPublished={query.isPublished}
          onPublishedChange={(value) => setQuery((prev) => ({ ...prev, page: '1', isPublished: value }))}
          limit={query.limit}
          onLimitChange={(value) => setQuery((prev) => ({ ...prev, page: '1', limit: value }))}
          onReset={handleResetFilters}
          isLoading={loading}
        />

        {events.length > 0 ? <EventsGrid events={events} /> : <EventsEmptyState hasFilters={hasActiveFilters} />}

        <EventsPagination pagination={pagination} onPageChange={handlePageChange} isDisabled={loading} />
      </motion.div>
    </div>
  );
}
