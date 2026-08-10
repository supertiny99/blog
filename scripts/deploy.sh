#!/usr/bin/env bash
# 本地备用发布：构建 + 自动登录检测 + 部署到 Cloudflare（同一个 blog Worker）
# 用法：pnpm deploy
set -e

echo "==> [1/3] 构建 (astro build)"
pnpm run build

echo "==> [2/3] 检查 Cloudflare 登录状态"
if pnpm exec wrangler whoami 2>&1 | grep -qiE "not logged in|expired|not authenticated"; then
  echo "    未登录或 token 过期，正在打开浏览器授权…（授权后自动继续）"
  pnpm exec wrangler login
  echo "    登录完成。"
else
  echo "    已登录。"
fi

echo "==> [3/3] 部署 (wrangler deploy)"
pnpm exec wrangler deploy

echo "==> ✅ 部署完成"
