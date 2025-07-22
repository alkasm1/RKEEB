export function calculateSimilarity(hash1, hash2) {
  const minLength = Math.min(hash1.length, hash2.length);
  let diff = 0;
  for (let i = 0; i < minLength; i++) {
    if (hash1[i] !== hash2[i]) diff++;
  }
  return Math.round(((minLength - diff) / minLength) * 100);
}
