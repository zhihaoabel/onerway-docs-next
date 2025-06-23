<!-- pages/[...slug].vue -->
<script setup lang="ts">
import type { Collections } from "@nuxt/content";

const route = useRoute();
const { locale } = useI18n();

// 解析路由参数
const slug = Array.isArray(route.params.slug)
  ? route.params.slug
  : [route.params.slug || ""];
const [domain, version, ...pathSegments] = slug;

console.log("🔍 路由解析:", {
  slug,
  domain,
  version,
  pathSegments,
  locale: locale.value,
});

// 配置常量
const VALID_DOMAINS = [
  "get_started", // get-started
  "payments",
  "payouts",
  "changelog",
] as const;
type ValidDomain = (typeof VALID_DOMAINS)[number];

// 标准化语言代码 - 根据你的 i18n 配置
const normalizeLanguage = (lang: string): "en" | "zh" => {
  // 将 i18n 的语言代码映射到内容集合的语言代码
  if (
    lang === "zh-CN" ||
    lang === "zh-TW" ||
    lang.startsWith("zh")
  ) {
    return "zh";
  }
  return "en";
};

// 页面集合类型（排除数据集合）
type PageCollectionName = Exclude<
  keyof Collections,
  "metadata"
>;

// 获取集合名称
const getCollectionName = (
  domain: string,
  lang: string
): keyof Collections => {
  const normalizedLang = normalizeLanguage(lang);
  // 将域名中的连字符转换为下划线以匹配集合名称
  const normalizedDomain = domain.replace(/-/g, "_");
  const collectionName =
    `${normalizedDomain}_${normalizedLang}` as keyof Collections;
  console.log("📚 集合名称:", collectionName);
  return collectionName;
};

// 检查是否为页面集合
const isPageCollection = (
  collectionName: keyof Collections
): collectionName is PageCollectionName => {
  return collectionName !== "metadata";
};

// 构建内容路径
const buildContentPath = (): string => {
  const lang = normalizeLanguage(locale.value);

  // 如果没有域名，返回首页
  if (!domain) {
    return `/${lang}/index`;
  }

  // 处理 changelog 特殊情况
  if (domain === "changelog") {
    const changelogDomain = version; // payments, payouts 等
    const changelogVersion = pathSegments[0]; // v3.0.0 等
    const path = `/${lang}/${changelogDomain}/changelog/${changelogVersion || "index"}`;
    console.log("📄 Changelog 路径:", path);
    return path;
  }

  // 处理普通文档路径
  const currentVersion = version || "v1"; // 默认版本
  let docPath = "";

  if (pathSegments.length > 0) {
    docPath = `/${pathSegments.join("/")}`;
  } else {
    docPath = "/"; // 版本首页
  }

  const fullPath = `/${lang}/${domain}/${currentVersion}${docPath}`;
  console.log("📄 文档路径:", fullPath);
  return fullPath;
};

// 验证域名
const isValidDomain = (domain: string): boolean => {
  // 将连字符转换为下划线后进行验证
  const normalizedDomain = domain.replace(/-/g, "_");
  return VALID_DOMAINS.includes(
    normalizedDomain as ValidDomain
  );
};

const contentPath = buildContentPath();
const currentLang = normalizeLanguage(locale.value);

console.log("当前路径", route.path);

// 执行域名验证 - 使用响应式标志来控制页面渲染
const isValidPage = ref(true);

if (domain && !isValidDomain(domain)) {
  console.error("❌ 无效域名:", domain);
  isValidPage.value = false;
  await navigateTo(
    `/404?path=${encodeURIComponent(route.path)}`
  );
}

// 获取当前页面内容
const { data: page } = await useAsyncData(
  route.path,
  async () => {
    // 如果没有有效的domain，返回null（用于首页或无效路径）
    if (!domain) {
      console.log("📄 无域名，跳过内容查询");
      return null;
    }

    try {
      // 获取页面内容
      const collectionName = getCollectionName(
        domain,
        locale.value
      );
      console.log(
        "🔍 查询集合:",
        collectionName,
        "路径:",
        contentPath
      );

      const pageData = await queryCollection(collectionName)
        .path(contentPath)
        .first();

      return pageData;
    } catch (error) {
      console.error("❌ 查询页面内容失败:", error);
      return null;
    }
  }
);

// 检查页面是否存在
if (!page.value) {
  console.error("❌ 页面未找到:", contentPath);
  isValidPage.value = false;
  await navigateTo(
    `/404?path=${encodeURIComponent(route.path)}`
  );
}

useSeoMeta({
  title:
    (page.value && "title" in page.value
      ? page.value.title
      : "") || "",
  description:
    (page.value && "description" in page.value
      ? page.value.description
      : "") || "",
});

// 简单的导航数据获取
const { data: navigation } = await useAsyncData(
  `navigation-${domain || "none"}-${currentLang}`,
  async () => {
    if (!domain || domain === "changelog") {
      console.log("📋 跳过导航加载（首页或 changelog）");
      return [];
    }

    // 验证域名有效性
    if (!isValidDomain(domain)) {
      console.log("📋 跳过导航加载（无效域名）");
      return [];
    }

    try {
      const collectionName = getCollectionName(
        domain,
        locale.value
      );

      // 只为页面集合加载导航
      if (!isPageCollection(collectionName)) {
        console.log(
          `📋 跳过数据集合导航: ${collectionName}`
        );
        return [];
      }

      console.log(`📋 加载导航: ${collectionName}`);
      const nav =
        await queryCollectionNavigation(collectionName);
      console.log(
        "✅ 导航加载成功:",
        nav?.length || 0,
        "项: ",
        nav
      );
      return nav || [];
    } catch (error) {
      console.error(`❌ 导航加载失败:`, error);
      return [];
    }
  }
);

