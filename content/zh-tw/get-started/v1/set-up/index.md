---
title: 設置指南
description: 為 Onerway 集成準備您的開發環境
order: 1
showToc: true
showNavigation: true
---

# 設置指南

本指南將引導您設置開發環境並向 Onerway 平台進行第一次 API 調用。

## 前置條件

開始之前，請確保您具備：

- [ ] **API 憑證** - 註冊開發者賬戶
- [ ] **開發環境** - 您偏好的編程語言
- [ ] **HTTPS 支持** - Webhook 端點必需
- [ ] **基礎知識** - 了解 REST API 和 HTTP

## 設置步驟

### 1. 創建您的賬戶

1. 訪問 [Onerway 開發者門戶](https://developers.onerway.com)
2. 註冊免費開發者賬戶
3. 驗證您的郵箱地址
4. 完善您的個人資料信息

### 2. 獲取您的 API 密鑰

1. 導航到 **API 密鑰** 部分
2. 生成您的 **測試模式** 憑證：
   - **可發布密鑰** - 用於前端代碼
   - **私密密鑰** - 用於後端代碼（請保密！）
3. 安全保存這些密鑰

### 3. 環境配置

#### Web 應用程序

```javascript
// 環境變量示例
ONERWAY_PUBLISHABLE_KEY = pk_test_your_key_here;
ONERWAY_SECRET_KEY = sk_test_your_secret_key_here;
ONERWAY_WEBHOOK_SECRET = whsec_your_webhook_secret;
```

#### 移動應用程序

```javascript
// iOS (Swift)
let publishableKey = "pk_test_your_key_here"

// Android (Kotlin)
val publishableKey = "pk_test_your_key_here"
```

### 4. 安裝 SDK（可選）

選擇您偏好的集成方式：

#### JavaScript/Node.js

```bash
npm install @onerway/onerway-js
```

#### Python

```bash
pip install onerway
```

#### PHP

```bash
composer require onerway/onerway-php
```

#### 移動 SDK

- [iOS SDK 文檔](../../../payments/mobile/ios)
- [Android SDK 文檔](../../../payments/mobile/android)

## 快速測試

讓我們進行第一次 API 調用來驗證一切正常：

```javascript
const onerway = require("@onerway/onerway-js")(
  "sk_test_..."
);

// 創建簡單的支付意圖
async function createPayment() {
  try {
    const paymentIntent =
      await onerway.paymentIntents.create({
        amount: 1000, // 10.00 美元，以分為單位
        currency: "usd",
        description: "測試支付"
      });

    console.log("成功！", paymentIntent.id);
  } catch (error) {
    console.error("錯誤：", error.message);
  }
}

createPayment();
```

## 接下來做什麼？

現在您已經完成了所有設置：

1. 📖 [閱讀 API 概覽](./api-overview) - 了解我們的 API 結構
2. 🔧 [環境配置](./environment-config) - 詳細的環境設置
3. 🔒 [安全最佳實踐](./security) - 保持您的集成安全
4. 🚀 [進行首次支付](./first-payment) - 處理真實支付

## 需要幫助？

- 📚 [API 文檔](../../../payments/) - 完整的 API 參考
- 💬
  [開發者支持](mailto:dev-support@onerway.com) - 獲取技術幫助
- 🐛
  [報告問題](https://github.com/onerway/issues) - 錯誤報告和功能請求

準備深入了解？繼續閱讀 [API 概覽](./api-overview)。
