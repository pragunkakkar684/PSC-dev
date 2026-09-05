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
import { Search, FileText, Trash2, Copy, Check, Image as ImageIcon, Upload } from 'lucide-react';

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
          eyebrow="Administration"
          title="Media Library"
          description="Keep your content operations organized with a calm, focused workspace."
        />

        <div className="upload-zone">
          <Upload size={22} />
          <div>
            <strong>Drop files here to upload</strong>
            <span>or choose files from your computer · JPG, PNG, PDF up to 10 MB</span>
          </div>
          <select
            value={uploadFolder}
            onChange={(e) => setUploadFolder(e.target.value as CloudinaryFolder)}
            className="filter-button"
          >
            {Object.entries(CLOUDINARY_FOLDERS).map(([key, val]) => (
              <option key={key} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        <ImageUploadInput
          folder={uploadFolder}
          label="Choose files"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={() => loadData()}
        />

        <div className="toolbar">
          <div className="field-search">
            <Search size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media library"
            />
          </div>
          <select value={folder} onChange={(e) => setFolder(e.target.value)} className="filter-button">
            <option value="all">All folders</option>
            {Object.entries(CLOUDINARY_FOLDERS).map(([key, val]) => (
              <option key={key} value={val}>
                {val}
              </option>
            ))}
          </select>
          <select value={resourceType} onChange={(e) => setResourceType(e.target.value)} className="filter-button">
            <option value="all">All types</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
          </select>
          <span className="result-count">{files.length} assets</span>
        </div>

        {/* Media Grid */}
        {loading ? (
          <LoadingState message="Loading media assets..." />
        ) : files.length === 0 ? (
          <section className="panel empty-panel">
            <div className="empty-icon">
              <ImageIcon size={21} />
            </div>
            <h2>No media assets found</h2>
            <p>Upload a file above to add images or PDFs to the library.</p>
          </section>
        ) : (
          <div className="media-grid">
            {files.map((file, i) => (
              <div className="media-card" key={file.id}>
                <div className={`media-thumb thumb-${i % 3}`}>
                  {file.resourceType === 'image' ? (
                    <img src={file.url} alt={file.originalName || 'Media file'} />
                  ) : (
                    <FileText size={28} />
                  )}
                </div>
                <div>
                  <strong title={file.originalName || 'Untitled'}>{file.originalName || 'Untitled file'}</strong>
                  <small>
                    {file.folder?.replace('psc-global/', '') || 'Website assets'} · {formatSize(file.sizeBytes)}
                  </small>
                </div>
                <button type="button" onClick={() => copyToClipboard(file.url, file.id)} title="Copy URL">
                  {copiedId === file.id ? <Check size={14} /> : <Copy size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDeleteTarget({
                      id: file.id,
                      cloudinaryId: file.publicId,
                      type: file.resourceType as 'image' | 'document',
                    })
                  }
                  title="Delete file"
                  style={{ right: 32 }}
                >
                  <Trash2 size={14} />
                </button>
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
