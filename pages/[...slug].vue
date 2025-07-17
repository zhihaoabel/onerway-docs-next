<script setup lang="ts">
import type { ContentNavigationItem } from "@nuxt/content";

const route = useRoute();
const { t, locale } = useI18n();

// ==================== 路径解析和映射工具函数 ====================

// Helper function to get collection name based on path and locale
const getCollectionName = (
  path: string,
  currentLocale: string
) => {
  const segments = path.split("/").filter(Boolean);
  const domain = segments[0]; // get-started, payments, payouts, etc.

  // Map locale to collection suffix
  const langSuffix = (() => {
    switch (currentLocale) {
      case "zh-CN":
        return "zh_cn";
      case "zh-TW":
        return "zh_tw";
      case "en":
      default:
        return "en";
    }
  })();

  // Special case for changelog
  if (segments.includes("changelog")) {
    return `changelog_${langSuffix}` as const;
  }

  // Map domain to collection name
  const domainMap = {
    "get-started": `get_started_${langSuffix}`,
    payments: `payments_${langSuffix}`,
    payouts: `payouts_${langSuffix}`,
  } as const;

  return (
    domainMap[domain as keyof typeof domainMap] ||
    `get_started_${langSuffix}`
  );
};

// Path mapping utility functions
const mapSimplifiedPath = (
  simplePath: string,
  currentLocale: string,
  version = "v1"
) => {
  // Convert i18n locale to content path locale
  const localeMap = {
    "zh-CN": "zh-cn",
    "zh-TW": "zh-tw",
    en: "en",
  } as const;

  const contentLocale =
    localeMap[currentLocale as keyof typeof localeMap] ||
    "zh-cn";

  // Convert simplified path to actual content path
  // Example: '/get-started' → '/zh-cn/get-started/v1/index'
  // Example: '/get-started/overview' → '/zh-cn/get-started/v1/overview'

  const segments = simplePath.split("/").filter(Boolean);

  if (segments.length === 1) {
    // Single segment like '/get-started' → '/zh-cn/get-started/v1/index'
    return `/${contentLocale}${simplePath}/${version}/`;
  } else {
    // Multiple segments like '/get-started/overview' → '/zh-cn/get-started/v1/overview'
    const [domain, ...subPaths] = segments;
    return `/${contentLocale}/${domain}/${version}/${subPaths.join("/")}`;
  }
};

const isSimplifiedPath = (path: string) => {
  // Check if path is simplified (no language prefix, no version)
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return false;

  // Check if first segment is a language code
  const firstSegment = segments[0];
  const isLanguageCode = ["en", "zh-cn", "zh-tw"].includes(
    firstSegment ?? ""
  );

  // Check if path contains version segment
  const hasVersion = segments.some((segment) =>
    segment.match(/^v\d+/)
  );

  // Simplified path should not have language code or version
  return !isLanguageCode && !hasVersion;
};

// ==================== 导航路径转换系统 ====================

/**
 * 从完整路径中提取模块信息
 * @param fullPath - 完整路径，如 '/zh-cn/get-started/v1/overview'
 * @returns 模块信息对象
 */
const extractModuleInfo = (fullPath: string) => {
  const segments = fullPath.split("/").filter(Boolean);

  if (segments.length < 2) {
    return { module: "", version: "v1", hasModule: false };
  }

  // 判断第一个段是否为语言代码
  const firstSegment = segments[0];
  const isLanguageCode = ["en", "zh-cn", "zh-tw"].includes(
    firstSegment?.toLowerCase() ?? ""
  );

  if (isLanguageCode && segments.length >= 2) {
    // 格式: /zh-cn/get-started/v1/...
    const module = segments[1];
    const versionCandidate = segments[2];
    const version = versionCandidate?.match(/^v\d+/)
      ? versionCandidate
      : "v1";

    return { module, version, hasModule: true };
  } else {
    // 格式: /get-started/v1/... 或 /get-started/...
    const module = firstSegment;
    const versionCandidate = segments[1];
    const version = versionCandidate?.match(/^v\d+/)
      ? versionCandidate
      : "v1";

    return { module, version, hasModule: true };
  }
};

/**
 * 将完整导航路径转换为简化路径
 * @param fullPath - 完整路径，如 '/zh-cn/get-started/v1/2.overview'
 * @returns 简化路径，如 '/get-started/overview'
 */
