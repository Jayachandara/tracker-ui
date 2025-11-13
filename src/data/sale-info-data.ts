import avgRevenue from 'assets/sale-info/avg-revenue.png';
import customers from 'assets/sale-info/customers.png';
import sales from 'assets/sale-info/sales.png';

interface SaleInfoData {
  id: number;
  image: string;
  title: string;
  sales: number;
  increment: number;
  date: string;
}

export const saleInfoData: SaleInfoData[] = [
  {
    id: 1,
    image: sales,
    title: 'Total Income',
    sales: 17000,
    increment: 55,
    date: 'May 2022',
  },
  {
    id: 2,
    image: customers,
    title: 'Total Expenses',
    sales: 100000,
    increment: 12,
    date: 'May 2022',
  },
  {
    id: 3,
    image: avgRevenue,
    title: 'Total Balance',
    sales: 2300,
    increment: 210,
    date: 'May 2022',
  },
];
