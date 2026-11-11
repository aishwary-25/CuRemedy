export type AuditStatus = 'FAIR' | 'UPCODED' | 'UNBUNDLED' | 'EXTREME_MARKUP';
export interface CPTLineItem { code: string; description: string; billedCents: number; fairCents: number; savingsCents: number; status: AuditStatus; citation: string; }
export interface AuditReport { lineItems: CPTLineItem[]; originalTotalCents: number; fairTotalCents: number; patientSavingsCents: number; auditedAt: string; }
export interface PayPalTelemetryLog { id: string; timestamp: string; method: string; path: string; requestId: string; status: number; response: unknown; request?: unknown; mode: 'live' | 'mock'; }
export interface SettlementResponse { mode: 'REVISED_INVOICE' | 'HARDSHIP_SUBSCRIPTION' | 'INSTANT_REFUND'; originalInvoiceId: string; resources: Record<string, unknown>; telemetry: PayPalTelemetryLog[]; }