const transformToSimplifiedPath = (
  fullPath: string
): string => {
  if (!fullPath || fullPath === "/") return fullPath;

  const segments = fullPath.split("/").filter(Boolean);

  if (segments.length === 0) return "/";

  // 检查是否为语言前缀开头的完整路径
  const firstSegment = segments[0];
  const isLanguageCode = ["en", "zh-cn", "zh-tw"].includes(
    firstSegment?.toLowerCase() ?? ""
  );

  if (isLanguageCode && segments.length >= 2) {
    // 处理格式: /zh-cn/get-started/v1/2.overview
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_lang, module, version, ...subPaths] = segments;

    // 移除版本段，保留模块和子路径
    if (version?.match(/^v\d+/) && subPaths.length > 0) {
      // 清理子路径中的排序前缀（如 "2.overview" → "overview"）
      const cleanedSubPaths = subPaths.map((segment) =>
        segment.replace(/^\d+\./, "")
      );
      return `/${module}/${cleanedSubPaths.join("/")}`;
    } else if (subPaths.length > 0) {
      // 没有版本段的情况
      const cleanedSubPaths = subPaths.map((segment) =>
        segment.replace(/^\d+\./, "")
      );
      return `/${module}/${cleanedSubPaths.join("/")}`;
    } else {
      // 只有模块，没有子路径
      return `/${module}`;
    }
  }

  // 已经是简化路径或其他格式，直接返回
  return fullPath;
};

/**
 * 递归转换导航项的路径
 * @param items - 导航项数组
 * @returns 转换后的导航项数组
 */
const transformNavigationPaths = (
  items: ContentNavigationItem[]
): ContentNavigationItem[] => {
  if (!items || !Array.isArray(items)) return [];

  return items.map((item) => {
    const transformedItem = {
      ...item,
    } as ContentNavigationItem;

    // 转换当前项的路径
    if (transformedItem.path) {
      transformedItem.path = transformToSimplifiedPath(
        transformedItem.path ?? ""
      );
    }

    // 递归转换子项
    if (
      transformedItem.children &&
      Array.isArray(transformedItem.children)
    ) {
      transformedItem.children = transformNavigationPaths(
        transformedItem.children
      );
    }

    return transformedItem;
  });
};

// ==================== 页面数据获取 ====================

// Get current page data
const { data: page, error: pageError } = await useAsyncData(
  `${route.path}-${locale.value}`,
  async () => {
    try {
      const collectionName = getCollectionName(
        route.path,
        locale.value
      );

      // Determine the actual content path to query
      let contentPath: string;
      if (isSimplifiedPath(route.path)) {
        // For simplified paths, map to actual content path
        contentPath = mapSimplifiedPath(
          route.path,
          locale.value
        );
      } else {
        // For full paths, check if language in path matches current locale
        // If not, remap to correct language version
        const segments = route.path
          .split("/")
          .filter(Boolean);
        const pathLanguage = segments[0];
        const currentContentLocale = (() => {
          switch (locale.value) {
            case "zh-CN":
              return "zh-cn";
            case "zh-TW":
              return "zh-tw";
            case "en":
              return "en";
            default:
              return "zh-cn";
          }
        })();

        if (pathLanguage !== currentContentLocale) {
          // Path language doesn't match current locale, remap it
          const [, ...remainingSegments] = segments;
          contentPath = `/${currentContentLocale}/${remainingSegments.join("/")}`;
        } else {
          // Path language matches current locale, use as-is
          contentPath = route.path;
        }
      }

      console.log(
        `Querying path: ${contentPath} for route: ${route.path}`,
        `locale: ${locale.value}`
      );

      console.log("collectionName", collectionName);
      console.log("contentPath", contentPath);
      const pageData = await queryCollection(collectionName)
        .path(contentPath)
        .first();
      return pageData;
    } catch (error) {
      console.error("Failed to fetch page content:", error);
      throw createError({
        statusCode: 404,
        statusMessage: "Page Not Found",
        fatal: true,
      });
    }
  },
  {
    watch: [locale],
  }
);

// ==================== 当前模块和版本信息 ====================

// 当前模块信息
const currentModuleInfo = computed(() => {
  return extractModuleInfo(route.path);
});

