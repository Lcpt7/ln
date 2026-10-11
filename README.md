# LN Launcher

> 一个简洁的桌面启动器工具，类似 Raycast / Flow Launcher。

## ✨ 功能

- **全局快捷键** — `Alt+Space` 唤起/隐藏窗口
- **后台运行** — 系统托盘常驻，不占用任务栏
- **应用搜索** — 搜索并启动本机已安装的应用
- **自定义命令** — 支持打开应用 / 打开网页 / 执行命令
- **最近记录** — 自动保存最近使用的 10 条记录

## 🛠 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Electron | 28 | 桌面运行时 |
| TypeScript | 5 | 类型安全 |
| React | 18 | 渲染进程 UI |
| Vite | 5 | 构建工具 |

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 构建 + 启动
npm run electron:build

# 仅启动（需先构建）
npm start
```

## 📖 使用方式

1. 启动后应用在后台运行，系统托盘可见图标
2. 按 **`Alt+Space`** 唤起搜索窗口
3. 输入关键词搜索应用或自定义命令
4. `↑` `↓` 选择，`Enter` 执行，`Esc` 隐藏

## ⚙️ 自定义命令

配置文件位于 `%APPDATA%/ln-launcher/config.json`：

```json
{
  "customCommands": [
    {
      "id": "cmd-1",
      "name": "打开 GitHub",
      "keyword": "github",
      "type": "url",
      "action": "https://github.com"
    },
    {
      "id": "cmd-2",
      "name": "打开记事本",
      "keyword": "notepad",
      "type": "app",
      "action": "C:\\Windows\\notepad.exe"
    },
    {
      "id": "cmd-3",
      "name": "查看 IP",
      "keyword": "ip",
      "type": "shell",
      "action": "ipconfig"
    }
  ],
  "recents": []
}
```

### 命令类型

| 类型 | 说明 | action 示例 |
|------|------|-------------|
| `app` | 打开本机应用 | `C:\Windows\notepad.exe` |
| `url` | 打开网页 | `https://github.com` |
| `shell` | 执行命令 | `ipconfig` |

## 📁 项目结构

```
ln/
├── electron/               # 主进程
│   ├── main.ts             # 入口：窗口/快捷键/托盘/IPC
│   ├── preload.ts          # 预加载脚本
│   ├── appSearch.ts        # 应用搜索与启动
│   └── configStore.ts      # 配置存储
├── src/                    # 渲染进程
│   ├── App.tsx             # 主组件
│   ├── main.tsx            # React 入口
│   ├── components/
│   │   ├── SearchBar.tsx   # 搜索框
│   │   └── ResultList.tsx  # 结果列表
│   ├── types/index.ts      # 类型定义
│   └── utils/ipc.ts        # IPC 封装
├── resources/
│   └── icon.png            # 托盘图标
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🔧 开发

```bash
# 类型检查
npx tsc --noEmit

# 构建
npm run build

# 开发模式（Vite + Electron 并行）
npm run electron:dev
```

## ⚠️ 注意事项

- 若环境中存在 `ELECTRON_RUN_AS_NODE=1`，启动脚本已通过 `cross-env` 自动覆盖
- Windows 下 GPU 缓存权限警告不影响正常使用
- 应用搜索扫描开始菜单和 Program Files 下的 `.lnk` / `.exe` 文件

## 📄 License

MIT