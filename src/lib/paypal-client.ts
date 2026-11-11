import type { PayPalTelemetryLog } from './types';
import { PayPalAgentToolkit } from '@paypal/agent-toolkit/ai-sdk';
export const telemetry: PayPalTelemetryLog[] = [];
const base = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';
let bearer: { token: string; expires: number } | null = null;
let mockCounter = 0;
export const isLivePayPal = () => Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
export async function getPayPalAccessToken(): Promise<string> {
  if (!isLivePayPal()) return 'MOCK_SANDBOX_ACCESS_TOKEN';
  if (bearer && bearer.expires > Date.now() + 30000) return bearer.token;
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${base}/v1/oauth2/token`, { method: 'POST', headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials', cache: 'no-store' });
  const data = await res.json();
  if (!res.ok) throw new Error(`PayPal OAuth failed (${res.status}): ${JSON.stringify(data)}`);
  bearer = { token: data.access_token as string, expires: Date.now() + Number(data.expires_in || 300) * 1000 };
  return bearer.token;
}
function mockResponse(method: string, path: string, body: unknown) {
  mockCounter += 1;
  const id = (prefix: string) => `${prefix}-${String(mockCounter).padStart(8, '0')}`;
  if (path.endsWith('/cancel')) return { status: 'CANCELLED', id: path.split('/').slice(-2)[0] };
  if (path.endsWith('/generate-qr-code')) return { qr_code: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j8ioAAAAASUVORK5CYII=' };
  if (path.endsWith('/refund')) return { id: id('REFUND'), status: 'COMPLETED', amount: (body as { amount?: unknown })?.amount };
  if (path.includes('/invoicing/invoices')) return { id: id('INV2'), status: 'DRAFT', href: 'https://www.sandbox.paypal.com/invoice/p/#mock', ...(body as object || {}) };
  if (path.includes('/catalogs/products')) return { id: id('PROD'), name: 'CuRemedy 0% Hardship Plan' };
  if (path.includes('/billing/plans')) return { id: id('P'), status: 'ACTIVE' };
  if (path.includes('/billing/subscriptions')) return { id: id('I'), status: 'APPROVAL_PENDING', links: [{ rel: 'approve', href: 'https://www.sandbox.paypal.com/webapps/billing/subscriptions?ba_token=MOCK' }] };
  return { id: id('MOCK'), status: method === 'POST' ? 'CREATED' : 'OK' };
}
export async function paypalRequest<T = Record<string, unknown>>(method: string, path: string, body?: unknown): Promise<T> {
  const requestId = crypto.randomUUID();
  const live = isLivePayPal();
  let status = 200; let response: unknown;
  try {
    if (!live) response = mockResponse(method, path, body);
    else {
      const token = await getPayPalAccessToken();
      const res = await fetch(`${base}${path}`, { method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(method === 'GET' ? {} : { 'PayPal-Request-Id': requestId, Prefer: 'return=representation' }) }, ...(body === undefined ? {} : { body: JSON.stringify(body) }), cache: 'no-store' });
      status = res.status;
      response = res.status === 204 ? {} : await res.json();
      if (!res.ok) throw new Error(`PayPal ${method} ${path} failed (${status}): ${JSON.stringify(response)}`);
    }
    telemetry.unshift({ id: requestId, timestamp: new Date().toISOString(), method, path, requestId, status, response, request: body, mode: live ? 'live' : 'mock' });
    return response as T;
  } catch (error) {
    telemetry.unshift({ id: requestId, timestamp: new Date().toISOString(), method, path, requestId, status: status || 500, response: { error: error instanceof Error ? error.message : String(error) }, request: body, mode: live ? 'live' : 'mock' });
    throw error;
  }
}
export function getPayPalAgentTools() {
  if (!isLivePayPal()) return [];
  const toolkit = new PayPalAgentToolkit({
    clientId: process.env.PAYPAL_CLIENT_ID!,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET!,
    configuration: {
      context: { sandbox: true },
      actions: {
        invoices: { create: true, send: true, cancel: true, generateQRC: true },
        products: { create: true },
        subscriptionPlans: { create: true, list: false, show: false }
      }
    }
  });
  return toolkit.getTools();
}