// Extract version from page data or route
const currentVersion = computed(() => {
  // 1. 优先从页面 frontmatter 获取版本
  if (page.value?.version) {
    return page.value.version;
  }

  // 2. 从路径解析中获取版本
  const moduleInfo = currentModuleInfo.value;
  if (moduleInfo.version && moduleInfo.version !== "v1") {
    return moduleInfo.version;
  }

  // 3. 从路由路径中提取版本 (兼容旧逻辑)
  const segments = route.path.split("/").filter(Boolean);
  const versionSegment = segments.find((segment) =>
    segment.match(/^v\d+/)
  );

  // 4. 默认版本
  return versionSegment || moduleInfo.version || "v1";
});

// ==================== 导航数据获取和处理 ====================

// Get navigation data
const { data: navigation } = await useAsyncData(
  `navigation-${route.path}`,
  async () => {
    try {
      const collectionName = getCollectionName(
        route.path,
        locale.value
      );
      const navigation =
        await queryCollectionNavigation(collectionName);
      console.log(
        navigation,
        "original nav",
        `locale: ${locale.value}`
      );

      // Filter out duplicate and redundant items
      const filterNavigation = (
        items: ContentNavigationItem[]
      ): ContentNavigationItem[] => {
        if (!items) return [];

        const processed: ContentNavigationItem[] = [];

        for (const item of items) {
          // Enhanced language wrapper detection
          // Check for various language wrapper patterns: "En", "Zh", "Zh Cn", "Zh Tw", etc.
          const isLanguageWrapper =
            item.title === "En" ||
            item.title === "Zh" ||
            item.title === "Zh Cn" ||
            item.title === "Zh Tw" ||
            (item.page === false &&
              item.title?.match(/^(En|Zh|Zh\s+(Cn|Tw))$/i));

          if (import.meta.dev) {
            console.log(
              `Processing item: "${item.title}", isLanguageWrapper: ${isLanguageWrapper}, page: ${item.page}`
            );
          }

          // If this is a language wrapper, flatten its children
          if (isLanguageWrapper) {
            if (item.children) {
              processed.push(
                ...filterNavigation(item.children)
              );
            }
            continue;
          }

          // Recursively filter children
          const filteredChildren = item.children
            ? filterNavigation(item.children)
            : undefined;

          // Remove redundant intermediate directories that just duplicate their single child
          if (
            item.page === false &&
            filteredChildren &&
            filteredChildren.length === 1 &&
            item.title === filteredChildren[0]?.title
          ) {
            // Replace this item with its child, but keep the current path if the child has a deeper path
            const child = filteredChildren[0];
            processed.push({
              ...child,
              // Use the more specific path
              path: child.path || item.path,
            });
          } else {
            // Keep the item with filtered children
            processed.push({
              ...item,
              children: filteredChildren,
            });
          }
        }

        return processed;
      };

      // 首先过滤重复和冗余项
      const filteredNav = filterNavigation(
        navigation ?? []
      );

      // 然后转换路径为简化格式
      const transformedNav =
        transformNavigationPaths(filteredNav);

      console.log("Final transformed nav:", transformedNav);

      // 如果转换后的导航为空，返回原始导航
      if (!transformedNav || transformedNav.length === 0) {
        console.log(
          "Transformed nav is empty, returning filtered nav"
        );
        return filteredNav;
      }

      return transformedNav;
    } catch (error) {
      console.error("Failed to fetch navigation:", error);
      return [];
    }
  },
  {
    watch: [locale],
  }
);

// ==================== 计算属性和状态 ====================

// Computed properties for page state
const pageTitle = computed(
  () => page.value?.title || t("docs.meta.defaultTitle")
);

const pageDescription = computed(
  () =>
    page.value?.description ||
    t("docs.meta.defaultDescription")
);

const tocLinks = computed(
  () => page.value?.body?.toc?.links || []
);

const hasNavigation = computed(() => {
  // Check if navigation should be shown based on page config
  const showNav = page.value?.showNavigation ?? true; // default to true
  return (
    showNav &&
    navigation.value &&
    navigation.value.length > 0
  );
});

const hasToc = computed(() => {
  // Check if TOC should be shown based on page config
  const showToc = page.value?.showToc ?? true; // default to true
  return showToc && tocLinks.value.length > 0;
});

