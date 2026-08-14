'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, CheckCircle2, FileText } from 'lucide-react';
import type { CloudinaryFolder } from '@/lib/constants/cloudinary';

interface ImageUploadInputProps {
  value?: string | null;
  onChange: (url: string) => void;
  folder?: CloudinaryFolder;
  label?: string;
  accept?: string;
  isDocument?: boolean;
}

export function ImageUploadInput({
  value,
  onChange,
  folder = 'psc-global/pages',
  label = 'Upload Image',
  accept = 'image/jpeg,image/png,image/webp',
  isDocument = false,
}: ImageUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: 'none' }}
      />

      {value ? (
        <div
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 12px',
            background: 'var(--bg-base, #111318)',
            border: '1px solid var(--border, rgba(255,255,255,0.1))',
            borderRadius: '8px',
          }}
        >
          {!isDocument ? (
            <img
              src={value}
              alt="Preview"
              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
            />
          ) : (
            <div
              style={{
                width: '48px',
                height: '48px',
                background: 'rgba(59,130,246,0.1)',
                color: '#60a5fa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px',
              }}
            >
              <FileText size={24} />
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> Uploaded
            </div>
            <div
              style={{
                fontSize: '11px',
                color: 'var(--text-muted, #475569)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '220px',
              }}
            >
              {value}
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              background: 'none',
              border: 'none',
              color: '#60a5fa',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Change
          </button>

          <button
            type="button"
            onClick={() => onChange('')}
            title="Remove"
            style={{
              background: 'none',
              border: 'none',
              color: '#f87171',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn btn-secondary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center',
            padding: '12px 16px',
            borderStyle: 'dashed',
          }}
        >
          {uploading ? (
            <>
              <Loader2 size={16} className="spin" />
              <span>Uploading to Cloudinary...</span>
            </>
          ) : (
            <>
              <Upload size={16} />
              <span>{label}</span>
            </>
          )}
        </button>
      )}

      {error && (
        <span style={{ fontSize: '12px', color: '#f87171', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
}
