# Domain Docs（领域文档）

说明各类工程 skill 在探索代码库时应如何消费本仓库的领域文档。

## 探索前先阅读这些内容

- 仓库根目录的 **`CONTEXT.md`**；或者
- 如果根目录存在 **`CONTEXT-MAP.md`**——它会指向每个 context 各自的 `CONTEXT.md`，阅读与当前主题相关的那些。
- **`docs/adr/`**——阅读与你将要改动区域相关的 ADR。在 multi-context 仓库中，还要检查 `src/<context>/docs/adr/` 中针对具体 context 的决策。

如果上述任何文件不存在，**静默继续**。不要提示其缺失，也不要主动建议先创建它们。`/domain-modeling` skill（经 `/grill-with-docs` 与 `/improve-codebase-architecture` 调用）会在术语或决策真正被确定时按需创建它们。

## 文件结构

单上下文仓库（绝大多数情况）：

```
/
├── CONTEXT.md
├── docs/adr/
│   ├── 0001-event-sourced-orders.md
│   └── 0002-postgres-for-write-model.md
└── src/
```

多上下文仓库（根目录存在 `CONTEXT-MAP.md`）：

```
/
├── CONTEXT-MAP.md
├── docs/adr/                          ← 系统级决策
└── src/
    ├── ordering/
    │   ├── CONTEXT.md
    │   └── docs/adr/                  ← 该 context 专属决策
    └── billing/
        ├── CONTEXT.md
        └── docs/adr/
```

## 使用术语表（glossary）的词汇

当你的输出需要命名某个领域概念时（issue 标题、重构提案、假设、测试名等），请使用 `CONTEXT.md` 中定义的术语，不要滑向术语表明确避免的同义词。

如果你需要的概念尚未出现在术语表中，这是一个信号——要么你在发明项目并不使用的语言（请重新考虑），要么确实存在缺口（记录下来交给 `/domain-modeling`）。

## 标注与 ADR 的冲突

如果你的输出与某条现有 ADR 相冲突，请明确指出，而不是默默覆盖：

> _与 ADR-0007（event-sourced orders）冲突——但值得重新讨论，因为……_
