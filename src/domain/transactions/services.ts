import { TransactionDTO, SpendsGroupDTO, SpendDTO, SpendCategoryGroupDTO } from './types';

/**
 * Transaction business logic utilities
 * 
 * For data fetching and mutations, use RTK Query hooks from 'core/api/transactions.api':
 * - useGetTransactionsQuery
 * - useGetTransactionByIdQuery
 * - useGetTransactionStatsQuery
 * - useCreateTransactionMutation
 * - useUpdateTransactionMutation
 * - useDeleteTransactionMutation
 * - useBulkDeleteTransactionsMutation
 */

// ============ Transaction helper functions ============

function hasTokenExact(csv: string | null | undefined, token: string): boolean {
  if (!csv) return false;

  const t = token;
  const n = csv.length;
  let i = 0;

  while (i < n) {
    while (i < n && (csv[i] === " " || csv[i] === "\t")) i++;
    let start = i;
    while (i < n && csv[i] !== ",") i++;
    let end = i;
    while (end > start && (csv[end - 1] === " " || csv[end - 1] === "\t")) end--;

    if ((end - start) === t.length) {
      let match = true;
      for (let k = 0; k < t.length; k++) {
        if (csv[start + k] !== t[k]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }

    i++;
  }

  return false;
}

/**
 * Categorise spends from transactions
 */
export const categoriseSpends = (
  trans: TransactionDTO[],
  includeGroups?: SpendsGroupDTO[],
  sort: boolean = true
): SpendDTO[] => {
  const includeAll = !Array.isArray(includeGroups) || includeGroups.length === 0;
  const includeSet = includeAll ? null : new Set(includeGroups);

  type Aggregate = {
    spendsCount: number;
    totalAmount: number;
  };

  const map = new Map<string, Aggregate>();
  let overallTotal = 0;

  for (let i = 0, L = trans.length; i < L; i++) {
    const t = trans[i];

    if (t.type !== "DR" || t.expense !== "Yes") continue;

    const isEmi = hasTokenExact(t.category, "EMI") || hasTokenExact(t.tags, "EMI");

    const group: SpendsGroupDTO = isEmi
      ? "EMI"
      : t.irregularSpends === "Yes"
      ? "Irregular Spends"
      : "Regular Spends";

    if (!includeAll && !includeSet!.has(group)) continue;

    const spendName = t.category ?? "UNCATEGORIZED";

    const agg = map.get(spendName);
    if (agg) {
      agg.spendsCount += 1;
      agg.totalAmount += t.amount;
    } else {
      map.set(spendName, { spendsCount: 1, totalAmount: t.amount });
    }

    overallTotal += t.amount;
  }

  const result: SpendDTO[] = new Array(map.size);
  let idx = 0;
  for (const [name, agg] of map) {
    const pct = overallTotal > 0
      ? Math.round((agg.totalAmount / overallTotal) * 10000) / 100
      : 0;
    result[idx++] = {
      name,
      spendsCount: agg.spendsCount,
      totalAmount: agg.totalAmount,
      percentage: pct,
    };
  }

  if (sort && result.length > 1) {
    result.sort((a, b) => b.totalAmount - a.totalAmount);
  }

  return result;
};

/**
 * Group spends by category
 */
export const groupSpendsCategory = (trans: TransactionDTO[]): SpendCategoryGroupDTO[] => {
  const totals = [0, 0, 0];

  for (let i = 0, L = trans.length; i < L; i++) {
    const t = trans[i];
    if (t.type !== "DR" || t.expense !== "Yes") continue;

    const amt = t.amount || 0;
    if (t.category === "EMI") {
      totals[0] += amt;
    } else if (t.irregularSpends === "Yes") {
      totals[2] += amt;
    } else {
      totals[1] += amt;
    }
  }

  const overall = totals[0] + totals[1] + totals[2];

  const res: SpendCategoryGroupDTO[] = [
    { group: "EMI", totalAmount: totals[0], percentage: 0 },
    { group: "Regular Spends", totalAmount: totals[1], percentage: 0 },
    { group: "Irregular Spends", totalAmount: totals[2], percentage: 0 },
  ];

  if (overall > 0) {
    res[0].percentage = Math.round((totals[0] / overall) * 100);
    res[1].percentage = Math.round((totals[1] / overall) * 100);
    res[2].percentage = Math.round((totals[2] / overall) * 100);

    const sumPerc = res[0].percentage + res[1].percentage + res[2].percentage;
    const drift = 100 - sumPerc;
    if (drift !== 0) {
      let maxIdx = 0;
      if (totals[1] > totals[maxIdx]) maxIdx = 1;
      if (totals[2] > totals[maxIdx]) maxIdx = 2;
      res[maxIdx].percentage += drift;
    }
  }

  return res;
};
