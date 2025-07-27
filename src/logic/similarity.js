/**
 * similarity.js
 * وظائف المقارنة الذكية بين الصور تشمل تشابه المادة وتشابه التجزئة (hash)
 * مخصص للعمل داخل متصفح كروم في مشروع Rqeeb
 */

// ✅ دالة احتساب نسبة تطابق التجزئة بين صورتين
export function calculateSimilarity(hash1, hash2) {
  const minLength = Math.min(hash1.length, hash2.length);
  let differences = 0;
  for (let i = 0; i < minLength; i++) {
    if (hash1[i] !== hash2[i]) differences++;
  }
  return Math.round(((minLength - differences) / minLength) * 100);
}

/**
 * ✅ دالة تقييم تشابه المادة بين منطقتي الصورة (يسار ويمين)
 * تعتمد على تحليل السطوع والاختلاف النسيجي (فرق بين الأحمر والأزرق)
 * @param {HTMLCanvasElement} canvasA - الجزء الأول من الصورة (يسار)
 * @param {HTMLCanvasElement} canvasB - الجزء الثاني من الصورة (يمين)
 * @returns {number} نسبة التشابه بين المادة (0 إلى 100)
 */
export function evaluateMaterialMatch(canvasA, canvasB) {
  const ctxA = canvasA.getContext('2d');
  const ctxB = canvasB.getContext('2d');

  const dataA = ctxA.getImageData(0, 0, canvasA.width, canvasA.height).data;
  const dataB = ctxB.getImageData(0, 0, canvasB.width, canvasB.height).data;

  let brightnessDiff = 0;
  let textureDiff = 0;

  for (let i = 0; i < dataA.length; i += 4) {
    const avgA = (dataA[i] + dataA[i+1] + dataA[i+2]) / 3;
    const avgB = (dataB[i] + dataB[i+1] + dataB[i+2]) / 3;

    brightnessDiff += Math.abs(avgA - avgB);

    const textureA = Math.abs(dataA[i] - dataA[i+2]); // فرق الأحمر - الأزرق
    const textureB = Math.abs(dataB[i] - dataB[i+2]);

    textureDiff += Math.abs(textureA - textureB);
  }

  const totalPixels = dataA.length / 4;
  const brightnessScore = 100 - Math.min(brightnessDiff / totalPixels, 100);
  const textureScore = 100 - Math.min((textureDiff / totalPixels) * 2, 100);
  const materialMatch = Math.round((brightnessScore + textureScore) / 2);

  return materialMatch;
}
