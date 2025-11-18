# 南京大学 RAG 系统 · 前端

Vue 3 + Vite 单页应用，用于向量检索增强生成（RAG）系统的可视化交互：

- 紫金山主题界面，居中输入框仿主流大模型体验
- 调用 `http://localhost:8003/api/rag` 接口获取回答与信息源
- 结果展示区逐行输出回答，来源以卡片样式列出
- 自带 `mock-server.mjs`，无真实后端时可本地模拟 200/404 响应

## 运行依赖

- Node.js ≥ 18
- npm ≥ 9

## 快速开始

在 `NRS_frontend` 目录执行：

```powershell
npm install
npm run mock   # 终端 1：启动 8003 端口 mock 服务
npm run dev    # 终端 2：启动前端 (默认 http://localhost:5173)
```

mock 服务器根据关键词返回 200 或 404，可用于联调输入框、状态条与来源卡片效果。

## 联调与部署场景

### 1. 使用 mock 服务器自测

```powershell
npm run mock      # 终端 1：保持运行
npm run dev       # 终端 2：访问 http://localhost:5173
```

- mock 服务监听 `http://localhost:8003/api/rag`，POST body 形如 `{ "question": "..." }`。
- 关键词包含“招生/研究生”返回 200，其余命中 404，可验证成功/失败提示、逐行回答和来源卡片动画。

### 2. 对接本地后端

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

此时前端将绕过 proxy，直接访问配置的地址；若仍希望通过 Vite 代理，可改写 `vite.config.ts` 的 `server.proxy`，把目标改成你的后端端口。

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

默认请求 `/api/rag` 并由 Vite 代理至 `http://localhost:8003`。如需直连其它后端，可在根目录创建 `.env.local`：

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