// ==================== 面包屑数据构建 ====================

/**
 * 在导航树中根据路径查找导航项
 * @param items - 导航项数组
 * @param targetPath - 目标路径
 * @returns 找到的导航项或 null
 */
const findNavigationItemByPath = (
  items: ContentNavigationItem[],
  targetPath: string
): ContentNavigationItem | null => {
  if (!items || !Array.isArray(items)) return null;

  for (const item of items) {
    // 直接匹配路径
    if (item.path === targetPath) {
      return item;
    }

    // 递归搜索子项
    if (item.children) {
      const found = findNavigationItemByPath(
        item.children,
        targetPath
      );
      if (found) return found;
    }
  }

  return null;
};

/**
 * 构建到指定导航项的完整路径链
 * @param items - 导航项数组
 * @param targetPath - 目标路径
 * @param currentPath - 当前构建的路径
 * @returns 路径链数组
 */
const buildNavigationPath = (
  items: ContentNavigationItem[],
  targetPath: string,
  currentPath: ContentNavigationItem[] = []
): ContentNavigationItem[] => {
  if (!items || !Array.isArray(items)) return [];

  // 收集当前层的所有匹配项
  const currentLevelMatches: {
    item: ContentNavigationItem;
    path: ContentNavigationItem[];
  }[] = [];

  // 递归搜索的结果
  let childResult: ContentNavigationItem[] = [];

  for (const item of items) {
    const newPath = [...currentPath, item];

    // 如果路径匹配，收集到当前层匹配项
    if (item.path === targetPath) {
      currentLevelMatches.push({ item, path: newPath });
    }

    // 递归搜索子项
    if (item.children) {
      const found = buildNavigationPath(
        item.children,
        targetPath,
        newPath
      );
      if (found.length > 0) {
        childResult = found;
      }
    }
  }

  // 优先级：子层的匹配 > 当前层有子项的匹配 > 当前层无子项的匹配
  if (childResult.length > 0) {
    return childResult;
  }

  if (currentLevelMatches.length > 0) {
    // 在当前层的匹配中，优先选择有子项的（更可能是父级节点）
    const withChildren = currentLevelMatches.find(
      (m) => m.item.children && m.item.children.length > 0
    );
    if (withChildren) {
      return withChildren.path;
    }

    // 如果都没有子项，返回第一个
    return currentLevelMatches[0]?.path || [];
  }

  return [];
};

// Breadcrumb data
const breadcrumbs = computed(() => {
  const crumbs = [
    {
      label: t("docs.breadcrumb.home"),
      to: "/",
    },
  ];

  // 如果是首页，只返回首页
  if (route.path === "/") {
    return crumbs;
  }

  // 如果没有导航数据，使用简单的路径段作为回退
  if (!navigation.value || navigation.value.length === 0) {
    const segments = route.path.split("/").filter(Boolean);
    let path = "";
    segments.forEach((segment, index) => {
      path += `/${segment}`;
      if (index < segments.length - 1) {
        crumbs.push({
          label: segment,
          to: path,
        });
      }
    });
    return crumbs;
  }

  // 使用导航数据构建面包屑
  const navigationPath = buildNavigationPath(
    navigation.value,
    route.path
  );

  console.log("navigationPath", navigationPath);
  if (navigationPath.length > 0) {
    // 构建面包屑链，排除最后一项（当前页面）
    for (let i = 0; i < navigationPath.length - 1; i++) {
      const item = navigationPath[i];
      if (item?.path && item?.title) {
        crumbs.push({
          label: item.title,
          to: item.path,
        });
      }
    }
  } else {
    // 如果在导航中找不到当前路径，尝试查找父级路径
    const segments = route.path.split("/").filter(Boolean);
    let currentPath = "";

    for (let i = 0; i < segments.length - 1; i++) {
      currentPath += `/${segments[i]}`;
      const navItem = findNavigationItemByPath(
        navigation.value,
        currentPath
      );

      if (navItem && navItem.title) {
        crumbs.push({
          label: navItem.title,
          to: currentPath,
        });
      } else {
        // 如果找不到对应的导航项，使用路径段作为标签
        crumbs.push({
          label: segments[i] ?? "",
          to: currentPath,
        });
      }
    }
  }

  return crumbs;
});

