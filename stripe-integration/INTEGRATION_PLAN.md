# Stripe integration plan

**Products:** Payments · Connect · Treasury  
**Generated:** 2026-09-13 (fallback plan — `stripe_implementation_planner` requires Stripe MCP auth in Cursor Desktop)  
**API version:** latest (`2026-07-29.dahlia` or newer SDK default)  
**SDK:** Node.js `stripe` (latest)

---

## Status checklist

| Step | Status |
| --- | --- |
| Stripe plugin / skills | Installed (plugin skills + `npx skills add https://docs.stripe.com`) |
| Stripe MCP (`https://mcp.stripe.com`) | Configured but **needs OAuth in Cursor Desktop** |
| `stripe_implementation_planner` | Unavailable in Cloud Agent until MCP is authenticated |
| Existing integration in repo | None found |
| Sandbox for development | Provisioned (claimable; expires 2026-09-20) |

**Action for you:** In Cursor Desktop, open MCP settings, authenticate the Stripe server, then re-run planning with `stripe_implementation_planner` for a plan tailored to your exact business. Until then, use this best-practices plan.

---

## Decision you still need to make: marketplace vs SaaS

Connect configuration depends on who owns the customer relationship:

| | **Marketplace** (default in this starter) | **SaaS platform** |
| --- | --- | --- |
| Who is merchant of record | Platform | Connected account |
| Charge pattern | Destination charges (or separate charges & transfers) | Direct charges |
| Dashboard | `express` | `full` |
| Fees / losses | `fees_collector: "application"`, `losses_collector: "application"` | `fees_collector: "stripe"`, `losses_collector: "stripe"` |
| Account config | `configuration.recipient` + `stripe_transfers` | `configuration.merchant` + `card_payments` |
| Fee collection | `application_fee_amount` on Checkout / PaymentIntent | `application_fee_amount` on connected-account charge |

Reply with your business type (or a URL) to lock this in. If you need hold-and-release or multi-seller carts, use **separate charges and transfers** instead of destination charges (and never use `application_fee_amount` with that pattern).

---

## Recommended architecture

```
Buyer checkout ──► Checkout Sessions (Payments)
                      │
                      ├─ destination_charge → platform MoR + transfer to connected account
                      └─ webhooks: checkout.session.completed, payment_intent.*, account.*

Seller onboarding ──► Accounts v2 + embedded components
                      (account_onboarding, notification_banner, account_management)

Stored funds ──► v2 Financial Accounts (Treasury for platforms)
                      (requires Stripe sales enablement for your region)
```

### 1. Payments

- Use **Checkout Sessions** for on-session payments (hosted or embedded). Prefer Checkout over raw PaymentIntents unless you need custom off-session/state modeling.
- Omit `payment_method_types` — enable [dynamic payment methods](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods) from the Dashboard.
- Confirm payment status via **webhooks**, not only the redirect return.
- Prefer a [restricted API key (RAK)](https://docs.stripe.com/keys/restricted-api-keys) over a full secret key.
- Use `StripeClient` instance methods (not global `stripe.api_key = …`).

### 2. Connect (Accounts v2)

- Create connected accounts with **`POST /v2/core/accounts`** — never `type: express|custom|standard`.
- Default onboarding: **embedded** `account_onboarding` + always include `notification_banner`.
- Before charging/transferring, check **v2 capability status** (not deprecated `charges_enabled` / `payouts_enabled`):
  - Marketplace: `configuration.recipient.capabilities.stripe_balance.stripe_transfers.status === 'active'`
  - SaaS: `configuration.merchant.capabilities.card_payments.status === 'active'`
- Monitor Connect webhooks: `v2.core.account[…]`, capability updates, payout failures.

### 3. Treasury (Financial Accounts)

- Use **v2 Financial Accounts** (`POST /v2/core/vault/financial_accounts`) for new builds — not legacy `/v1/treasury/financial_accounts`.
- Treasury for platforms is **sales-gated** in most regions ([overview](https://docs.stripe.com/treasury/connect)). Contact Stripe sales before depending on it in production.
- Typical flow: connected account → financial account → inbound from payments / outbound payouts & transfers.
- Keep money-movement paths idempotent and webhook-driven.

---

## Implementation phases

### Phase 0 — Access & keys (now)

1. Claim the sandbox (see claim URL in the PR summary / local CLI config).
2. Copy `stripe-integration/.env.example` → `.env` and set keys.
3. Authenticate Stripe MCP in Desktop for planner + live API tools.
4. Request Treasury for platforms access if you need Financial Accounts in test/live.

### Phase 1 — Payments baseline

1. Create Product/Price (or pass `price_data` in Checkout).
2. `checkout.sessions.create` with success/cancel URLs.
3. Webhook endpoint verifying `Stripe-Signature`.
4. Success page that reconciles via webhook, not query params alone.

### Phase 2 — Connect onboarding + destination charges

1. Create Accounts v2 with marketplace (or SaaS) dimensions.
2. Embed onboarding + notification banner.
3. Create Checkout with `payment_intent_data.application_fee_amount` + `transfer_data.destination` (marketplace).
4. Gate checkout on recipient transfer capability.

### Phase 3 — Treasury

1. After sales enablement, create v2 financial accounts for connected accounts.
2. Wire funding from Connect balances / inbound transfers.
3. Add outbound payment / transfer flows with confirmation where required.
4. Optionally embed finance UI components when available in your region.

### Phase 4 — Harden & go live

1. RAKs + access policies; secrets in a vault (not committed `.env`).
2. Webhook allowlisting / signature verification in all environments.
3. [Go-live checklist](https://docs.stripe.com/get-started/checklist/go-live).
4. Margin monitoring if the platform pays Stripe fees ([pricing](https://stripe.com/pricing), [margin reports](https://docs.stripe.com/connect/margin-reports)).

---

## Security defaults baked into the starter

- Keys loaded from environment only
- Webhook signature verification
- No `payment_method_types` hardcoding
- Accounts v2 (no legacy account `type`)
- Comments marking Treasury as sales-gated

---

## What to do next

1. **Claim the sandbox** and confirm Checkout works locally (`npm run stripe:dev`).
2. **Tell me your business model** (marketplace vs SaaS, fee %, hold-and-release?) so we can finalize Connect fields.
3. **Authenticate Stripe MCP in Desktop** and re-run `stripe_implementation_planner` for a product-guided plan.
4. Say **“build Phase 2”** (or SaaS instead of marketplace) when you want the next code increment.
