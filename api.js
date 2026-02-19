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

app.post("/api/generate", async (req, res) => {
  try {
    const { text } = req.body;

    const prompt = `
你是JSON生成引擎。根据用户一句话生成短视频营销JSON，必须返回JSON格式：

{
  "标题": "",
  "副标题": "",
  "核心卖点": "",
  "适用场景": "",
  "关键词": [],
  "短视频脚本": ""
}

用户输入：${text}
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI调用失败" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("API running on " + PORT);
});
