export const validateUrlConverter = (name) => {
  return name.toString().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};