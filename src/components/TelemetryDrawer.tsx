'use client';
import { useState } from 'react';
import type { PayPalTelemetryLog } from '@/lib/types';
export default function TelemetryDrawer({ logs }: { logs: PayPalTelemetryLog[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return <div className="telemetry-list">{logs.length === 0 && <div className="empty-log">Run a demo step to inspect PayPal request telemetry.</div>}{logs.map(log => <div className="log-item" key={log.id}><button className="log-head" onClick={() => setOpen(open === log.id ? null : log.id)}><span className="method">{log.method}</span><span className="log-path">{log.path}</span><span className="log-status">{log.status}</span><span className={`mode ${log.mode}`}>{log.mode}</span><span className="chevron">{open === log.id ? '−' : '+'}</span></button>{open === log.id && <div className="log-detail"><div className="request-id"><span>PayPal-Request-Id</span><code>{log.requestId}</code></div><pre>{JSON.stringify({ request: log.request, response: log.response }, null, 2)}</pre></div>}</div>)}</div>;
}
