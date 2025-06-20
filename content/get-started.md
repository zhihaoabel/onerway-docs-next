---
title: 快速开始
description: 了解如何快速开始使用 Onerway 支付服务
navigation:
  title: 快速开始
  order: 1
---

# 快速开始

欢迎使用 Onerway 支付服务！本指南将帮助您快速了解和集成我们的支付解决方案。

## 概述

Onerway 提供全面的支付解决方案，包括：

- **在线支付**：支持多种支付方式的在线支付网关
- **移动支付**：移动端优化的支付体验
- **收单服务**：完整的商户收单解决方案
- **API 服务**：灵活的 API 接口，支持自定义集成

## 开始之前

在开始集成之前，您需要：

1. 注册 Onerway 商户账户
2. 获取 API 密钥
3. 了解基本的支付流程

## 第一步：注册账户

访问 [Onerway 商户平台](https://merchant.onerway.com)
注册您的商户账户。

## 第二步：获取 API 密钥

登录商户平台后，在开发者设置中获取您的 API 密钥：

- **公钥**：用于客户端调用
- **私钥**：用于服务端调用（请妥善保管）

## 第三步：集成支付

选择适合您的集成方式：

### 快速集成

使用我们的 SDK 快速集成：

```javascript
import { OnerWaySDK } from "@onerway/sdk";

const sdk = new OnerWaySDK({
  apiKey: "your-api-key",
  environment: "sandbox", // 或 'production'
});
```

### API 集成

直接调用我们的 REST API：

```bash
curl -X POST https://api.onerway.com/v1/payments \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "currency": "CNY",
    "description": "测试支付"
  }'
```

## 下一步

- 查看 [API 文档](/api) 了解详细的接口说明
- 阅读 [集成指南](/guides) 获取更多集成示例
- 了解 [支付产品](/payment) 的详细功能

## 需要帮助？

如果您在集成过程中遇到问题，可以：

- 查看我们的 [常见问题](/help/faq)
- 联系 [技术支持](/contact)
- 加入我们的 [开发者社区](/community)
