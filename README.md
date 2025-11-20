# 南京大学 RAG 系统 · 前端

Vue 3 + Vite 单页应用，用于向量检索增强生成（RAG）系统的可视化交互：

- 紫金山主题界面，居中输入框仿主流大模型体验
- 直接通过 RESTful API 调用统一后端 `NRS_backend`（默认 `http://localhost:8000/api/rag`）获取回答与信息源
- 结果展示区逐行输出回答，来源以卡片样式列出
- 若无真实后端，可按需启动 `mock-server.mjs`（可选）模拟 200/404 响应

## 运行依赖

- Node.js ≥ 18
- npm ≥ 9

## 快速开始

在 `NRS_frontend` 目录执行：

```powershell
npm install
echo "VITE_RAG_API_URL=http://localhost:8000/api/rag" > .env.local   # 指向已启动的 NRS_backend
npm run dev    # 默认 http://localhost:3000
```

默认会直接向 `.env.local` 中的后端地址发起 REST 请求。若暂时没有后端，可另外执行 `npm run mock`，并将 `VITE_RAG_API_URL` 改成 `http://localhost:8003/api/rag`。

## 联调与部署场景

### 1. 对接本地 NRS_backend（推荐）

1. 启动你自己的 RAG 后端（示例端口 9000）：
	```powershell
	# 视项目而定，这里仅示意
	cd C:\path\to\nju_rag_backend
	uvicorn app.main:app --host 0.0.0.0 --port 9000
	```
2. 在 `NRS_frontend` 目录创建 `.env.local`，指向真实接口：
	```powershell
	echo "VITE_RAG_API_URL=http://localhost:9000/api/rag" > .env.local
	```
3. 重新运行前端：
	```powershell
	npm run dev
	```

此时前端会向 `NRS_backend` 的 `/api/rag` 发送真实问题，并渲染后端返回的 `answer` 与 `sources`。

### 2. 使用 mock 服务器自测（可选）

```powershell
npm run mock      # 终端 1：保持运行
echo "VITE_RAG_API_URL=http://localhost:8003/api/rag" > .env.local
npm run dev       # 终端 2：访问 http://localhost:3000
```

- mock 服务监听 `http://localhost:8003/api/rag`，POST body 形如 `{ "question": "..." }`。
- 关键词包含“招生/研究生”返回 200，其余命中 404，可验证成功/失败提示、逐行回答和来源卡片动画。

### 3. 部署到云端服务器

1. 构建前设置面向公网的 API：
	```powershell
	echo "VITE_RAG_API_URL=https://api.example.com/rag" > .env.production
	npm run build
	```
2. 将 `dist/` 上传至静态资源服务器（Nginx、OSS、Vercel 等）。以 Nginx 为例：
	```
	server {
		 listen 80;
		 server_name rag.example.com;
		 root /var/www/nrs-frontend/dist;
		 location / { try_files $uri /index.html; }
	}
	```
3. 确保云端后端允许前端域名访问（CORS/网关配置），或在同一域名下做反向代理：
	```
	location /api/rag {
		 proxy_pass http://backend.internal/api/rag;
	}
	```

完成后即可在公网地址访问前端，并与真实 RAG 服务交互。

## 环境变量

默认请求 `/api/rag` 并由 Vite 代理至 `http://localhost:8000`。如需直连其它后端，可在根目录创建 `.env.local`：

```powershell
echo "VITE_RAG_API_URL=https://your-host/api/rag" > .env.local
```

## 构建

```powershell
npm run build
npm run preview   # 预览打包结果
```

## 目录结构

```
NRS_frontend/
├─ src/
│  ├─ components/      # ChatInput、RagSources 组件
│  ├─ App.vue          # 页面框架与查询逻辑
│  ├─ main.ts          # 入口
│  ├─ style.css        # 全局紫色主题样式
│  └─ types.ts         # RAG 响应类型
├─ mock-server.mjs     # Express mock 服务
├─ vite.config.ts      # Vite 配置（含代理）
└─ package.json
```

欢迎根据实际数据源扩展界面或状态管理逻辑。
