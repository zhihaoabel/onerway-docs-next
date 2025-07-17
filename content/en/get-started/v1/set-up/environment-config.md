---
title: Environment Configuration
description:
  Detailed guide for setting up your development environment
order: 3
showToc: true
showNavigation: true
---

# Environment Configuration

Configure your development environment properly to ensure
smooth integration with Onerway's payment platform.

## Environment Variables

### Required Variables

Set these environment variables in your application:

```bash
# API Credentials
ONERWAY_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
ONERWAY_SECRET_KEY=sk_test_your_secret_key_here

# Webhook Configuration
ONERWAY_WEBHOOK_SECRET=whsec_your_webhook_secret_here
ONERWAY_WEBHOOK_URL=https://yourdomain.com/webhook

# Application Settings
NODE_ENV=development
PORT=3000
```

### Optional Variables

```bash
# Logging
LOG_LEVEL=debug

# Database (if using)
DATABASE_URL=postgresql://user:pass@localhost:5432/your_db

# SSL Configuration (for production)
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

## Framework-Specific Setup

### Node.js with Express

```javascript
// app.js
require("dotenv").config();
const express = require("express");
const onerway = require("@onerway/onerway-js")(
  process.env.ONERWAY_SECRET_KEY
);

const app = express();

// Middleware
app.use(express.json());

// Payment endpoint
app.post("/create-payment", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent =
      await onerway.paymentIntents.create({
        amount,
        currency,
        description: "Payment from your app",
      });

    res.json({
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3000);
```

### React.js Frontend

```javascript
// PaymentForm.jsx
import { useState } from "react";
import { loadOnerway } from "@onerway/onerway-js";

const onerway = loadOnerway(
  process.env.REACT_APP_ONERWAY_PUBLISHABLE_KEY
);

function PaymentForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Create payment intent on your server
      const response = await fetch("/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: 1000,
          currency: "usd",
        }),
      });

      const { client_secret } = await response.json();

      // Confirm payment with Onerway
      const result = await onerway.confirmPayment({
        elements, // Your payment elements
        confirmParams: {
          return_url: "https://yoursite.com/success",
        },
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Payment form elements */}
      <button disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
```

### Python with Flask

```python
# app.py
import os
from flask import Flask, request, jsonify
import onerway

app = Flask(__name__)
onerway.api_key = os.environ['ONERWAY_SECRET_KEY']

@app.route('/create-payment', methods=['POST'])
def create_payment():
    try:
        data = request.get_json()

        payment_intent = onerway.PaymentIntent.create(
            amount=data['amount'],
            currency=data['currency'],
            description='Payment from Flask app'
        )

        return jsonify({'client_secret': payment_intent.client_secret})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=os.environ.get('PORT', 3000))
```

### PHP with Laravel

```php
<?php
// config/services.php
return [
    'onerway' => [
        'secret' => env('ONERWAY_SECRET_KEY'),
        'public' => env('ONERWAY_PUBLISHABLE_KEY'),
    ],
];

// app/Http/Controllers/PaymentController.php
use Onerway\Onerway;

class PaymentController extends Controller
{
    public function createPayment(Request $request)
    {
        Onerway::setApiKey(config('services.onerway.secret'));

        try {
            $paymentIntent = \Onerway\PaymentIntent::create([
                'amount' => $request->amount,
                'currency' => $request->currency,
                'description' => 'Payment from Laravel app',
            ]);

            return response()->json([
                'client_secret' => $paymentIntent->client_secret
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
```

## Development vs Production

### Test Mode Configuration

```javascript
// Development environment
const onerway = require("@onerway/onerway-js")(
  process.env.NODE_ENV === "production"
    ? process.env.ONERWAY_LIVE_SECRET_KEY
    : process.env.ONERWAY_TEST_SECRET_KEY
);
```

### Production Checklist

Before going live:

- [ ] Replace test API keys with live keys
- [ ] Enable HTTPS on all endpoints
- [ ] Set up proper error logging
- [ ] Configure webhook endpoints
- [ ] Test with real payment methods
- [ ] Set up monitoring and alerts

## Docker Configuration

### Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - ONERWAY_SECRET_KEY=${ONERWAY_SECRET_KEY}
      - ONERWAY_PUBLISHABLE_KEY=${ONERWAY_PUBLISHABLE_KEY}
    volumes:
      - .:/app
      - /app/node_modules
```

## Next Steps

Environment configured? Great! Now learn about:

- [Security Best Practices](./security) - Protect your
  integration
- [Making Your First Payment](./first-payment) - Process a
  test payment
