import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api", async (req, res) => {
  try {
    const { text } = req.body;

    const prompt = `
你是汽车后市场运营专家。
根据用户输入生成结构化JSON，用于短视频内容生产。

用户输入：
${text}

输出JSON格式：
{
  "标题": "",
  "短视频脚本": "",
  "封面文案": "",
  "标签": ["","",""],
  "评论引导": "",
  "内容类型": ""
}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const output = completion.choices[0].message.content;
    res.json({ result: output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("AI Server running on", PORT);
});
