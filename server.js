import "dotenv/config";
import express from "express";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { HTTPFacilitatorClient } from "@x402/core/server";

const app = express();

const {
  FACILITATOR_URL = "https://facilitator.bitcoinsapi.com",
  PAY_TO = "0xe166267c3648b5ca4419f2c58faed8cd4df87d54",
  PRICE = "$0.001",
  NETWORK = "eip155:8453",
  PORT = "3000",
} = process.env;

// Set up the x402 resource server with the Satoshi Facilitator
const facilitatorClient = new HTTPFacilitatorClient({ url: FACILITATOR_URL });
const resourceServer = new x402ResourceServer(facilitatorClient)
  .register(NETWORK, new ExactEvmScheme());

// Apply x402 payment middleware — only protects routes listed here
app.use(
  paymentMiddleware(
    {
      "GET /api/premium": {
        accepts: {
          scheme: "exact",
          price: PRICE,
          network: NETWORK,
          payTo: PAY_TO,
        },
        description: "Premium content — costs 0.001 USDC per request",
      },
    },
    resourceServer,
  ),
);

// Free endpoint — no payment required
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from x402!" });
});

// Paid endpoint — protected by x402 middleware above
app.get("/api/premium", (req, res) => {
  res.json({
    message: "You paid for this content!",
    content: "This is premium data only available to paying users.",
    timestamp: new Date().toISOString(),
  });
});

app.listen(Number(PORT), () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`  Free:    GET /api/hello`);
  console.log(`  Paid:    GET /api/premium (${PRICE} USDC on ${NETWORK})`);
  console.log(`  Facilitator: ${FACILITATOR_URL}`);
});
