import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "1mb" }));

app.post("/api/generate", async (req, res) => {
  try {
    const prompt = (req.body?.prompt || "").trim();
    if (!prompt) return res.status(400).json({ error: "prompt is required" });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY in Railway Variables" });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          { role: "system", content: "你是一个只输出 JSON 的助手。输出必须是严格 JSON，不要代码块，不要多余文字。" },
          { role: "user", content: `请基于以下输入生成结构化 JSON：\n输入：${prompt}\n\n字段：标题、副标题、核心卖点(数组)、适用场景(数组)、关键句(数组)、短视频脚本(字符串)。` }
        ],
        text: { format: { type: "json_object" } }
      })
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: "OpenAI request failed", detail: data });

    const outputText = data.output_text || (data.output?.[0]?.content?.[0]?.text ?? "");
    const obj = JSON.parse(outputText);
    res.json(obj);
  } catch (e) {
    res.status(500).json({ error: "Server error", detail: String(e) });
  }
});

app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, "0.0.0.0", () => console.log("Server listening on", PORT));
