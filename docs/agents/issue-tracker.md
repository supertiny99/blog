# Issue tracker：本地 Markdown

本仓库的问题（issues）与规格（specs）以 markdown 文件形式存放在 `.scratch/` 目录下。

## 约定

- 每个 feature 一个目录：`.scratch/<feature-slug>/`
- 规格文件为 `.scratch/<feature-slug>/spec.md`
- 实现类问题按"一文件一工单"放在 `.scratch/<feature-slug>/issues/<NN>-<slug>.md`，从 `01` 开始编号——绝不合并成单个 tickets 文件
- Triage 状态记录在每个 issue 文件顶部附近的 `Status:` 行中
- 评论与对话历史追加到文件底部，置于 `## Comments` 标题下

## 当某个 skill 要求"publish to the issue tracker"（发布到 issue tracker）

在 `.scratch/<feature-slug>/` 下新建文件（必要时创建该目录）。

## 当某个 skill 要求"fetch the relevant ticket"（获取相关工单）

读取引用路径对应的文件。用户通常会直接传入路径或 issue 编号。

## Wayfinding operations（寻路操作）

供 `/wayfinder` 使用。**map（地图）**是一个文件，对应每个工单各有一个 **child（子工单）**文件。

- **Map**：`.scratch/<effort>/map.md`——承载 Notes（笔记）/ Decisions-so-far（已达成的决策）/ Fog（待澄清的迷雾）正文。
- **Child ticket**：`.scratch/<effort>/issues/NN-<slug>.md`，从 `01` 开始编号，正文中写明问题。用 `Type:` 行记录工单类型（`research`/`prototype`/`grilling`/`task`）；用 `Status:` 行记录 `claimed`/`resolved`。
- **Blocking（阻塞）**：在顶部附近用 `Blocked by: NN, NN` 行表示。当它列出的每个文件都为 `resolved` 时，该工单即解除阻塞。
- **Frontier（前沿）**：扫描 `.scratch/<effort>/issues/`，找出打开、未阻塞、未被认领的文件；编号最小的优先。
- **Claim（认领）**：在任何工作开始前，先设置 `Status: claimed` 并保存。
- **Resolve（解决）**：在 `## Answer` 标题下追加答案，设置 `Status: resolved`，然后在 `map.md` 的 Decisions-so-far 中追加一条上下文指引（gist + 链接）。
