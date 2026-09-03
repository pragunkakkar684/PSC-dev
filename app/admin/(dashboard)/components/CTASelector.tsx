'use client';

import { useState, useEffect } from 'react';
import { FormField } from './FormField';
import { ExternalLink, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface CTASelectorProps {
  label: string;
  textValue: string;
  urlValue: string;
  onChange: (text: string, url: string) => void;
  hint?: string;
}

const PRESET_ROUTES = [
  { label: 'Select Internal Route...', value: '' },
  { label: '/contact — Contact Us & Office Inquiry', value: '/contact' },
  { label: '/book-consultation — Schedule Advisory Consultation', value: '/book-consultation' },
  { label: '/about — About Firm & Operating Principles', value: '/about' },
  { label: '/team — Executive Leadership & Partners', value: '/team' },
  { label: '/practice-areas — Practice Areas Index', value: '/practice-areas' },
  { label: '/practice-areas#capabilities — Practice Areas Capabilities Grid', value: '/practice-areas#capabilities' },
  { label: '/practice-areas/risk-assurance — Risk & Assurance Detail', value: '/practice-areas/risk-assurance' },
  { label: '/practice-areas/tax-fiscal-advisory — Tax & Fiscal Advisory Detail', value: '/practice-areas/tax-fiscal-advisory' },
  { label: '/practice-areas/corporate-law — Corporate Law Detail', value: '/practice-areas/corporate-law' },
  { label: '/practice-areas/business-advisory — Business Advisory Detail', value: '/practice-areas/business-advisory' },
  { label: '/practice-areas/business-process-advisory — Business Process Detail', value: '/practice-areas/business-process-advisory' },
  { label: '/industries — Sector Verticals Index', value: '/industries' },
  { label: '/insights — Publications & Regulatory Updates', value: '/insights' },
  { label: '/events — Executive Webinars & Briefings', value: '/events' },
  { label: '/gcc — Global Capability Center Advisory', value: '/gcc' },
  { label: '/partner — Global Partner Network', value: '/partner' },
  { label: '/career — Careers & Job Positions', value: '/career' },
];

export function CTASelector({ label, textValue, urlValue, onChange, hint }: CTASelectorProps) {
  const [text, setText] = useState(textValue || '');
  const [url, setUrl] = useState(urlValue || '');
  const [preset, setPreset] = useState(urlValue || '');

  useEffect(() => {
    setText(textValue || '');
    setUrl(urlValue || '');
    setPreset(urlValue || '');
  }, [textValue, urlValue]);

  const handleTextChange = (newText: string) => {
    setText(newText);
    onChange(newText, url);
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setPreset(newUrl);
    onChange(text, newUrl);
  };

  const handlePresetSelect = (selectedUrl: string) => {
    if (!selectedUrl) return;
    setUrl(selectedUrl);
    setPreset(selectedUrl);
    onChange(text, selectedUrl);
  };

  const isHashFallback = url.trim() === '#' || url.trim() === '/#';
  const isEmptyUrl = text.trim().length > 0 && !url.trim();

  return (
    <div style={{ background: '#020617', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', display: 'grid', gap: '12px' }}>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{label}</span>
        {isHashFallback || isEmptyUrl ? (
          <span style={{ fontSize: '11px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={12} /> Invalid Link Target
          </span>
        ) : (
          <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> Valid Destination
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <FormField label="CTA Button Text" hint="Text shown on the button">
          <input
            type="text"
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            className="admin-input"
            placeholder="e.g. Explore Our Expertise"
          />
        </FormField>

        <FormField label="Quick Route Selector" hint="Select a verified public route">
          <select
            value={preset}
            onChange={(e) => handlePresetSelect(e.target.value)}
            className="admin-input"
          >
            {PRESET_ROUTES.map((r) => (
              <option key={r.value || 'default'} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label="Destination Target URL" hint={hint || 'Must be a valid internal route (e.g. /contact) or external URL. Never use "#"'}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="admin-input"
            style={{
              borderColor: isHashFallback || isEmptyUrl ? '#ef4444' : undefined,
              flex: 1,
            }}
            placeholder="e.g. /practice-areas#capabilities"
          />
          {url && !isHashFallback && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="admin-button secondary"
              style={{ padding: '8px 12px', fontSize: '12px' }}
              title="Test Destination Link"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </FormField>

      {isHashFallback && (
        <div style={{ fontSize: '12px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px' }}>
          ⚠ <strong>Validation Error:</strong> &quot;<code>#</code>&quot; is not an acceptable CTA destination. Please select a valid route above.
        </div>
      )}
    </div>
  );
}
