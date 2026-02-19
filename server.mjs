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
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const schemaPrompt = `
你是“固车虎·微创钣喷”短视频内容生成引擎。
只输出严格 JSON（不要代码块、不要解释、不要多余文字）。

用户输入：
${prompt}

请输出 JSON，字段如下（必须全部给出）：
{
  "品牌": "固车虎·微创钣喷",
  "内容类型": "知识科普/案例展示/价格解释/避坑建议/活动引流/门店介绍 之一",
  "标题": "不超过18字",
  "副标题": "不超过24字",
  "核心卖点": ["数组，3-6条，短句"],
  "适用场景": ["数组，2-5条"],
  "风险提示": ["数组，1-3条，用中性表达，避免保证性承诺"],
  "短视频脚本": {
    "时长": "30-45秒",
    "分镜": [
      {"时间段":"0-2s","画面":"","口播":"","字幕":""},
      {"时间段":"2-8s","画面":"","口播":"","字幕":""},
      {"时间段":"8-20s","画面":"","口播":"","字幕":""},
      {"时间段":"20-35s","画面":"","口播":"","字幕":""},
      {"时间段":"35-45s","画面":"","口播":"","字幕":""}
    ]
  },
  "发布四件套": {
    "标题": "",
    "作品描述": "",
    "话题标签": ["#微创钣喷","#划痕补漆","#凹陷修复"],
    "置顶评论": ""
  }
}
要求：
- 口播更适合口语表达，短句，利落
- 不要出现“最/第一/唯一/包治/保证/百分百”等绝对化或承诺性表述
- 适用场景与卖点要贴近：划痕补漆、凹陷修复、微创钣喷、保留原车漆/原车件、以修代换
`;

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        input: [
          { role: "user", content: schemaPrompt }
        ],
        text: { format: { type: "json_object" } }
      })
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: "OpenAI failed", detail: data });

    const outputText =
      data.output_text ||
      (data.output?.[0]?.content?.[0]?.text ?? "");

    const obj = JSON.parse(outputText);
    res.json(obj);
  } catch (e) {
    res.status(500).json({ error: "Server error", detail: String(e) });
  }
});

// 静态托管 dist（保持你现在网页仍可打开）
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, "0.0.0.0", () => console.log("Server listening on", PORT));
