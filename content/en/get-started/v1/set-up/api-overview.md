---
title: API Overview
description:
  Understanding Onerway's API structure and core concepts
order: 2
showToc: true
showNavigation: true
---

# API Overview

Learn about Onerway's REST API structure, core concepts, and
how to work with our endpoints effectively.

## API Architecture

### RESTful Design

Our API follows REST principles with predictable
resource-oriented URLs, standard HTTP methods, and JSON
responses.

```
Base URL: https://api.onerway.com/v1/
```

### HTTP Methods

- **GET** - Retrieve resources
- **POST** - Create new resources
- **PUT** - Update existing resources
- **DELETE** - Remove resources

### Response Format

All API responses are in JSON format:

```json
{
  "id": "pi_1234567890",
  "object": "payment_intent",
  "status": "succeeded",
  "amount": 1000,
  "currency": "usd",
  "created": 1640995200
}
```

## Core Resources

### Payment Intents

The primary object for processing payments:

```javascript
// Create a payment intent
const paymentIntent = await onerway.paymentIntents.create({
  amount: 2000,
  currency: "usd",
  description: "Purchase from Example Store",
});
```

### Customers

Store customer information for recurring payments:

```javascript
// Create a customer
const customer = await onerway.customers.create({
  email: "customer@example.com",
  name: "John Doe",
});
```

### Payment Methods

Represent different ways customers can pay:

```javascript
// Create a payment method
const paymentMethod = await onerway.paymentMethods.create({
  type: "card",
  card: {
    number: "4242424242424242",
    exp_month: 12,
    exp_year: 2025,
    cvc: "123",
  },
});
```

## Authentication

### API Keys

Use your secret key for server-side requests:

```bash
curl https://api.onerway.com/v1/payment_intents \
  -H "Authorization: Bearer sk_test_your_secret_key"
```

### Publishable Keys

Use your publishable key for client-side code:

```javascript
const onerway = Onerway("pk_test_your_publishable_key");
```

## Error Handling

Our API uses standard HTTP status codes and returns detailed
error information:

```json
{
  "error": {
    "type": "card_error",
    "code": "card_declined",
    "message": "Your card was declined.",
    "decline_code": "insufficient_funds"
  }
}
```

### Common Status Codes

- **200** - Success
- **400** - Bad Request
- **401** - Unauthorized
- **402** - Payment Required
- **404** - Not Found
- **500** - Server Error

## Pagination

List endpoints support pagination:

```javascript
// Retrieve payments with pagination
const payments = await onerway.paymentIntents.list({
  limit: 10,
  starting_after: "pi_1234567890",
});
```

## Webhooks

Get notified about events in your account:

```javascript
// Handle webhook events
app.post("/webhook", (req, res) => {
  const event = req.body;

  switch (event.type) {
    case "payment_intent.succeeded":
      console.log("Payment succeeded!", event.data.object);
      break;
    default:
      console.log("Unhandled event type:", event.type);
  }

  res.status(200).send("OK");
});
```

## Rate Limiting

Our API has rate limits to ensure service stability:

- **Test Mode**: 100 requests per second
- **Live Mode**: 1000 requests per second

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1640995260
```

## Next Steps

Ready to configure your environment? Continue to:

- [Environment Configuration](./environment-config) -
  Detailed setup guide
- [Security Best Practices](./security) - Keep your
  integration secure
