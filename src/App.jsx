import { useState } from "react";
import axios from "axios";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("等待输入...");
  const [loading, setLoading] = useState(false);

  const callAI = async () => {
    if (!input) return;
    setLoading(true);
    setOutput("AI 生成中...");

    try {
      const res = await axios.post("http://localhost:3001/ai", {
        text: input,
      });

      try {
        const json = JSON.parse(res.data.output);
        setOutput(JSON.stringify(json, null, 2));
      } catch {
        setOutput(res.data.output);
      }
    } catch (err) {
      setOutput("请求失败：" + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40, fontFamily: "sans-serif" }}>
      <h1>AI JSON结构化生成引擎</h1>

      <textarea
        rows="5"
        style={{ width: "100%", fontSize: 16 }}
        placeholder="输入内容..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <br /><br />

      <button onClick={callAI} disabled={loading}>
        {loading ? "生成中..." : "生成 JSON"}
      </button>

      <pre
        style={{
          marginTop: 20,
          background: "#111",
          color: "#0f0",
          padding: 15,
          whiteSpace: "pre-wrap",
        }}
      >
        {output}
      </pre>
    </div>
  );
}
