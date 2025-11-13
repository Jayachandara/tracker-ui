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

export type SpendsGroupDTO = "EMI" | "RegularSpends" | "IrregularSpends";

export type SpendDTO = {
  name: string;
  spendsCount: number;
  totalAmount: number;
  percentage: number; // 0..100, rounded to 2 decimals
};