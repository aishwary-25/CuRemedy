import { Client } from '@elastic/elasticsearch';
import { CMS_FEE_SCHEDULE } from './cms-fee-schedule';
let client: Client | null = null;
function elastic(): Client | null {
  if (!process.env.ELASTICSEARCH_URL) return null;
  if (!client) client = new Client({ node: process.env.ELASTICSEARCH_URL, ...(process.env.ELASTICSEARCH_API_KEY ? { auth: { apiKey: process.env.ELASTICSEARCH_API_KEY } } : {}) });
  return client;
}
export async function searchFeeSchedule(query: string) {
  const es = elastic();
  if (!es) return CMS_FEE_SCHEDULE.filter(x => `${x.code} ${x.description} ${x.citation}`.toLowerCase().includes(query.toLowerCase()));
  try {
    const result = await es.search({ index: 'cms-fee-schedule', query: { multi_match: { query, fields: ['code^3', 'description^2', 'citation'] } }, size: 10 });
    const hits = result.hits.hits.map(h => h._source).filter(Boolean) as typeof CMS_FEE_SCHEDULE;
    return hits.length ? hits : CMS_FEE_SCHEDULE.filter(x => `${x.code} ${x.description}`.toLowerCase().includes(query.toLowerCase()));
  } catch { return CMS_FEE_SCHEDULE.filter(x => `${x.code} ${x.description} ${x.citation}`.toLowerCase().includes(query.toLowerCase())); }
}
