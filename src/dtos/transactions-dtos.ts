export type TransactionDTO = {
  date: string;
  time: string;
  place: string;
  amount: number;
  type: "DR" | "CR";
  account: string;
  expense: "Yes" | "No" | "-";
  income: "Yes" | "No" | "-";
  irregularSpends?: "Yes" | null;
  category: string | null;
  tags: string | null;
  note: string | null;
};

export type SpendsGroupDTO = "EMI" | "Regular Spends" | "Irregular Spends";

export type SpendDTO = {
  name: string;
  spendsCount: number;
  totalAmount: number;
  percentage: number; // 0..100, rounded to 2 decimals
};

export type SpendCategoryGroupDTO = {
  group: "EMI" | "Regular Spends" | "Irregular Spends";
  totalAmount: number;   // same units as input (e.g. rupees)
  percentage: number;    // integer percentage (0 decimals) — sums to 100
};