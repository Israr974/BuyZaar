
export const calculateDiscountedPrice = (price, discountPercent) => {
  if (!price) return 0;
  if (!discountPercent || discountPercent === 0) return price;
  return price - (price * discountPercent / 100);
};

export const formatPrice = (price) => {
  return `₹${Math.round(price).toLocaleString()}`;
};

export const getProductPrice = (product) => {
  const originalPrice = product?.price || 0;
  const discount = product?.discount || 0;
  return calculateDiscountedPrice(originalPrice, discount);
};

export const getSavedAmount = (product) => {
  const originalPrice = product?.price || 0;
  const discountedPrice = getProductPrice(product);
  return originalPrice - discountedPrice;
};