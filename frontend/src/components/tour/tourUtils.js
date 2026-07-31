export const formatPrice = (price) => {
  if (price === undefined || price === null) return "Custom";
  return `₹${Number(price).toLocaleString("en-IN")}`;
};
export const getStartingPrice = (price, discountPrice) => {
  if (discountPrice && Number(discountPrice) > 0) return formatPrice(discountPrice);
  return formatPrice(price);
};
export const getPriceBadge = (price, discountPrice) => {
  const p = Number(price) || 0;
  const dp = Number(discountPrice) || 0;
  if (!p) return "Custom quote";
  if (dp > 0) return `₹${dp.toLocaleString("en-IN")} - ₹${p.toLocaleString("en-IN")}`;
  return `From ₹${p.toLocaleString("en-IN")}`;
};
export const getSavings = (price, discountPrice) => {
  const p = Number(price) || 0;
  const dp = Number(discountPrice) || 0;
  if (p > 0 && dp > 0 && dp < p) {
    const saved = p - dp;
    const percent = Math.round((saved / p) * 100);
    return { amount: saved, percent };
  }
  return null;
};

export const getImageSrc = (image) => {
  if (!image) return "https://placehold.co/1200x600?text=No+Image";
  if (typeof image === "object" && image?.url) return image.url;
  if (typeof image === "string" && (image.startsWith("http") || image.startsWith("data:"))) return image;
  return "https://placehold.co/1200x600?text=No+Image";
};

export const normalizePriceRange = (value = "") =>
  value
    .replaceAll("ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¹", "₹")
    .replaceAll("Ã¢â€šÂ¹", "₹")
    .replaceAll("â‚¹", "₹")
    .replace(/\s+/g, " ")
    .trim();