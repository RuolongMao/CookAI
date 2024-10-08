# CookAI

2024.10.6-7
-- Front-End部分
1. 安装必要的dependencies （npm install axios）使用异步请求请求OpenAI的API
2. 建立components和css文件夹，存放组件和对应的styles
3. 建立Home.js和Home.css文件，并修改app.js文件，导入组件
4. 创建NavBar组件，实现注册前后提示语不一致，更新用户的名字
5. 创建Register和SignIn组件，实现注册和登录,
6. 实现sign out功能
7. 更新app.js
8. 注释所有代码，提高代码可读性
9. 简单实现AI text geneartion，同时实现能够选择关键词/种类
10. 创建Loading Page组件，重新建立页面跳转逻辑
11. 创建AIResponse组件，能够在新页面显示AI回复
11. 更新app.js，home.js




-- Back-End部分
1. 建立后端文件夹（server），导入node_modules和必要的package.json等配置文件
2. pip install express openai dotenv
3. 在server文件夹中创建main.py文件，注释挂载部分
4. 在server文件夹中创建env文件，并确保已在gitingnore中存放
5. 在server文件夹中创建requirements.txt文件，存放依赖库信息
6. pip install sqlalchemy pymysql
7. 修改mainpy连接数据库配置
8. 建立AI基础功能



-- 数据库部分
1. 我是用Navicat创建数据库，用的是MySQL
2. 数据库现在只有id, username和password


-- 配置部分
1. 删除react默认相关文件
2. 修改gitignore文件，避免前后端node_modules，以及后端pychache配置文件上传（必须保留pakcage.json和package-lock.json，不能写入！）
3. 前端用户拉取(cd my-app)，使用npm install安装配置文件（系统会根据package提供的依赖目录安装）
4. 后端用户拉取(cd server)，使用pip install -r requirements.txt安装需要的内容