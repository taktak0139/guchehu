import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json({ limit: "1mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const distDir = path.join(__dirname, "dist");

// 1) API
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// 你前端如果打的是 /api/generate，就用这个
app.post("/api/generate", async (req, res) => {
  const prompt = (req.body?.prompt ?? req.body?.text ?? "").toString().trim();
  if (!prompt) return res.status(400).json({ error: "missing prompt/text" });

  // 先返回固定结构（确保飞书能解析）——后续再接入真实AI
  res.json({
    标题: "固车虎微创钣喷",
    副标题: "划痕/凹陷局部修复",
    原始输入: prompt,
    内容类型: "短视频脚本",
    核心卖点: "微创修复、减少拆装、尽量保留原漆",
    适用场景: "小刮小蹭、轻微凹陷、局部补漆",
    风险提示: "价格与效果以实际车况评估为准",
    短视频脚本: "镜头1问题→镜头2方案→镜头3对比→镜头4引导私信",
    发布四件套: "标题+文案+话题+置顶评论"
  });
});

// 你前端如果打的是 /api，就用这个（兼容）
app.post("/api", async (req, res) => {
  const text = (req.body?.text ?? req.body?.prompt ?? "").toString().trim();
  if (!text) return res.status(400).json({ error: "missing text/prompt" });

  res.json({
    标题: "固车虎微创钣喷",
    副标题: "划痕/凹陷局部修复",
    原始输入: text,
    内容类型: "短视频脚本",
    核心卖点: "微创修复、减少拆装、尽量保留原漆",
    适用场景: "小刮小蹭、轻微凹陷、局部补漆",
    风险提示: "价格与效果以实际车况评估为准",
    短视频脚本: "镜头1问题→镜头2方案→镜头3对比→镜头4引导私信",
    发布四件套: "标题+文案+话题+置顶评论"
  });
});

// 2) 静态页面
app.use(express.static(distDir));

// 3) SPA 兜底（关键：不用 *）
app.use((req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on ${PORT}`);
});
