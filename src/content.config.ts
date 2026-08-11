import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// 可选：覆盖 consts.SITE_TIMEZONE，指定该文章显示日期所用的时区（IANA 名称）
			timezone: z.string().optional(),
			heroImage: z.optional(image()),
			// 标签数组：值即展示文案，也作 URL slug。建议小写英文，中文亦可（URL 会被 encode）
			tags: z.array(z.string()).default([]),
		}),
});

export const collections = { blog };
