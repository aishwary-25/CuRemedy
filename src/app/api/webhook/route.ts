import { NextRequest, NextResponse } from 'next/server';
import { paypalRequest } from '@/lib/paypal-client';
const supported = new Set(['INVOICING.INVOICE.PAID', 'INVOICING.INVOICE.CANCELLED', 'BILLING.SUBSCRIPTION.ACTIVATED']);
export async function POST(req: NextRequest) {
  const event = await req.json();
  const eventType = String(event.event_type || '');
  if (!supported.has(eventType)) return NextResponse.json({ received: true, handled: false, eventType });
  if (process.env.PAYPAL_WEBHOOK_ID) {
    const cert = req.headers.get('paypal-cert-url');
    const transmissionId = req.headers.get('paypal-transmission-id');
    const transmissionSig = req.headers.get('paypal-transmission-sig');
    const transmissionTime = req.headers.get('paypal-transmission-time');
    if (!cert || !transmissionId || !transmissionSig || !transmissionTime) return NextResponse.json({ error: 'Missing PayPal webhook signature headers' }, { status: 401 });
    try {
      const verification = await paypalRequest<{ verification_status?: string }>('POST', '/v1/notifications/verify-webhook-signature', {
        auth_algo: req.headers.get('paypal-auth-algo'), cert_url: cert, transmission_id: transmissionId,
        transmission_sig: transmissionSig, transmission_time: transmissionTime,
        webhook_id: process.env.PAYPAL_WEBHOOK_ID, webhook_event: event
      });
      if (verification.verification_status !== 'SUCCESS') return NextResponse.json({ error: 'PayPal webhook signature verification failed' }, { status: 401 });
    } catch { return NextResponse.json({ error: 'PayPal webhook signature verification failed' }, { status: 401 }); }
  }
  return NextResponse.json({ received: true, handled: true, eventType, resourceId: event.resource?.id || null, occurredAt: event.create_time || new Date().toISOString() });
}
