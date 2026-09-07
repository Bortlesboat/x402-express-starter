# x402 Express Starter

Minimal Express.js server with [x402](https://github.com/coinbase/x402) payments through your configured facilitator.

One free endpoint, one paid endpoint.

## Setup

`FACILITATOR_URL` and `PAY_TO` are required. Set an operating x402 facilitator that supports your chosen network and your own receiving wallet. Missing, empty, or whitespace-only values stop startup with a named configuration error. Surrounding whitespace is trimmed.

The previously advertised Satoshi Facilitator is paused. These templates no longer default to it or to an example recipient.

```bash
npm install
cp .env.example .env   # edit both FACILITATOR_URL and PAY_TO
npm start
```

## Endpoints

| Endpoint | Cost | Description |
|---|---|---|
| `GET /api/hello` | Free | Returns a greeting |
| `GET /api/premium` | 0.001 USDC | Returns premium content (402 if unpaid) |

## Usage

**Free endpoint:**

```bash
curl http://localhost:3000/api/hello
# {"message":"Hello from x402!"}
```

**Paid endpoint (no payment â€” returns 402):**

```bash
curl -i http://localhost:3000/api/premium
# HTTP/1.1 402 Payment Required
# PAYMENT-REQUIRED header contains base64-encoded payment requirements
```

**Paid endpoint (with payment):**

An x402 v2 client reads the `PAYMENT-REQUIRED` header, signs a payment authorization, and retries with `PAYMENT-SIGNATURE`. The middleware verifies and settles through the configured facilitator before returning a successful paid response. Use an official x402 client to handle this flow.

## Configuration

All config is in `.env` (see `.env.example`):

| Variable | Default | Description |
|---|---|---|
| `FACILITATOR_URL` | Required, no default | Operating x402 facilitator endpoint |
| `PAY_TO` | Required, no default | Your receiving wallet address |
| `PRICE` | `$0.001` | Price per request in USD |
| `NETWORK` | `eip155:8453` | Base mainnet |
| `PORT` | `3000` | Server port |

## How It Works

This uses the official `@x402/express` middleware. The middleware intercepts requests to protected routes, returns a 402 with payment requirements if no valid payment header is present, and verifies payments through the configured facilitator before allowing access.

## Tests

The tests use a local facilitator fixture and a dummy recipient. They verify configuration errors, the free 200 response, and an unpaid 402 response containing the configured recipient, amount, and network. They do not sign, verify, or settle a payment.

```bash
npm test
```

## Links

- [x402 Protocol](https://github.com/coinbase/x402)
- [x402 Documentation](https://x402.org)
- [Satoshi Facilitator source (hosted service paused)](https://github.com/Bortlesboat/x402-facilitator)
