import { SpendCategoryGroupDTO, SpendDTO, SpendsGroupDTO, TransactionDTO } from "dtos/transactions-dtos";

type Aggregate = {
  spendsCount: number;
  totalAmount: number;
};

function hasTokenExact(csv: string | null | undefined, token: string): boolean {
  // Fast path
  if (!csv) return false;

  // We want exact token matches in a comma-separated list,
  // ignoring surrounding whitespace. We'll scan characters without splitting.
  const t = token;
  const n = csv.length;
  let i = 0;

  while (i < n) {
    // skip whitespace
    while (i < n && (csv[i] === " " || csv[i] === "\t")) i++;

    // start of token
    let start = i;
    while (i < n && csv[i] !== ",") i++;
    let end = i; // [start, end) is a token (may contain whitespace)
    // trim end whitespace
    while (end > start && (csv[end - 1] === " " || csv[end - 1] === "\t")) end--;

    // if lengths match, quick compare
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

    // skip comma
    i++;
  }

  return false;
}

/**
 * Highly optimized categoriseSpends for large data sets.
 *
 * @param trans - array of TransactionDTO
 * @param includeGroups - optional list of groups to include; if omitted or empty, include all groups
 * @param sort - whether to sort result by totalAmount desc (default true)
 */
export const categoriseSpends = (
  trans: TransactionDTO[],
  includeGroups?: SpendsGroupDTO[],
  sort: boolean = true
): SpendDTO[] => {
  const includeAll = !Array.isArray(includeGroups) || includeGroups.length === 0;
  const includeSet = includeAll ? null : new Set(includeGroups);

  // Map categoryString -> Aggregate
  const map = new Map<string, Aggregate>();

  // Running overall total of included spends (avoid a second pass)
  let overallTotal = 0;

  for (let i = 0, L = trans.length; i < L; i++) {
    const t = trans[i];

    // cheap filters first
    if (t.type !== "DR" || t.expense !== "Yes") continue;

    // Determine group: EMI if category/tags contain exact token "EMI"
    // else IrregularSpends if irregularSpends === "Yes", else RegularSpends
    // Use hasTokenExact to avoid allocations
    const isEmi =
      hasTokenExact(t.category, "EMI") || hasTokenExact(t.tags, "EMI");

    const group: SpendsGroupDTO = isEmi
      ? "EMI"
      : t.irregularSpends === "Yes"
      ? "Irregular Spends"
      : "Regular Spends";

    if (!includeAll && !includeSet!.has(group)) continue;

    const spendName = t.category ?? "UNCATEGORIZED";

    // fast aggregate via Map
    const agg = map.get(spendName);
    if (agg) {
      agg.spendsCount += 1;
      agg.totalAmount += t.amount;
    } else {
      map.set(spendName, { spendsCount: 1, totalAmount: t.amount });
    }

    overallTotal += t.amount;
  }

  // Build final array
  const result: SpendDTO[] = new Array(map.size);
  let idx = 0;
  // Avoid toFixed in loop; compute percentage with math rounding
  for (const [name, agg] of map) {
    const pct =
      overallTotal > 0
        ? Math.round((agg.totalAmount / overallTotal) * 10000) / 100 // two decimals
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

export const groupSpendsCategory = (trans: TransactionDTO[]): SpendCategoryGroupDTO[] => {
  // Use numeric indexes instead of string keys to reduce property lookups.
  // 0 = EMI, 1 = Regular, 2 = Irregular
  const totals = [0, 0, 0];

  // Single tight loop, minimal property reads
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

  // Prepare result skeleton
  const res: SpendCategoryGroupDTO[] = [
    { group: "EMI", totalAmount: totals[0], percentage: 0 },
    { group: "Regular Spends", totalAmount: totals[1], percentage: 0 },
    { group: "Irregular Spends", totalAmount: totals[2], percentage: 0 },
  ];

  if (overall > 0) {
    // compute integer percentages
    res[0].percentage = Math.round((totals[0] / overall) * 100);
    res[1].percentage = Math.round((totals[1] / overall) * 100);
    res[2].percentage = Math.round((totals[2] / overall) * 100);

    // fix rounding drift (add leftover to largest amount group)
    const sumPerc = res[0].percentage + res[1].percentage + res[2].percentage;
    const drift = 100 - sumPerc;
    if (drift !== 0) {
      // find index of largest totals
      let maxIdx = 0;
      if (totals[1] > totals[maxIdx]) maxIdx = 1;
      if (totals[2] > totals[maxIdx]) maxIdx = 2;
      res[maxIdx].percentage += drift;
    }
  }

  return res;
};
