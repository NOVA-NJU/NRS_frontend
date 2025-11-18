import express from 'express';

const app = express();
const PORT = 8003;

app.use(express.json());

const SAMPLE_SOURCES = [
  {
    text: '研究生需具备计算机相关专业本科学历，满足南京大学研究生院公布的基本要求。',
    url: 'https://cs.nju.edu.cn/admission/2024',
    title: '2024 年计算机系研究生招生简介'
  },
  {
    text: '申请者需通过全国硕士研究生统一招生考试，并根据院系安排参加复试。',
    url: 'https://grawww.nju.edu.cn/2024/02/recruit',
    title: '南京大学研究生院招生通知'
  }
];

app.post('/api/rag', (req, res) => {
  const { question } = req.body ?? {};

  if (!question) {
    return res.status(400).json({
      code: '400',
      answer: '问题不能为空，请重新输入',
      sources: []
    });
  }

  const keyword = String(question).toLowerCase();

  if (keyword.includes('招生') || keyword.includes('研究生')) {
    return res.json({
      code: '200',
      answer:
        '根据公开信息，南京大学计算机系研究生招生通常在每年 9 月开启网上报名，考生需满足国家线并通过院系复试。建议密切关注学院官网公告以获取复试科目与时间安排。根据公开信息，南京大学计算机系研究生招生通常在每年 9 月开启网上报名，考生需满足国家线并通过院系复试。建议密切关注学院官网公告以获取复试科目与时间安排。',
      sources: SAMPLE_SOURCES
    });
  }

  return res.status(404).json({
    code: '404',
    answer: '暂未检索到与你的问题匹配的官方通知，换个关键词试试吧。',
    sources: []
  });
});

app.listen(PORT, () => {
  console.log(`Mock RAG server listening on http://localhost:${PORT}`);
});
