'use client';

import { useState, useEffect, useTransition } from 'react';
import { AdminHeader } from '../components/AdminHeader';
import { PageHeader } from '../components/PageHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { LoadingState } from '../components/LoadingState';
import { ImageUploadInput } from '../components/ImageUploadInput';
import { getMediaFiles, deleteMediaFileAction } from './actions';
import type { MediaFile } from '@/lib/db/schema';
import { CLOUDINARY_FOLDERS, type CloudinaryFolder } from '@/lib/constants/cloudinary';
import { Search, FileText, Trash2, Copy, Check, Filter, Image as ImageIcon } from 'lucide-react';

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [folder, setFolder] = useState('all');
  const [resourceType, setResourceType] = useState('all');
  const [uploadFolder, setUploadFolder] = useState<CloudinaryFolder>('psc-global/pages');
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; cloudinaryId: string; type: 'image' | 'document' } | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getMediaFiles({ search, folder, resourceType });
      setFiles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, folder, resourceType]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await deleteMediaFileAction(deleteTarget.id, deleteTarget.cloudinaryId, deleteTarget.type);
        setDeleteTarget(null);
        loadData();
      } catch (err) {
        console.error(err);
      }
    });
  };

  const copyToClipboard = (url: string, id: number) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <>
      <AdminHeader title="Media Library" />

      <div className="admin-content">
        <PageHeader
          title="Cloudinary Media Library"
          description="Upload and manage firm images, headshots, covers, and research PDFs stored securely in Cloudinary."
        />

        {/* Upload Box Container */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>Upload New File to Cloudinary</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Files will be validated, uploaded to Cloudinary, and registered in the media database.</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Destination Folder:</span>
              <select
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value as CloudinaryFolder)}
                className="form-input"
                style={{ width: '180px', height: '36px', fontSize: '12px' }}
              >
                {Object.entries(CLOUDINARY_FOLDERS).map(([key, val]) => (
                  <option key={key} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ImageUploadInput
            folder={uploadFolder}
            label="Click or Drop File to Upload to Cloudinary (Images or PDFs)"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={() => loadData()}
          />
        </div>

        {/* Filter Controls Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files by name..."
                className="form-input"
                style={{ paddingLeft: '34px', height: '38px', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} style={{ color: 'var(--text-muted)' }} />
              <select
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="form-input"
                style={{ width: '180px', height: '38px', fontSize: '13px' }}
              >
                <option value="all">All Folders</option>
                {Object.entries(CLOUDINARY_FOLDERS).map(([key, val]) => (
                  <option key={key} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="form-input"
              style={{ width: '140px', height: '38px', fontSize: '13px' }}
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="document">Documents (PDFs)</option>
            </select>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Showing {files.length} file{files.length === 1 ? '' : 's'}
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <LoadingState message="Loading media assets..." />
        ) : files.length === 0 ? (
          <div style={{ padding: '60px 24px', textAlign: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-muted)' }}>
            <ImageIcon size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
            <h4 style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '4px' }}>No media assets found</h4>
            <p style={{ fontSize: '13px' }}>Upload a file above to add images or PDFs to the Cloudinary library.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {files.map((file) => (
              <div
                key={file.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s, border-color 0.15s',
                }}
              >
                {/* Thumbnail */}
                <div style={{ height: '140px', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  {file.resourceType === 'image' ? (
                    <img
                      src={file.url}
                      alt={file.originalName || 'Media file'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#60a5fa' }}>
                      <FileText size={40} />
                      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>PDF DOCUMENT</span>
                    </div>
                  )}

                  <span
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(0,0,0,0.65)',
                      color: 'white',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {file.folder?.replace('psc-global/', '')}
                  </span>
                </div>

                {/* File info */}
                <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div
                      title={file.originalName || 'Untitled'}
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginBottom: '4px',
                      }}
                    >
                      {file.originalName || 'Untitled file'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{formatSize(file.sizeBytes)}</span>
                      <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(file.url, file.id)}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '6px 8px', fontSize: '11px', justifyContent: 'center' }}
                    >
                      {copiedId === file.id ? (
                        <>
                          <Check size={12} style={{ color: '#34d399' }} />
                          <span style={{ color: '#34d399' }}>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ id: file.id, cloudinaryId: file.publicId, type: file.resourceType as any })}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        background: 'rgba(239,68,68,0.1)',
                        color: '#f87171',
                        border: '1px solid rgba(239,68,68,0.2)',
                        cursor: 'pointer',
                      }}
                      title="Delete file"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Media File"
        message="Are you sure you want to delete this file from Cloudinary and the database? Any published pages referencing this URL will show a broken image or missing file."
        confirmText="Delete File"
        isDanger
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
