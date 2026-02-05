export const formatINR = (value) => {
  return (value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
};
