import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.deepseek.com"
});

app.post("/ai", async (req, res) => {
  try {
    const { text } = req.body;

    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
你是内容结构化生成引擎。
所有输出必须是JSON，不允许任何解释文字。

JSON结构如下：

{
  "标题": "",
  "副标题": "",
  "核心卖点": "",
  "适用场景": "",
  "关键词": [],
  "短视频脚本": ""
}
`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    res.json({
      output: completion.choices[0].message.content,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log("AI server running on http://localhost:3001");
});