// SEO meta
useSeoMeta({
  title: pageTitle,
  description: pageDescription,
});

// Home page sections data
const homeSections = computed(() => [
  {
    title: t("docs.sections.getStarted.title"),
    description: t("docs.sections.getStarted.description"),
    to: "/get-started",
  },
  {
    title: t("docs.sections.payments.title"),
    description: t("docs.sections.payments.description"),
    to: "/payments",
  },
  {
    title: t("docs.sections.payouts.title"),
    description: t("docs.sections.payouts.description"),
    to: "/payouts",
  },
]);

// Check if we're on the home page
const isHomePage = computed(() => route.path === "/");
</script>

<template>
  <UPage>
    <!-- Left sidebar navigation -->
    <template #left>
      <UPageAside
        v-if="hasNavigation"
        :aria-label="t('docs.navigation.title')">
        <UContentNavigation
          color="primary"
          :navigation="navigation || []" />
      </UPageAside>
    </template>

    <!-- Main content area -->
    <UPageBody>
      <div class="space-y-6">
        <!-- Breadcrumb navigation -->
        <nav
          v-if="!isHomePage"
          :aria-label="t('docs.breadcrumb.ariaLabel')"
          class="flex items-center justify-between">
          <div
            class="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <template
              v-for="(crumb, index) in breadcrumbs"
              :key="crumb.to">
              <NuxtLink
                v-if="index < breadcrumbs.length - 1"
                :to="crumb.to"
                class="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                {{ crumb.label }}
              </NuxtLink>
              <span
                v-else
                class="font-medium text-gray-900 dark:text-gray-100">
                {{ page?.title || crumb.label }}
              </span>
              <span
                v-if="index < breadcrumbs.length - 1"
                class="mx-2"
                aria-hidden="true">
                /
              </span>
            </template>
          </div>

          <!-- Version badge -->
          <UBadge
            v-if="currentVersion"
            :label="currentVersion"
            color="primary"
            variant="soft"
            size="sm" />
        </nav>

        <!-- Page content -->
        <div
          class="prose prose-primary dark:prose-invert max-w-none">
          <!-- Home page content -->
          <div
            v-if="isHomePage"
            class="space-y-12">
            <div class="text-center space-y-4">
              <h1
                class="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {{ t("docs.meta.defaultTitle") }}
              </h1>
              <p
                class="text-xl text-gray-600 dark:text-gray-400">
                {{ t("docs.meta.defaultDescription") }}
              </p>
            </div>

            <!-- Home sections grid -->
            <div class="grid md:grid-cols-3 gap-6">
              <UCard
                v-for="section in homeSections"
                :key="section.to"
                :to="section.to"
                class="hover:shadow-lg transition-shadow cursor-pointer">
                <template #header>
                  <h2
                    class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {{ section.title }}
                  </h2>
                </template>

                <p class="text-gray-600 dark:text-gray-400">
                  {{ section.description }}
                </p>
              </UCard>
            </div>
          </div>

          <!-- Regular page content -->
          <div v-else-if="page && !pageError">
            <ContentRenderer :value="page" />
          </div>

          <!-- Page not found -->
          <div
            v-else
            class="text-center space-y-6">
            <div class="space-y-4">
              <h1
                class="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {{ t("docs.content.notFound") }}
              </h1>
              <p
                class="text-lg text-gray-600 dark:text-gray-400">
                {{ t("docs.content.notFoundDescription") }}
              </p>
            </div>

            <div
              class="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <div>
                {{ t("docs.content.tryingToAccess") }}:
                <code
                  class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded font-mono">
                  {{ route.path }}
                </code>
              </div>
            </div>

            <UButton
              to="/"
              variant="solid"
              color="primary"
              size="lg">
              {{ t("docs.content.backToHome") }}
            </UButton>
          </div>
        </div>
      </div>
    </UPageBody>

    <!-- Right sidebar TOC -->
    <template #right>
      <UPageAside
        v-if="hasToc && !isHomePage"
        :aria-label="t('toc.title')">
        <UContentToc
          highlight
          highlight-color="primary"
          color="primary"
          :links="tocLinks" />
      </UPageAside>
    </template>
  </UPage>
</template>
