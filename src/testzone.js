import React, { useState } from "react";
import { getImageHash } from "../utils/hash"; // تأكد من مسار الاستيراد حسب مجلدك

const TestZone = () => {
  const [matchPercent, setMatchPercent] = useState(null);
  const [feedbackColor, setFeedbackColor] = useState("gray");
  const [message, setMessage] = useState("");

  const calculateSimilarity = (hash1, hash2) => {
    const minLength = Math.min(hash1.length, hash2.length);
    let differences = 0;

    for (let i = 0; i < minLength; i++) {
      if (hash1[i] !== hash2[i]) differences++;
    }

    const percent = ((minLength - differences) / minLength) * 100;
    return Math.round(percent);
  };

  const handleVerify = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const inputHash = await getImageHash(file);
    const storedHash = localStorage.getItem("keynova_hash");

    if (!storedHash) {
      setMessage("⚠️ لا يوجد مفتاح مخزن. الرجاء حفظ مفتاح أولًا.");
      setFeedbackColor("gray");
      setMatchPercent(null);
      return;
    }

    const percent = calculateSimilarity(storedHash, inputHash);
    setMatchPercent(percent);
    console.log("نسبة التطابق:", percent); // للاختبار في Console

    if (percent >= 90) {
      setMessage(`✅ تم التحقق بنجاح بنسبة تطابق ${percent}%`);
      setFeedbackColor("green");
    } else if (percent >= 70) {
      setMessage(`⚠️ نسبة التطابق ${percent}%. قد تكون الصورة غير دقيقة.`);
      setFeedbackColor("orange");
    } else {
      setMessage(`❌ نسبة التطابق ${percent}%. محتمل أن تكون مزيفة.`);
      setFeedbackColor("red");
    }
  };

  return (
    <div style={{ padding: "1rem", textAlign: "center" }}>
      <h2>منطقة اختبار الصورة</h2>
      <input type="file" accept="image/*" onChange={handleVerify} />
      {matchPercent !== null && (
        <div style={{ marginTop: "1rem" }}>
          <p
            style={{
              color: feedbackColor,
              fontWeight: "bold",
              fontSize: "1.2rem",
              marginBottom: "0.5rem",
            }}
          >
            {message}
          </p>
          <p style={{ fontSize: "1rem", color: feedbackColor }}>
            نسبة التطابق: {matchPercent}%
          </p>
          <progress
            value={matchPercent}
            max={100}
            style={{ width: "80%", height: "16px" }}
          />
        </div>
      )}
    </div>
  );
};

export default TestZone;
