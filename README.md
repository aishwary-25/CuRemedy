# CuRemedy

Autonomous medical bill audit and payment hardship demo for the 2026 Build What's Next with PayPal and AI hackathon.

## Run locally

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The demo starts in deterministic mock mode. Add PayPal Sandbox credentials to `.env.local` to enable live Sandbox API calls. Optional Elasticsearch and OpenAI credentials enable those integrations.

Use the three buttons on the dashboard: seed the $1,850 invoice, audit its line items, and launch a settlement. The settlement route accepts `REVISED_INVOICE`, `HARDSHIP_SUBSCRIPTION`, or `INSTANT_REFUND`.

See [docs/JUDGES.md](docs/JUDGES.md) for the sponsor integration map. The fee schedule is an illustrative demo dataset and should be replaced with authoritative, current payer data before production use.
