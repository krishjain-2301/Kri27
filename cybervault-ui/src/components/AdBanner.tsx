'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Google AdSense ad unit.
 * Requires NEXT_PUBLIC_ADSENSE_ID env var.
 * The adsbygoogle.js script is loaded in layout.tsx.
 */
export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    try {
      // Push to AdSense ad queue
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  if (!publisherId) {
    // In development without AdSense ID, show a placeholder
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className={`flex items-center justify-center bg-[#0c0c0e] border border-dashed border-[#2a2a35] rounded-xl text-gray-600 text-xs font-mono ${className}`}>
          Ad Slot: {slot}
        </div>
      );
    }
    return null;
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={publisherId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
