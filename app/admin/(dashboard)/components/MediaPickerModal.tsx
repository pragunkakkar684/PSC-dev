'use client';

import { useState, useEffect } from 'react';
import { ImageUploadInput } from './ImageUploadInput';
import { X, Check, Image as ImageIcon, Search, Plus } from 'lucide-react';
import type { CloudinaryFolder } from '@/lib/constants/cloudinary';

interface MediaFile {
  id: number;
  url: string;
  originalName: string | null;
  folder: string | null;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  folder?: CloudinaryFolder;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelectImage,
  folder = 'psc-global/pages',
}: MediaPickerModalProps) {
  const [images, setImages] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [uploadMode, setUploadMode] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/upload');
      if (res.ok) {
        const data = await res.json();
        setImages(data.files || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredImages = images.filter((img) =>
    (img.originalName || img.url).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'var(--bg-surface, #0f172a)',
          border: '1px solid var(--border, #1e293b)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '850px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border, #1e293b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ImageIcon size={20} className="text-sky-400" />
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary, #f8fafc)', margin: 0 }}>
              Cloudinary Media Library Picker
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Toolbar */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border, #1e293b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search media library..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input"
              style={{ paddingLeft: '36px', width: '100%' }}
            />
          </div>

          <button
            onClick={() => setUploadMode(!uploadMode)}
            className="admin-button secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}
          >
            <Plus size={16} />
            {uploadMode ? 'View Existing Media' : 'Upload New Image'}
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {uploadMode ? (
            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
              <ImageUploadInput
                label="Upload Image to Cloudinary"
                folder={folder}
                value=""
                onChange={(url) => {
                  if (url) {
                    onSelectImage(url);
                    onClose();
                  }
                }}
              />
            </div>
          ) : loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              Loading media library from Cloudinary...
            </div>
          ) : filteredImages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              No images found. Upload a new image to get started.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '16px',
              }}
            >
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => {
                    onSelectImage(img.url);
                    onClose();
                  }}
                  style={{
                    border: '1px solid var(--border, #334155)',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    background: '#020617',
                    position: 'relative',
                    aspectRatio: '4/3',
                    transition: 'transform 0.2s, border-color 0.2s',
                  }}
                  className="group hover:border-sky-500 hover:scale-105"
                >
                  <img
                    src={img.url}
                    alt={img.originalName || 'Media'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(56, 189, 248, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                    }}
                    className="group-hover:opacity-100"
                  >
                    <Check size={24} color="#ffffff" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
