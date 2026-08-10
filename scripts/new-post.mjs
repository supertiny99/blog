#!/usr/bin/env node
/**
 * 快速创建一篇新博文模板
 *
 * 用法:
 *   pnpm new-post "<标题>" [文件名]
 *
 * 参数:
 *   标题    必填，文章标题（写入 frontmatter 的 title）
 *   文件名  可选，URL slug（即网址 /blog/<文件名>）
 *           不传时从标题自动生成；纯中文标题会回退为 post-YYYY-MM-DD
 *
 * 示例:
 *   pnpm new-post "我的第一篇文章" my-first-post
 *   pnpm new-post "Hello World"
 */

import { writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.resolve(__dirname, '../src/content/blog');

const [title, userSlug] = process.argv.slice(2);

if (!title) {
	console.error('用法: pnpm new-post "<标题>" [文件名]');
	console.error('示例: pnpm new-post "我的第一篇文章" my-first-post');
	process.exit(1);
}

/** 今天日期 YYYY-MM-DD */
function today() {
	const d = new Date();
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}

/** 把字符串转成 URL 友好的 slug（仅对英文有效，纯中文会得到空串） */
function slugify(s) {
	return s
		.toLowerCase()
		.replace(/['"]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/** 清理用户传入的 slug */
function cleanSlug(s) {
	return s
		.toLowerCase()
		.replace(/[^a-z0-9-]+/g, '-')
		.replace(/-{2,}/g, '-')
		.replace(/^-+|-+$/g, '');
}

let slug = userSlug ? cleanSlug(userSlug) : slugify(title);
if (!slug) slug = `post-${today()}`;

const filePath = path.join(BLOG_DIR, `${slug}.md`);
const date = today();

// 避免覆盖已有文章
try {
	await access(filePath);
	console.error(`✗ 已存在同名文章: ${path.relative(process.cwd(), filePath)}`);
	console.error('  换一个文件名，或先删除/重命名已有文章。');
	process.exit(1);
} catch {
	// 文件不存在，继续创建
}

// frontmatter 的 title：单引号包裹，内部单引号双写转义（YAML 规则）
const yamlTitle = title.replace(/'/g, "''");

const content = `---
title: '${yamlTitle}'
description: ''
pubDate: '${date}'
---

<!-- 在这里开始写正文。标准 Markdown 语法，保存后 pnpm dev 即可预览。 -->
`;

await writeFile(filePath, content, 'utf8');

console.log(`✓ 已创建文章: ${path.relative(process.cwd(), filePath)}`);
console.log(`  标题: ${title}`);
console.log(`  日期: ${date}`);
console.log(`  网址: /blog/${slug}`);
console.log(`  预览: pnpm dev  →  http://localhost:4321/blog/${slug}`);
