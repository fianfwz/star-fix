export const formatCurrency = (value, lkuId) => {
  const n = Number(value || 0);
  if (lkuId === '02') {
    return `$${n.toLocaleString('en-US')}`;
  }
  return `Rp${n.toLocaleString('id-ID')}`;
};