// 调试信息
console.log("📊 页面状态:", {
  page: page.value,
  navigation: navigation.value?.length || 0,
});
</script>

<template>
  <div class="docs-layout">
    <!-- 调试信息面板 (开发时显示) -->
    <div class="debug-panel bg-gray-100 p-4 mb-4 text-sm">
      <details>
        <summary class="cursor-pointer font-semibold"
          >🐛 调试信息</summary
        >
        <!-- 调试信息面板 (开发时显示) -->
        <div class="mt-2 space-y-1">
          <div><strong>路由:</strong> {{ route.path }}</div>
          <div
            ><strong>域名:</strong>
            {{ domain || "(首页)" }}</div
          >
          <div
            ><strong>版本:</strong>
            {{ version || "(无)" }}</div
          >
          <div
            ><strong>路径段:</strong>
            {{ pathSegments.join("/") || "(无)" }}</div
          >
          <div
            ><strong>i18n 语言:</strong> {{ locale }} ({{
              normalizeLanguage(locale)
            }})</div
          >
          <div
            ><strong>内容路径:</strong>
            {{ contentPath }}</div
          >
          <div
            ><strong>集合名称:</strong>
            {{
              domain
                ? getCollectionName(domain, locale)
                : "无"
            }}</div
          >
          <div><strong>页面存在:</strong> {{ !!page }}</div>
          <div
            ><strong>导航项数:</strong>
            {{ navigation?.length || 0 }}</div
          >
        </div>
      </details>
    </div>

    <div class="docs-container">
      <!-- 顶部工具栏 -->
      <div class="docs-toolbar col-span-full mb-4">
        <div class="flex justify-between items-center">
          <nav class="breadcrumb">
            <ol
              class="flex items-center space-x-2 text-sm text-gray-500"
            >
              <li
                ><NuxtLink
                  to="/"
                  class="hover:text-gray-700"
                  >首页</NuxtLink
                ></li
              >
              <li v-if="domain">
                <span class="mx-2">/</span>
                <NuxtLink
                  :to="`/${domain}`"
                  class="hover:text-gray-700"
                >
                  {{ domain }}
                </NuxtLink>
              </li>
              <li v-if="version">
                <span class="mx-2">/</span>
                <span>{{ version }}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <!-- 侧边栏导航 -->
      <aside class="docs-sidebar">
        <!-- 导航菜单 -->
        <div v-if="navigation && navigation.length > 0">
          <h3
            class="text-sm font-semibold text-gray-900 mb-2"
            >导航</h3
          >
          <UContentNavigation :navigation="navigation" />
        </div>

        <!-- 无导航时的提示 -->
        <div
          v-else
          class="text-gray-500 text-sm"
        >
          <div v-if="domain">暂无 {{ domain }} 导航</div>
          <div v-else>首页导航</div>
        </div>
      </aside>

      <!-- 主要内容区域 -->
      <main class="docs-main">
        <!-- 内容渲染 -->
        <div
          v-if="page"
          class="docs-content"
        >
          <ContentRenderer :value="page" />
        </div>

        <!-- 首页内容 -->
        <div
          v-else-if="!domain"
          class="home-content"
        >
          <h1 class="text-4xl font-bold text-gray-900 mb-6"
            >文档中心</h1
          >
          <div class="grid md:grid-cols-3 gap-6">
            <NuxtLink
              to="/get-started"
              class="p-6 border rounded-lg hover:shadow-md transition-shadow"
            >
              <h2 class="text-xl font-semibold mb-2"
                >Get Started</h2
              >
              <p class="text-gray-600"
                >快速开始使用我们的服务</p
              >
            </NuxtLink>
            <NuxtLink
              to="/payments"
              class="p-6 border rounded-lg hover:shadow-md transition-shadow"
            >
              <h2 class="text-xl font-semibold mb-2"
                >Payments</h2
              >
              <p class="text-gray-600"
                >支付接口文档和指南</p
              >
            </NuxtLink>
            <NuxtLink
              to="/payouts"
              class="p-6 border rounded-lg hover:shadow-md transition-shadow"
            >
              <h2 class="text-xl font-semibold mb-2"
                >Payouts</h2
              >
              <p class="text-gray-600">转账和提现功能</p>
            </NuxtLink>
          </div>
        </div>

        <!-- 页面未找到 -->
        <div
          v-else
          class="not-found"
        >
          <h1 class="text-2xl font-bold text-gray-900 mb-4"
            >页面未找到</h1
          >
          <p class="text-gray-600 mb-4">
            抱歉，我们找不到您要访问的页面。
          </p>
          <div class="space-y-2 text-sm text-gray-500">
            <div
              >尝试访问的路径:
              <code class="bg-gray-100 px-2 py-1 rounded">{{
                contentPath
              }}</code></div
            >
            <div
              >集合名称:
              <code class="bg-gray-100 px-2 py-1 rounded">{{
                domain
                  ? getCollectionName(domain, locale)
                  : "无"
              }}</code></div
            >
          </div>
          <NuxtLink
            to="/"
            class="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            返回首页
          </NuxtLink>
        </div>
      </main>

      <!-- 右侧目录 -->
      <aside class="docs-toc">
        <div>
          <h3
            class="text-sm font-semibold text-gray-900 mb-2"
            >目录</h3
          >
        </div>
      </aside>
    </div>
  </div>
</template>
