'use client';
import { useState } from 'react';
import { Check, CircleDollarSign } from 'lucide-react';
import type { DisplayCurrency } from '@/lib/currency';
import { formatMoney } from '@/lib/currency';
export default function HardshipTimeline({ totalCents = 59000, currency = 'USD' }: { totalCents?: number; currency: DisplayCurrency }) {
  const [active, setActive] = useState(0);
  const installment = Math.floor(totalCents / 4);
  return <div className="timeline-wrap">
    <div className="timeline-title"><div><span className="eyebrow">0% APR · NO SETUP FEE</span><h3>Four-month hardship plan</h3></div><span className="autopay"><CircleDollarSign size={13}/> PAYPAL AUTO-DEBIT</span></div>
    <div className="timeline-track">{[0,1,2,3].map(i => <button key={i} className={`milestone ${active === i ? 'selected' : ''}`} onClick={() => setActive(i)}><span className="milestone-dot">{i < active ? <Check size={13}/> : i + 1}</span><span className="month">MONTH 0{i + 1}</span><strong>{formatMoney(i === 3 ? totalCents - installment * 3 : installment, currency)}</strong><small>{new Date(new Date().getFullYear(), new Date().getMonth() + i + 1, 1).toLocaleDateString(currency === 'INR' ? 'en-IN' : 'en-US', { month: 'short', day: 'numeric' })}</small></button>)}</div>
    <div className="timeline-bottom"><span><i/> Scheduled installment</span><b>4 × {formatMoney(installment, currency)} <small>· 0% interest</small></b></div>
  </div>;
}
