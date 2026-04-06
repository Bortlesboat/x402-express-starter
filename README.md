# x402 Express Starter

Minimal Express.js server with [x402](https://github.com/coinbase/x402) payments using the Satoshi Facilitator.

One free endpoint, one paid endpoint. Under 50 lines of code.

## Setup

```bash
npm install
cp .env.example .env   # edit .env to set your own PAY_TO address
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

**Paid endpoint (no payment — returns 402):**

```bash
curl -i http://localhost:3000/api/premium
# HTTP/1.1 402 Payment Required
# Body contains payment requirements (facilitator URL, price, network)
```

**Paid endpoint (with payment):**

The x402 flow works like this:
1. Client hits the paid endpoint and gets a 402 response with payment instructions
2. Client sends payment to the facilitator
3. Client retries the request with the payment proof header
4. Server verifies payment via the facilitator and serves the content

Any x402-compatible client (like `@x402/client`) handles this automatically.

## Configuration

All config is in `.env` (see `.env.example`):

| Variable | Default | Description |
|---|---|---|
| `FACILITATOR_URL` | Satoshi Facilitator | x402 facilitator that verifies payments |
| `PAY_TO` | — | Your wallet address (receives USDC on Base) |
| `PRICE` | `$0.001` | Price per request in USD |
| `NETWORK` | `eip155:8453` | Base mainnet |
| `PORT` | `3000` | Server port |

## How It Works

This uses the official `@x402/express` middleware. The middleware intercepts requests to protected routes, returns a 402 with payment requirements if no valid payment header is present, and verifies payments through the configured facilitator before allowing access.

## Links

- [x402 Protocol](https://github.com/coinbase/x402)
- [x402 Documentation](https://x402.org)
- [Satoshi Facilitator](https://x402-facilitator.happysmoke-e4fd0a77.eastus.azurecontainerapps.io)
