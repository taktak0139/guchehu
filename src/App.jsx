import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");

  const generateJSON = async () => {
    if (!text) return;

    setResult("AI生成中...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setResult("调用失败，请检查API");
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>AI JSON结构化生成引擎</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="一句话介绍你的业务..."
        style={{ width: "100%", height: 120, marginTop: 20 }}
      />

      <br />

      <button
        onClick={generateJSON}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        生成 JSON
      </button>

      <pre
        style={{
          marginTop: 30,
          background: "#000",
          color: "#0f0",
          padding: 20,
          minHeight: 200,
          whiteSpace: "pre-wrap",
        }}
      >
        {result}
      </pre>
    </div>
  );
}
