// Simulated "CSV data feeds" parsed into typed structures.
// In a real deployment these arrive as streamed CSV; here we ship raw CSV
// strings and parse them so charts render straight from the feed.

export const collectionVelocityCSV = `month,collected,projected
Apr,18500000,20000000
May,22400000,23000000
Jun,31200000,30000000
Jul,27800000,29000000
Aug,34600000,33000000
Sep,41200000,39000000
Oct,38900000,42000000
Nov,47300000,45000000
Dec,52800000,50000000
Jan,49100000,52000000
Feb,58400000,56000000
Mar,64200000,60000000`

export const defaultDistributionCSV = `bucket,students,amount
0-15 days,412,4200000
16-30 days,238,3100000
31-60 days,129,2450000
61-90 days,64,1780000
90+ days,37,1240000`

export const feeAdoptionCSV = `quarter,tuition,transport,hostel,activity
Q1,3200,1850,940,2100
Q2,3680,2010,1080,2640
Q3,4120,2280,1190,3050
Q4,4560,2510,1310,3480`

export type CSVRow = Record<string, string | number>

/** Minimal CSV parser: first row is the header, numeric cells are coerced. */
export function parseCSV(csv: string): CSVRow[] {
  const [head, ...lines] = csv.trim().split('\n')
  const headers = head.split(',').map((h) => h.trim())
  return lines.map((line) => {
    const cells = line.split(',')
    const row: CSVRow = {}
    headers.forEach((h, i) => {
      const raw = cells[i]?.trim() ?? ''
      const num = Number(raw)
      row[h] = raw !== '' && !Number.isNaN(num) ? num : raw
    })
    return row
  })
}

export const liveTelemetry = [
  { label: 'Settlement latency', value: '312 ms', trend: '-8%' },
  { label: 'Collections today', value: '₹2.4 Cr', trend: '+14%' },
  { label: 'Active mandates', value: '18,412', trend: '+3%' },
  { label: 'Ledger writes / min', value: '1,286', trend: '+21%' },
  { label: 'Reconciliation', value: '99.98%', trend: '+0.2%' },
  { label: 'Waivers staged', value: '46', trend: '+5' },
  { label: 'UPI success rate', value: '99.4%', trend: '+0.6%' },
  { label: 'Nodes healthy', value: '24 / 24', trend: 'stable' },
]

export const principalMetrics = [
  { label: 'Total collected (FY)', value: 486200000, delta: '+18.4%', hint: 'vs last fiscal year' },
  { label: 'Outstanding dues', value: 12770000, delta: '-6.1%', hint: 'across 880 students' },
  { label: 'Waivers granted', value: 8400000, delta: '+2.3%', hint: 'RTE + merit + staff' },
  { label: 'Net settled', value: 473430000, delta: '+19.0%', hint: 'reconciled to bank' },
]

export type LedgerEntry = {
  id: string
  ts: string
  type: string
  student: string
  amount: number
  hash: string
  prev: string
}

export const ledgerEntries: LedgerEntry[] = [
  {
    id: 'BLK-004182',
    ts: '2026-07-28 09:41:12',
    type: 'FEE_COLLECTION',
    student: 'Ananya Sharma · VIII-B',
    amount: 42500,
    hash: '0x9f3ac71b8e42d0c5a1f6',
    prev: '0x71cd0928',
  },
  {
    id: 'BLK-004181',
    ts: '2026-07-28 09:38:55',
    type: 'WAIVER_APPLIED',
    student: 'Rohit Verma · X-A',
    amount: -12000,
    hash: '0x71cd09284fba33e7902d',
    prev: '0x4ab2f110',
  },
  {
    id: 'BLK-004180',
    ts: '2026-07-28 09:35:02',
    type: 'FEE_COLLECTION',
    student: 'Meera Iyer · VI-C',
    amount: 38200,
    hash: '0x4ab2f110cc78d1e6b435',
    prev: '0x2f9911ad',
  },
  {
    id: 'BLK-004179',
    ts: '2026-07-28 09:29:47',
    type: 'REFUND_ISSUED',
    student: 'Kabir Nair · XI-Sci',
    amount: -8600,
    hash: '0x2f9911ad55e0a2c7f018',
    prev: '0x0c47ba39',
  },
  {
    id: 'BLK-004178',
    ts: '2026-07-28 09:22:19',
    type: 'FEE_COLLECTION',
    student: 'Diya Menon · IV-A',
    amount: 29750,
    hash: '0x0c47ba3971fd88a3e2b1',
    prev: '0xf13c7720',
  },
  {
    id: 'BLK-004177',
    ts: '2026-07-28 09:15:33',
    type: 'FEE_COLLECTION',
    student: 'Arjun Reddy · IX-B',
    amount: 45100,
    hash: '0xf13c77201aa9de40c88f',
    prev: '0x8821dd0e',
  },
]

export type CheckerItem = {
  id: string
  title: string
  detail: string
  maker: string
  impact: number
  stagedHash: string
}

export const initialCheckerQueue: CheckerItem[] = [
  {
    id: 'RULE-7741',
    title: 'Transport slab — Route 12 revision',
    detail: 'Distance tier 8-12km increased to ₹1,850 / term',
    maker: 'A. Deshpande (Accounts)',
    impact: 1240000,
    stagedHash: '0xstg_a71f…9c22',
  },
  {
    id: 'WVR-3390',
    title: 'RTE waiver batch — Grade V',
    detail: '24 students · full tuition waiver under RTE Sec.12',
    maker: 'S. Krishnan (Admin)',
    impact: -2880000,
    stagedHash: '0xstg_4b0e…12df',
  },
  {
    id: 'RULE-7742',
    title: 'Sibling concession policy',
    detail: '2nd child: 10% tuition, 3rd child: 20% tuition',
    maker: 'A. Deshpande (Accounts)',
    impact: -640000,
    stagedHash: '0xstg_9de1…77a4',
  },
]

export type FeeItem = {
  id: string
  head: string
  category: string
  amount: number
  due: string
  status: 'due' | 'paid' | 'partial'
}

export const studentFees: FeeItem[] = [
  { id: 'F1', head: 'Tuition Fee — Term II', category: 'Academic', amount: 42000, due: '10 Aug 2026', status: 'due' },
  { id: 'F2', head: 'Transport — Route 12', category: 'Logistics', amount: 11500, due: '10 Aug 2026', status: 'due' },
  { id: 'F3', head: 'Laboratory & Materials', category: 'Academic', amount: 6800, due: '10 Aug 2026', status: 'due' },
  { id: 'F4', head: 'Activity & Sports', category: 'Co-curricular', amount: 4500, due: '10 Aug 2026', status: 'due' },
  { id: 'F5', head: 'Examination Fee', category: 'Academic', amount: 3200, due: '10 Aug 2026', status: 'due' },
  { id: 'F6', head: 'Tuition Fee — Term I', category: 'Academic', amount: 42000, due: '10 Apr 2026', status: 'paid' },
]
