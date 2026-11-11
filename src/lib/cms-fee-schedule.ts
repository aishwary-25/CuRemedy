export interface FeeEntry { code: string; description: string; fairCents: number; billedCents: number; citation: string; status: 'FAIR' | 'UPCODED' | 'UNBUNDLED' | 'EXTREME_MARKUP'; }
export const CMS_FEE_SCHEDULE: FeeEntry[] = [
 {code:'99214',description:'Established patient office visit, moderate complexity',fairCents:18500,billedCents:62000,citation:'CMS Physician Fee Schedule 2026; E/M documentation guidelines',status:'UPCODED'},
 {code:'80053',description:'Comprehensive metabolic panel',fairCents:3500,billedCents:18400,citation:'CMS Clinical Laboratory Fee Schedule 2026',status:'EXTREME_MARKUP'},
 {code:'29881',description:'Knee arthroscopy with meniscectomy',fairCents:36500,billedCents:78200,citation:'CMS PFS 2026; NCCI Policy Manual, Chapter IV',status:'UNBUNDLED'},
 {code:'A4550',description:'Surgical trays',fairCents:500,billedCents:12800,citation:'CMS HCPCS; NCCI edits: supplies integral to procedure',status:'UNBUNDLED'},
 {code:'36415',description:'Collection of venous blood by venipuncture',fairCents:500,billedCents:26400,citation:'CMS Clinical Laboratory Fee Schedule 2026',status:'EXTREME_MARKUP'},
 {code:'71046',description:'Chest X-ray, 2 views',fairCents:2500,billedCents:11900,citation:'CMS PFS 2026; modifier 26/TC component guidance',status:'EXTREME_MARKUP'},
 {code:'93000',description:'Electrocardiogram, complete',fairCents:1800,billedCents:9300,citation:'CMS PFS 2026; NCCI mutually exclusive services',status:'EXTREME_MARKUP'},
 {code:'J2405',description:'Ondansetron hydrochloride, per 1 mg',fairCents:400,billedCents:5100,citation:'CMS ASP Drug Pricing; NCCI units-of-service edits',status:'EXTREME_MARKUP'},
 {code:'85025',description:'Complete blood count with automated differential',fairCents:1100,billedCents:9200,citation:'CMS Clinical Laboratory Fee Schedule 2026',status:'EXTREME_MARKUP'},
 {code:'81001',description:'Urinalysis, automated with microscopy',fairCents:800,billedCents:6400,citation:'CMS Clinical Laboratory Fee Schedule 2026',status:'EXTREME_MARKUP'},
 {code:'99285',description:'Emergency department visit, high severity',fairCents:8500,billedCents:32000,citation:'CMS PFS 2026; E/M level must reflect documented MDM',status:'UPCODED'},
 {code:'96372',description:'Therapeutic injection, subcutaneous or intramuscular',fairCents:1600,billedCents:13700,citation:'CMS PFS 2026; NCCI edits for separately reported drug administration',status:'UNBUNDLED'}
];
export const findFee = (code: string) => CMS_FEE_SCHEDULE.find(x => x.code === code);
