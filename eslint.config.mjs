import antfu from "@antfu/eslint-config";
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  // Your custom configs here

  // 0. 忽略文件配置
  {
    ignores: [
      ".nuxt/**",
      ".output/**",
      ".data/**",
      "node_modules/**",
      "dist/**",
      "build/**",
      "*.log",
      ".env*",
      ".vscode/**",
      ".idea/**",
      ".DS_Store",
      "Thumbs.db",
    ],
  },

  // 1. 基础 JavaScript 配置
  js.configs.recommended,

  // 2. 全局变量配置
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // 3. TypeScript 配置
  // @ts-expect-error - TypeScript ESLint config compatibility with withNuxt wrapper
  ...tseslint.configs.recommended,

  // 4. Vue 配置
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: { parser: tseslint.parser },
    },
  },

  // 5. Antfu 配置（禁用格式化规则，保留代码质量规则）
  antfu({
    stylistic: false, // 禁用样式规则，让 Prettier 处理格式化
    formatters: {
      css: true,
      html: true,
      markdown: true,
      prettierOptions: false,
    },
    vue: true, // 启用 Vue 支持
    typescript: true, // 启用 TypeScript 支持
    markdown: true, // 启用 Markdown 支持
    json: true, // 启用 JSON 支持
    yaml: true, // 启用 YAML 支持
    jsonc: true, // 启用 JSONC 支持
    json5: true, // 启用 JSON5 支持

    // 其他可能需要调整的 antfu 规则
    rules: {
      "antfu/top-level-function": "off", // 允许箭头函数作为顶级函数
      "format/prettier": "off", // 禁用内置的 Prettier 格式化规则
    },
  }),

  // 6. 自定义规则覆盖（在 antfu 之后，可以覆盖其规则）
  {
    name: "custom-overrides",
    rules: {
      // Vue 相关规则
      "vue/max-attributes-per-line": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
      "vue/html-self-closing": "off",
      "vue/html-indent": "off",
      // 多单词组件名
      "vue/multi-word-component-names": "off",
      // 无用模板属性
      "vue/no-useless-template-attributes": "warn",
      // 块顺序
      "vue/block-order": [
        "warn",
        { order: ["script", "template", "style"] },
      ],
      // 调整 Vue 属性顺序规则
      "vue/attributes-order": [
        "warn",
        {
          order: [
            "DEFINITION",
            "LIST_RENDERING",
            "CONDITIONALS",
            "RENDER_MODIFIERS",
            "GLOBAL",
            "UNIQUE",
            "TWO_WAY_BINDING",
            "OTHER_DIRECTIVES",
            "OTHER_ATTR",
            "EVENTS",
            "CONTENT",
          ],
          alphabetical: false,
        },
      ],
      // 调整第一个属性换行规则
      "vue/first-attribute-linebreak": ["warn"],
      // 允许使用 any
      "@typescript-eslint/no-explicit-any": "warn",

      // 控制台相关规则
      "no-console": ["warn", { allow: ["warn", "error"] }], // 允许所有 console 方法
    },
  },

  // 7. Prettier 配置（最后）
  eslintConfigPrettier
);
