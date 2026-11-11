# Judge walkthrough

CuRemedy demonstrates medical invoice review paired with PayPal Sandbox settlement options. Start with `npm install` and `npm run dev`; no keys are needed for the deterministic mock demonstration. Configure `.env.local` from `.env.example` to switch the PayPal adapter to Sandbox REST requests.

## Three-click demo

1. Seed a $1,850.00 sample invoice (four line items).
2. Audit its CPT/HCPCS lines against the bundled fee schedule, with optional Elasticsearch matching and OpenAI enrichment when configured.
3. Choose a revised invoice, 0% hardship subscription, or deposit refund. The interface exposes PayPal request IDs, status, and JSON responses.

## Sponsor integration map

- PayPal: invoicing create/send/cancel/QR endpoints; catalog product, billing plan, subscription, and capture refund operations. Mock mode keeps the UI usable without credentials.
- AG Grid: sortable and filterable CPT audit grid with variance, status and citation.
- Elastic: keyword CMS fee schedule search with a local twelve-code dataset fallback.
- Bryntum-style timeline: four monthly milestones plus dispute SLA windows, implemented without a proprietary runtime dependency.
- APIMatic context and Postman v2.1 collection: API workflow artifacts in the repository.
- Render: root `render.yaml` deploy blueprint.

## Notes

Fee schedule values and citations in this demo are illustrative reference data, not a coverage determination or legal advice. Live PayPal access requires a Sandbox application and a configured webhook ID/verification implementation before handling real webhook events.
