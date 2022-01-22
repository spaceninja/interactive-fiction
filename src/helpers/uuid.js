/**
 * Generate UUID
 * @see https://stackoverflow.com/a/62359248
 * @returns string
 */
export const uuid = () => {
  const url = URL.createObjectURL(new Blob());
  const [id] = url.toString().split('/').reverse();
  URL.revokeObjectURL(url);
  return id;
};
