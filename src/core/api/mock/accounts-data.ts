export interface AccountDTO {
  id: number;
  accountName: string;
  bankName: string;
  accountType: string;
  last4Digits: string;
  isActive: boolean;
}

export const accounts: AccountDTO[] = [
  {
    "id": 1,
    "accountName": "Axis  528587",
    "bankName": "Axis",
    "accountType": "debit",
    "last4Digits": "528587",
    "isActive": true
  },
  {
    "id": 2,
    "accountName": "Axis credit 2956",
    "bankName": "Axis",
    "accountType": "credit",
    "last4Digits": "2956",
    "isActive": true
  },
  {
    "id": 3,
    "accountName": "CASH Spends",
    "bankName": "CASH",
    "accountType": "debit",
    "last4Digits": "0000",
    "isActive": true
  },
  {
    "id": 4,
    "accountName": "HDFC  4671",
    "bankName": "HDFC",
    "accountType": "debit",
    "last4Digits": "4671",
    "isActive": true
  },
  {
    "id": 5,
    "accountName": "HDFC credit 2788",
    "bankName": "HDFC",
    "accountType": "credit",
    "last4Digits": "2788",
    "isActive": true
  },
  {
    "id": 6,
    "accountName": "HDFC credit 9603",
    "bankName": "HDFC",
    "accountType": "credit",
    "last4Digits": "9603",
    "isActive": true
  },
  {
    "id": 7,
    "accountName": "HSBC  4006",
    "bankName": "HSBC",
    "accountType": "debit",
    "last4Digits": "4006",
    "isActive": true
  },
  {
    "id": 8,
    "accountName": "HSBC  XXXX",
    "bankName": "HSBC",
    "accountType": "debit",
    "last4Digits": "XXXX",
    "isActive": true
  },
  {
    "id": 9,
    "accountName": "ICICI credit 0000",
    "bankName": "ICICI",
    "accountType": "credit",
    "last4Digits": "0000",
    "isActive": true
  },
  {
    "id": 10,
    "accountName": "IDFC  6145",
    "bankName": "IDFC",
    "accountType": "debit",
    "last4Digits": "6145",
    "isActive": true
  },
  {
    "id": 11,
    "accountName": "IDFC credit 6093",
    "bankName": "IDFC",
    "accountType": "credit",
    "last4Digits": "6093",
    "isActive": true
  },
  {
    "id": 12,
    "accountName": "IDFC credit 8696",
    "bankName": "IDFC",
    "accountType": "credit",
    "last4Digits": "8696",
    "isActive": true
  },
  {
    "id": 13,
    "accountName": "IDFC debit 6145",
    "bankName": "IDFC",
    "accountType": "debit",
    "last4Digits": "6145",
    "isActive": true
  }
];
