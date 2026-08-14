'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { AdminHeader } from '../components/AdminHeader';
import { PageHeader } from '../components/PageHeader';
import { DataTable, type Column } from '../components/DataTable';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingState } from '../components/LoadingState';
import {
  getEvents,
  deleteEventAction,
  toggleEventPublishAction,
  toggleEventFeaturedAction,
} from './actions';
import type { Event } from '@/lib/db/schema';
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, Calendar } from 'lucide-react';

export default function EventsListPage() {
  const [eventList, setEventList] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [eventType, setEventType] = useState('all');
  const [status, setStatus] = useState('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getEvents({ search, eventType, status });
      setEventList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, eventType, status]);

  const handleDelete = async () => {
    if (!deleteId) return;
    startTransition(async () => {
      await deleteEventAction(deleteId);
      setDeleteId(null);
      loadData();
    });
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleEventPublishAction(id, !currentStatus);
      loadData();
    });
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    startTransition(async () => {
      await toggleEventFeaturedAction(id, !currentFeatured);
      loadData();
    });
  };

  const columns: Column<Event>[] = [
    {
      header: 'Event Title',
      render: (e) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {e.imageUrl ? (
            <img
              src={e.imageUrl}
              alt={e.title}
              style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
            />
          ) : (
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                background: 'rgba(99,102,241,0.1)',
                color: '#a5b4fc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calendar size={20} />
            </div>
          )}
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{e.title}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/{e.slug}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Type',
      render: (e) => (
        <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', letterSpacing: '0.04em' }}>
          {e.eventType || 'EVENT'}
        </span>
      ),
    },
    {
      header: 'Date & Time',
      render: (e) => (
        <div>
          <div style={{ fontSize: '13px' }}>{e.date || 'TBD'}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{e.timeStart ? `${e.timeStart} ${e.timezone || ''}` : ''}</div>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (e) => (
        <StatusBadge status={e.status || 'upcoming'} />
      ),
    },
    {
      header: 'Featured',
      render: (e) => (
        <button
          type="button"
          onClick={() => handleToggleFeatured(e.id, e.isFeatured)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: e.isFeatured ? '#fbbf24' : 'var(--text-muted)' }}
          title={e.isFeatured ? 'Unmark Featured' : 'Mark Featured'}
        >
          <Star size={16} fill={e.isFeatured ? '#fbbf24' : 'none'} />
        </button>
      ),
    },
    {
      header: 'Published',
      render: (e) => (
        <StatusBadge status={e.isPublished ? 'published' : 'draft'} />
      ),
    },
    {
      header: 'Actions',
      width: '120px',
      render: (e) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleTogglePublish(e.id, e.isPublished)}
            title={e.isPublished ? 'Unpublish' : 'Publish'}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            {e.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          <Link
            href={`/admin/events/${e.id}`}
            style={{ color: '#60a5fa', display: 'inline-flex', padding: '4px' }}
            title="Edit"
          >
            <Edit2 size={16} />
          </Link>
          <button
            type="button"
            onClick={() => setDeleteId(e.id)}
            title="Delete"
            style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Events Management" />

      <div className="admin-content">
        <PageHeader
          title="Events & Webinars"
          description="Manage upcoming seminars, webinars, roundtables, agendas, and speakers."
          actions={
            <Link href="/admin/events/new" className="btn btn-primary">
              <Plus size={16} />
              <span>Create Event</span>
            </Link>
          }
        />

        {loading ? (
          <LoadingState message="Loading events..." />
        ) : (
          <DataTable
            columns={columns}
            data={eventList}
            searchQuery={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search events by title..."
            filterSlot={
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="form-input"
                  style={{ width: '150px', height: '38px', fontSize: '13px' }}
                >
                  <option value="all">All Types</option>
                  <option value="WEBINAR">Webinar</option>
                  <option value="SEMINAR">Seminar</option>
                  <option value="ROUNDTABLE">Roundtable</option>
                  <option value="CONFERENCE">Conference</option>
                </select>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-input"
                  style={{ width: '140px', height: '38px', fontSize: '13px' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            }
            emptyMessage="No events found."
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Event"
        message="Are you sure you want to delete this event? All associated agenda items and speaker links will be deleted."
        confirmText="Delete Event"
        isDanger
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
