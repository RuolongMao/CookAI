# CookAI Render 部署说明

## 1) 部署 MySQL（Private Service）

按你给的方案执行即可（`render-examples/mysql` 模板）：

- 分支：`master`（MySQL 8）或 `mysql-5`（MySQL 5）
- Runtime：`Docker`
- 环境变量：
  - `MYSQL_DATABASE`
  - `MYSQL_USER`
  - `MYSQL_PASSWORD`
  - `MYSQL_ROOT_PASSWORD`
- 持久化磁盘：
  - Mount Path：`/var/lib/mysql`
  - Size：`10 GB`（可调整）

部署成功后，记下 Internal URL（例如：`mysql-foo:3306`）。

---

## 2) 部署 CookAI（Web Service）

本项目已改为单一 Web Service 同时提供：

- FastAPI API（后端）
- React build 静态页面（前端）

### 推荐方式 A：Dashboard 手动创建

1. 在 Render 新建 `Web Service`，选择本仓库。
2. `Language` 选择 `Docker`。
3. `Dockerfile Path` 填 `./Dockerfile`（默认也可识别）。
4. `Health Check Path` 设为：`/healthz`。
5. 配置环境变量（至少）：

   - `DATABASE_URL`
     - 示例：
       `mysql+pymysql://<MYSQL_USER>:<MYSQL_PASSWORD>@mysql-foo:3306/<MYSQL_DATABASE>`
   - `OPENAI_API_KEY`
   - `YOUTUBE_API_KEY`（如果要用 YouTube 搜索功能）
   - `CORS_ORIGINS`（可选，默认 `*`）

6. 点击部署。

### 方式 B：Blueprint

仓库已提供 [`render.yaml`](./render.yaml)，可直接 `Blueprint` 导入。

---

## 3) 关键改动（已完成）

- 前端所有 API 地址已改为统一配置，不再写死 `localhost` 或旧 Render 域名。
- 后端支持：
  - `DATABASE_URL`（优先）；
  - 或 `MYSQL_HOST/MYSQL_PORT/MYSQL_DATABASE/MYSQL_USER/MYSQL_PASSWORD` 自动组装。
- 启动时自动创建 `users` 和 `recipes` 表。
- 新增 `GET /healthz` 健康检查接口。
- FastAPI 现在可直接托管 `my-app/build`，支持前端路由刷新。
- 视频功能依赖（`ffmpeg` / `imagemagick`）改为“调用接口时检查”，避免缺依赖导致服务启动失败。

---

## 4) 部署后自检

1. 打开服务首页（`https://<your-service>.onrender.com`）应能看到前端页面。
2. `https://<your-service>.onrender.com/healthz` 返回：
   - `{"status":"ok"}`
3. 注册/登录、生成菜谱、社区读取都应走同一个域名，不应再请求 `127.0.0.1`。
