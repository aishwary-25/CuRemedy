import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { findFee } from '@/lib/cms-fee-schedule';
import { searchFeeSchedule } from '@/lib/elastic-client';
import type { AuditReport, CPTLineItem } from '@/lib/types';
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = Array.isArray(body.lineItems) ? body.lineItems : [];
    const items: CPTLineItem[] = await Promise.all(input.map(async (raw: { code?: string; billedCents?: number }) => {
      const code = String(raw.code || '');
      const result = findFee(code) || (await searchFeeSchedule(code))[0];
      if (!result) return { code, description: 'Unmatched billing code', billedCents: Math.max(0, Number(raw.billedCents) || 0), fairCents: 0, savingsCents: 0, status: 'FAIR', citation: 'No matching CMS reference found' };
      const billedCents = Math.max(0, Number(raw.billedCents ?? result.billedCents));
      return { code, description: result.description, billedCents, fairCents: result.fairCents, savingsCents: Math.max(0, billedCents - result.fairCents), status: result.status, citation: result.citation };
    }));
    const sum = (key: 'billedCents' | 'fairCents' | 'savingsCents') => items.reduce((total, item) => total + item[key], 0);
    const report: AuditReport = { lineItems: items, originalTotalCents: sum('billedCents'), fairTotalCents: sum('fairCents'), patientSavingsCents: sum('savingsCents'), auditedAt: new Date().toISOString() };
    let aiReview: string | null = null;
    if (process.env.OPENAI_API_KEY && items.length) {
      try {
        const result = await generateText({ model: openai('gpt-4o-mini'), prompt: `Review this medical billing audit for concise, neutral patient-facing context. Do not make a legal or coverage determination. Use only the supplied findings and say they are estimates. Findings: ${JSON.stringify(items.map(({ code, status, billedCents, fairCents, citation }) => ({ code, status, billedCents, fairCents, citation })))}. Savings estimate: ${report.patientSavingsCents} cents.` });
        aiReview = result.text;
      } catch { aiReview = 'Optional AI review was unavailable; deterministic fee schedule results are shown.'; }
    }
    return NextResponse.json({ report, aiReview, enrichment: process.env.OPENAI_API_KEY ? 'openai' : 'local-only' });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Audit failed' }, { status: 400 }); }
}
