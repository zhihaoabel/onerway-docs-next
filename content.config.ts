// content.config.ts
import {
  defineCollection,
  defineContentConfig,
  z,
} from "@nuxt/content";

// Constants for better maintainability
const LOCALES = ["en", "zh-cn", "zh-tw"] as const;
const DOMAINS = [
  "get-started",
  "payments",
  "payouts",
] as const;
const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
] as const;
const CHANGELOG_TYPES = [
  "major",
  "minor",
  "patch",
] as const;
const VERSION_STATUS = [
  "current",
  "deprecated",
  "legacy",
] as const;

// Shared schema definitions
const createBasePageSchema = () =>
  z.object({
    title: z.string(),
    description: z.string().optional(),
    version: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    lastUpdated: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().optional().default(false),
    showToc: z.boolean().optional().default(true),
    showNavigation: z.boolean().optional().default(true),
    layout: z.string().optional(),
  });

const createPaymentsSchema = () =>
  createBasePageSchema().extend({
    apiMethod: z.enum(HTTP_METHODS).optional(),
    apiEndpoint: z.string().optional(),
  });

const createChangelogSchema = () =>
  z.object({
    title: z.string(),
    version: z.string(),
    releaseDate: z.string(),
    type: z.enum(CHANGELOG_TYPES),
    domain: z.enum(DOMAINS),
    description: z.string().optional(),
    breaking: z.boolean().optional().default(false),
    features: z.array(z.string()).optional(),
    fixes: z.array(z.string()).optional(),
    improvements: z.array(z.string()).optional(),
    showToc: z.boolean().optional().default(true),
    showNavigation: z.boolean().optional().default(true),
    layout: z.string().optional(),
  });

const createMetadataSchema = () =>
  z.object({
    domain: z.string(),
    currentVersion: z.string(),
    availableVersions: z.array(
      z.object({
        version: z.string(),
        status: z.enum(VERSION_STATUS),
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
  });

// Collection factory functions
const createDomainCollection = (
  domain: string,
  locale: string,
  schema: ReturnType<
    typeof createBasePageSchema
  > = createBasePageSchema()
) => {
  const localeDir =
    locale === "zh-cn"
      ? "zh-cn"
      : locale === "zh-tw"
        ? "zh-tw"
        : "en";

  return defineCollection({
    type: "page",
    source: {
      include: `${localeDir}/${domain}/**/*.{md,yml}`,
      exclude: [`${localeDir}/${domain}/changelog/**`],
    },
    schema,
  });
};

const createChangelogCollection = (locale: string) => {
  const localeDir =
    locale === "zh-cn"
      ? "zh-cn"
      : locale === "zh-tw"
        ? "zh-tw"
        : "en";

  return defineCollection({
    type: "page",
    source: `${localeDir}/**/changelog/*.md`,
    schema: createChangelogSchema(),
  });
};

// Generate collections dynamically
const generateCollections = () => {
  const collections: Record<
    string,
    ReturnType<typeof defineCollection>
  > = {};

  // Generate domain collections for each locale
  DOMAINS.forEach((domain) => {
    LOCALES.forEach((locale) => {
      const collectionName = `${domain.replace("-", "_")}_${locale.replace("-", "_")}`;
      const schema =
        domain === "payments"
          ? createPaymentsSchema()
          : createBasePageSchema();
      collections[collectionName] = createDomainCollection(
        domain,
        locale,
        schema
      );
    });
  });

  // Generate changelog collections for each locale
  LOCALES.forEach((locale) => {
    const collectionName = `changelog_${locale.replace("-", "_")}`;
    collections[collectionName] =
      createChangelogCollection(locale);
  });

  // Add metadata collection
  collections.metadata = defineCollection({
    type: "data",
    source: "metadata/*.yml",
    schema: createMetadataSchema(),
  });

  return collections;
};

export default defineContentConfig({
  collections: generateCollections(),
});
