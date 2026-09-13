# Stripe starter (Payments + Connect + Treasury)

**Status: archived / paused** — no near-term need to take customer payments. Code and plan are kept for later.

Minimal Express app implementing the [integration plan](./INTEGRATION_PLAN.md).

## Prerequisites

1. Claim your sandbox (Cloud Agent provisioned a claimable sandbox — see PR summary).
2. Copy env file and set keys:

```bash
cp stripe-integration/.env.example stripe-integration/.env
```

3. From the repo root:

```bash
npm install
npm run stripe:dev
```

4. In another terminal, forward webhooks:

```bash
npm run stripe:listen
```

Paste the webhook signing secret into `.env` as `STRIPE_WEBHOOK_SECRET`.

Open http://localhost:4242

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/` | Demo UI |
| POST | `/api/checkout` | Create Checkout Session (optional connected account) |
| POST | `/api/connect/accounts` | Create Accounts v2 connected account (marketplace defaults) |
| GET | `/api/connect/accounts/:id` | Retrieve account + capability readiness |
| POST | `/api/treasury/financial-accounts` | Create v2 financial account (requires Treasury access) |
| POST | `/webhook` | Stripe webhooks |

## Notes

- Default Connect path is **marketplace / destination charges**. Change to SaaS / direct charges if sellers own the customer relationship.
- Treasury calls will fail until Stripe enables Treasury for platforms on your account.
