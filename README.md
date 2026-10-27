# 安速物流客户端

根据 NSU 安速物流界面还原的静态前端工作台。

在线访问：https://xingyuzhang65-cloud.github.io/ansu--client/

## 页面

- 运单管理：`#waybill`
- 暂存管理：`#overseas-storage`
- 指令列表：`#instruction-list`

暂存管理与指令列表位于侧栏「预警管理」上方，支持顶部页签切换、直接链接与浏览器前进后退。

## 使用

通过任意静态 HTTP 服务器运行仓库根目录；无需安装依赖或构建。GitHub Pages 从 `main` 分支根目录发布。

页面包含搜索、运单详情、批量操作、CSV 导出及参考模块的客户侧交互。当前使用示例数据和浏览器本地存储，未接入生产业务 API。不同域名下的本地数据分别保存。

## 文件

- `index.html`、`styles.css`、`app.js`：运单管理及公共界面。
- `modules.js`、`modules.css`：模块路由、侧栏和页签切换。
- `overseas-app/`：暂存管理与指令列表的本地静态资源。
- `REFERENCE.md`：参考来源说明。

暂存管理与指令列表参考用户指定的天图通达客户端；相关资源已保存在本仓库中。
