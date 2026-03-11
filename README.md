# xgfy-report

疫情上报系统自动化管理工具，本项目为组织内部自用项目，不提供常规文档，开源仅供有识之士参考。

## 功能

- 通过 Telegram Bot 管理疫情上报人员名单
- 每日自动检查上报状态，对未上报用户自动补报（复用上次上报数据）
- 上报异常自动通知（3次失败后禁用自动上报）
- 支持按姓名/学号/手机号查询和管理用户

## 工作原理

```
index.ts (主循环，每51分钟运行一次，由 Docker 重启)
  ├── tgbot.ts       — Telegram Bot 管理接口
  └── 自动上报.ts    — 自动上报核心逻辑
        ├── 用户信息更新()     — 从 xgfy API 补全用户信息
        └── 自动上报状态检查() — 检查今日 batchno，未上报则自动提交
              └── api-xgfy.ts  — SIT 疫情填报系统 API 封装
```

1. **API 封装** (`api-xgfy.ts`)：对接 `xgfy.sit.edu.cn`，使用 MD5 + 时间戳签名认证，支持查询用户信息、获取历史上报、提交今日上报。

2. **自动上报** (`自动上报.ts`)：从 MongoDB 读取启用自动上报的学号列表，检查每人的今日 `batchno`，若未上报则取最近一次上报数据原样重新提交。连续失败 3 次（且已过凌晨3点）后自动禁用该用户。

3. **Telegram Bot** (`tgbot.ts`)：提供管理命令接口：
   - `/check <学号/姓名>` — 查看上报状态
   - `/auto_report <学号/姓名>` — 启用自动上报
   - `/find <学号/姓名>` — 查找用户信息
   - `/ping` — 检活
   - `/restart` — 重启服务

4. **数据库** (`db.ts`)：MongoDB 存储用户基本信息、最新上报状态和历史记录。

5. **部署**：Docker Compose，进程每 51 分钟自动退出并由 Docker 重启，实现定期刷新。

## 技术栈

TypeScript · Node.js · Babel · MongoDB · Docker Compose · Telegram Bot API

## 环境变量

| 变量 | 说明 |
|------|------|
| `MONGO_URI` | MongoDB 连接字符串 |
| `BOT_TOKEN` | Telegram Bot Token |
| `BOT_NOTIFY_CHATID` | 通知发送目标 Chat ID |
| `OLD_AUTO_USERS` | 旧批次自动上报学号列表（空格分隔） |
| `NEW_AUTO_USERS` | 新批次自动上报学号列表（空格分隔） |
| `HTTP_PROXY` | （可选）HTTP 代理 |

---

雪星 于 2021 春
