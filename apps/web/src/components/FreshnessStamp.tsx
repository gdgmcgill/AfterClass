import { zineMono } from '@/lib/fonts';
import type { Freshness } from '@/lib/freshness';

type FreshnessStampProps = {
  freshness: Freshness;
  className?: string; // lets each screen position the stamp
};

// The tilted rubber stamp. Used on the place card and the place page.
export function FreshnessStamp({ freshness, className = '' }: FreshnessStampProps) {
  const base = `${zineMono.className} inline-block -rotate-[8deg] border-[3px] bg-[#070D1C] px-2.5 py-1.5 text-[13px] font-bold uppercase ${className}`;

  if (freshness === 'verified') {
    return <div className={`${base} border-solid border-[#F3EEE3]`}>✓ Verified</div>;
  }
  return <div className={`${base} border-dashed border-[#F7C25A] text-[#F7C25A]`}>! Stale</div>;
}