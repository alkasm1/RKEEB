import { useState } from "react";
import { getImageHash } from "../utils/hash.js";
import { calculateSimilarity } from "../utils/similarity.js";

function CaptureZone() {
  const [originalHash, setOriginalHash] = useState(null);
  const [matchPercent, setMatchPercent] = useState(null);
  const [feedback, setFeedback] = useState("");

  const handleOriginal = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const hash = await getImageHash(file);
      setOriginalHash(hash);
      setFeedback("✅ تم تسجيل الأصل بنجاح");
    }
  };

  const handleVerify = async (e) => {
    const file = e.target.files[0];
    if (!file || !originalHash) return;

    const hash = await getImageHash(file);
    const percent = calculateSimilarity(originalHash, hash);
    setMatchPercent(percent);

    if (percent >= 90) setFeedback(`✅ تطابق بنسبة ${percent}%`);
    else if (percent >= 70) setFeedback(`⚠️ تطابق متوسط (${percent}%)`);
    else setFeedback(`❌ احتمال تزوير (${percent}%)`);
  };

  return (
    <div style={{ textAlign: "center", padding: "1rem" }}>
      <h3>📸 التقاط الأصل</h3>
      <input type="file" accept="image/*" onChange={handleOriginal} />

      <h3 style={{ marginTop: "2rem" }}>🔍 التحقق بالصورة</h3>
      <input type="file" accept="image/*" onChange={handleVerify} />

      {feedback && (
        <div style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
          <p>{feedback}</p>
          {matchPercent !== null && (
            <progress value={matchPercent} max={100} style={{ width: "80%" }}/>
          )}
        </div>
      )}
    </div>
  );
}

export default CaptureZone;
