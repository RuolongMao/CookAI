# CookAI

2024.10.6-7
-- Front-End 部分

1. 安装必要的 dependencies （npm install axios）使用异步请求请求 OpenAI 的 API
2. 建立 components 和 css 文件夹，存放组件和对应的 styles
3. 建立 Home.js 和 Home.css 文件，并修改 app.js 文件，导入组件
4. 创建 NavBar 组件，实现注册前后提示语不一致，更新用户的名字
5. 创建 Register 和 SignIn 组件，实现注册和登录,
6. 实现 sign out 功能
7. 更新 app.js
8. 注释所有代码，提高代码可读性
9. 简单实现 AI text generation，同时实现能够选择关键词/种类
10. 创建 Loading Page 组件，重新建立页面跳转逻辑
11. 创建 AIResponse 组件，能够在新页面显示 AI 回复
12. 更新 app.js，home.js

-- Back-End 部分

1. 建立后端文件夹（server），导入 node_modules 和必要的 package.json 等配置文件
2. pip install openai dotenv
3. 在 server 文件夹中创建 main.py 文件，注释挂载部分
4. 在 server 文件夹中创建 env 文件，并确保已在 gitingnore 中存放
5. 在 server 文件夹中创建 requirements.txt 文件，存放依赖库信息
6. pip install sqlalchemy pymysql
7. 修改 mainpy 连接数据库配置
8. 建立 AI 基础功能

-- 数据库介绍及使用

1. 我是用 Navicat 创建数据库，用的是 MySQL

-- 数据库说明

1. `user` 数据库

- `id`: 自增的主键，唯一标识每个用户。
- `username`: 用户名，必须唯一。
- `password`: 用户密码。

2. `recipes` 数据库

- `id`: 自增的主键，唯一标识每个食谱。
- `user_id`: 创建该食谱的用户的唯一 ID。
- `image_url`: 食谱相关图片的 URL。
- `recipe_name`: 食谱名称，如“巧克力蛋糕”。
- `details`: 食谱细节信息
- `created_time`: 创建该食谱的日期。

-- API 端口说明

1. POST /create

- 功能: 创建新的食谱。
- 请求体示例:
  ```json
  {
    "user_id": 1,
    "image_url": "http://example.com/image.jpg",
    "recipe_name": "Orange Chicken",
    "details": {
      "estimate_time": "50 minutes"
    }
  }
  ```

2. DELETE /delete

- 功能: 根据 recipe_id 删除指定的食谱。
- 请求示例: /delete?recipe_id=1

3. POST /search

- 功能：根据食谱名称搜索食谱，支持模糊搜索。
- 请求体示例:
  ```json
  {
    "recipe_name": "Orange"
  }
  ```

4. GET /get

- 功能：获取所有食谱列表。

5. POST /filter

- 功能：支持通过 est_time 和 est_cost 范围筛选所有食谱列表。
- 请求体示例:
  ```json
  {
    "est_time_min": 0,
    "est_time_max": 100
  }
  ```

6. POST /dashboard

- 功能：通过 user_id 筛选并返还食谱列表。
- 请求体示例：
  ```json
  {
    "user_id": 1
  }
  ```

-- 配置部分

1. 删除 react 默认相关文件
2. 修改 gitignore 文件，避免前后端 node_modules，以及后端 pychache 配置文件上传（必须保留 pakcage.json 和 package-lock.json，不能写入！）
3. 前端用户拉取(cd my-app)，使用 npm install 安装配置文件（系统会根据 package 提供的依赖目录安装）
4. 后端用户拉取(cd server)，使用 pip install -r requirements.txt 安装需要的内容
5. site key: 6Lc8TmwqAAAAAKm-H6hFjjbgZucAUhVOOD48tF1F
   secret key: env 文件查看
6. npm install react-google-recaptcha(前端)
7. pip install httpx（后端）

-- 潜在改进内容

1. 存储记忆（线程），改进菜谱的时候，能有之前的记忆，让 Model 直接根据之前的记忆继续修改现在的菜谱，不用重新修改
2. 大数据模型 API，实现推广用户感兴趣的内容，或者使用 embeddings 搜索相关感兴趣的内容
3. AI 单位问题（response 页面问题）
4. AI response page可以添加评论功能（仅限登陆）
5. community page如果点击喜欢可以收藏（仅限登陆）
6. community page如果可以留下评论，更多的人看到
7. community page点赞人数data
8. AIresponse 实现prompt微调（允许用户输入更多的信息调整）
9. AIresponse 过敏原信息

MYSQL Terminal 启动代码
sudo /usr/local/mysql/support-files/mysql.server restart
