export const generateUniqueId = (): number => {
  return Date.now() + Math.random() * 10000;
};
