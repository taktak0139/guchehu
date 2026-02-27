import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json({ limit: "1mb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 8080);
const distDir = path.join(__dirname, "dist");

function buildFullContent(prompt) {
  const topic = (prompt || "").trim() || "车身小划痕怎么处理";

  const title = `固车虎微创钣喷｜${topic}`;
  const subtitle = "尽量保留原漆，减少拆装，局部修复更克制";

  const script =
`镜头1（0-2s）：车漆划痕/小凹陷特写（手机近景）。字幕：小刮小蹭别急着整面喷。
镜头2（2-6s）：技师用胶带圈定损伤范围并做遮蔽保护。口播：能局部修，就尽量局部修，尽量保留原漆。
镜头3（6-10s）：打磨修形+除尘脱脂（连贯动作）。字幕：范围控制在“受损区”，减少拆装。
镜头4（10-14s）：调色→薄喷→烘干（关键动作展示）。字幕：色差控制到位，才算合格。
镜头5（14-18s）：抛光收光+同角度前后对比。字幕：看不出、摸不出，是我们的标准之一。
镜头6（18-22s）：交付验收。口播：你把受损位置拍两张（远景/近景）发我，我先帮你判断值不值得修（以实际车况评估为准）。`;

  const pack = {
    视频标题: title,
    视频文案:
`很多车主遇到小刮小蹭，第一反应就是“整面喷”。
但多数情况下，能局部修复就尽量局部修复：
✅ 尽量保留原漆
✅ 减少拆装
✅ 把修复范围控制在受损区域

想判断你的车适不适合微创修复：
把【受损位置 + 两张照片（远景/近景）】发我，我给你初步建议（以实际车况评估为准）。`,
    话题标签: "#划痕补漆 #凹陷修复 #微创钣喷 #局部修复 #固车虎",
    置顶评论:
`置顶：你是【划痕/凹陷】哪一种？
大概【长度/深度】多少？
发两张照片：远景1张、近景1张。
我按车况给你建议（以实际评估为准）。`
  };

  return {
    标题: title,
    副标题: subtitle,
    原始输入: topic,
    内容类型: "短视频脚本",
    核心卖点: "微创修复、减少拆装、尽量保留原漆",
    适用场景: "小刮小蹭、轻微凹陷、局部补漆",
    风险提示: "价格与效果以实际车况评估为准",
    短视频脚本: script,
    发布四件套: pack
  };
}

/* ========= 1) 健康检查 ========= */
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

/* ========= 2) 生成接口 =========
   兼容两种入参：{prompt:"..."} 或 {text:"..."}
*/
app.post("/api/generate", (req, res) => {
  const prompt = (req.body?.prompt ?? req.body?.text ?? "").toString();
  const data = buildFullContent(prompt);
  res.json(data);
});

/* ========= 3) 静态站点 ========= */
app.use(express.static(distDir));

/* SPA 兜底 */
app.use((req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
