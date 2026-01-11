export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2
  }).format(price)
}

export const formatPriceDH = (price) => {
  return `${parseFloat(price).toFixed(2)} DH`
}
