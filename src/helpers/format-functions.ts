export const currencyFormat = (amount: number, options: Intl.NumberFormatOptions = {}) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'inr',
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
    useGrouping: true,
    notation: 'standard',
    ...options,
  }).format(amount);
};
