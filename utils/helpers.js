export const getTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-'); // e.g. 2025-06-07T13-45-30-123Z
}