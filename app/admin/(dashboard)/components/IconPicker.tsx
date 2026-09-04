'use client';

import {
  Briefcase,
  Building2,
  Clock,
  FileText,
  Globe,
  Landmark,
  Mail,
  MessageSquare,
  Scale,
  Share2,
  Shield,
  ShieldCheck,
  Sparkles,
  Tags,
  TrendingUp,
  UserRound,
  Users,
  Check,
} from 'lucide-react';
import type { ElementType } from 'react';

export const ALLOWED_ICONS: Record<string, ElementType> = {
  Landmark,
  Scale,
  Shield,
  ShieldCheck,
  TrendingUp,
  Share2,
  Globe,
  Users,
  Briefcase,
  FileText,
  Sparkles,
  Clock,
  Building2,
  UserRound,
  Mail,
  Tags,
  MessageSquare,
};

interface IconPickerProps {
  value?: string | null;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const selectedName = value && ALLOWED_ICONS[value] ? value : '';

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
      {Object.entries(ALLOWED_ICONS).map(([name, IconComponent]) => {
        const isSelected = selectedName === name;
        return (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            title={name}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '6px 10px',
              borderRadius: '6px',
              border: isSelected ? '1px solid var(--accent, #c59b27)' : '1px solid var(--border, rgba(255,255,255,0.08))',
              background: isSelected ? 'rgba(197, 155, 39, 0.12)' : 'var(--bg-input, #0f1118)',
              color: isSelected ? '#ffffff' : 'var(--text-secondary, #9ca3af)',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.15s ease',
            }}
          >
            <IconComponent size={16} />
            <span>{name}</span>
            {isSelected && <Check size={12} />}
          </button>
        );
      })}
    </div>
  );
}
