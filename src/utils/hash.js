import jsSHA from "jssha";

export async function getImageHash(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const sha = new jsSHA("SHA-256", "ARRAYBUFFER");
      sha.update(e.target.result);
      resolve(sha.getHash("HEX"));
    };
    reader.onerror = () => reject("فشل في قراءة الصورة");
    reader.readAsArrayBuffer(file);
  });
}
