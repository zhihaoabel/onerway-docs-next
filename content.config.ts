// content.config.ts
import {
  defineCollection,
  defineContentConfig,
  z,
} from "@nuxt/content";

export default defineContentConfig({
  collections: {
    // Get Started 文档集合
    get_started_en: defineCollection({
      type: "page",
      source: {
        include: "en/get-started/**/*.md",
        exclude: ["en/get-started/changelog/**"],
      },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        version: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        lastUpdated: z.string().optional(),
        order: z.number().optional(),
        draft: z.boolean().optional().default(false),
      }),
    }),

    get_started_zh: defineCollection({
      type: "page",
      source: {
        include: "zh/get-started/**/*.md",
        exclude: ["zh/get-started/changelog/**"],
      },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        version: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        lastUpdated: z.string().optional(),
        order: z.number().optional(),
        draft: z.boolean().optional().default(false),
      }),
    }),

    // Payments 文档集合
    payments_en: defineCollection({
      type: "page",
      source: {
        include: "en/payments/**/*.md",
        exclude: ["en/payments/changelog/**"],
      },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        version: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        lastUpdated: z.string().optional(),
        order: z.number().optional(),
        draft: z.boolean().optional().default(false),
        apiMethod: z
          .enum(["GET", "POST", "PUT", "DELETE", "PATCH"])
          .optional(),
        apiEndpoint: z.string().optional(),
      }),
    }),

    payments_zh: defineCollection({
      type: "page",
      source: {
        include: "zh/payments/**/*.md",
        exclude: ["zh/payments/changelog/**"],
      },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        version: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        lastUpdated: z.string().optional(),
        order: z.number().optional(),
        draft: z.boolean().optional().default(false),
        apiMethod: z
          .enum(["GET", "POST", "PUT", "DELETE", "PATCH"])
          .optional(),
        apiEndpoint: z.string().optional(),
      }),
    }),

    // Payouts 文档集合
    payouts_en: defineCollection({
      type: "page",
      source: {
        include: "en/payouts/**/*.md",
        exclude: ["en/payouts/changelog/**"],
      },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        version: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        lastUpdated: z.string().optional(),
        order: z.number().optional(),
        draft: z.boolean().optional().default(false),
      }),
    }),

    payouts_zh: defineCollection({
      type: "page",
      source: {
        include: "zh/payouts/**/*.md",
        exclude: ["zh/payouts/changelog/**"],
      },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        version: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        lastUpdated: z.string().optional(),
        order: z.number().optional(),
        draft: z.boolean().optional().default(false),
      }),
    }),

    // Changelog 集合 - 独立管理
    changelog_en: defineCollection({
      type: "page",
      source: "en/**/changelog/*.md",
      schema: z.object({
        title: z.string(),
        version: z.string(),
        releaseDate: z.string(),
        type: z.enum(["major", "minor", "patch"]),
        domain: z.enum([
          "get-started",
          "payments",
          "payouts",
        ]),
        description: z.string().optional(),
        breaking: z.boolean().optional().default(false),
        features: z.array(z.string()).optional(),
        fixes: z.array(z.string()).optional(),
        improvements: z.array(z.string()).optional(),
      }),
    }),

    changelog_zh: defineCollection({
      type: "page",
      source: "zh/**/changelog/*.md",
      schema: z.object({
        title: z.string(),
        version: z.string(),
        releaseDate: z.string(),
        type: z.enum(["major", "minor", "patch"]),
        domain: z.enum([
          "get-started",
          "payments",
          "payouts",
        ]),
        description: z.string().optional(),
        breaking: z.boolean().optional().default(false),
        features: z.array(z.string()).optional(),
        fixes: z.array(z.string()).optional(),
        improvements: z.array(z.string()).optional(),
      }),
    }),

    // 元数据集合 - 存储版本信息等
    metadata: defineCollection({
      type: "data",
      source: "metadata/*.yml",
      schema: z.object({
        domain: z.string(),
        currentVersion: z.string(),
        availableVersions: z.array(
          z.object({
            version: z.string(),
            status: z.enum([
              "current",
              "deprecated",
              "legacy",
            ]),
            supportedUntil: z.string().optional(),
          })
        ),
        languages: z.array(
          z.object({
            code: z.string(),
            name: z.string(),
            completeness: z.number().min(0).max(100),
          })
        ),
      }),
    }),
  },
});
