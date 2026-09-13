'use strict';

/**
 * Stripe starter: Payments (Checkout) + Connect (Accounts v2) + Treasury (v2 FA stub)
 * Follows stripe-best-practices: StripeClient, no payment_method_types, Accounts v2, webhooks.
 */

const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const Stripe = require('stripe');

dotenv.config({ path: path.join(__dirname, '.env') });

const {
  STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET,
  PORT = 4242,
  DOMAIN = 'http://localhost:4242',
  PLATFORM_FEE_AMOUNT = '200',
} = process.env;

if (!STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY. Copy .env.example to .env and set your keys.');
  process.exit(1);
}

// Prefer restricted keys (rk_/rkcs_) over full secret keys (sk_).
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2026-07-29.dahlia',
});

const app = express();

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      if (!STRIPE_WEBHOOK_SECRET) {
        // Local fallback only — always verify signatures in real deployments.
        event = JSON.parse(req.body.toString('utf8'));
        console.warn('STRIPE_WEBHOOK_SECRET unset; skipping signature verification');
      } else {
        event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
      }
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Checkout completed:', event.data.object.id);
        break;
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        break;
      case 'account.updated':
        console.log('Connected account updated:', event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/config', (_req, res) => {
  res.json({
    publishableKey: STRIPE_PUBLISHABLE_KEY || null,
    domain: DOMAIN,
    platformFeeAmount: Number(PLATFORM_FEE_AMOUNT),
  });
});

/**
 * Payments: Checkout Session.
 * Omit payment_method_types to use dynamic payment methods.
 * When connectedAccountId is provided, use destination charges (marketplace MoR).
 */
app.post('/api/checkout', async (req, res) => {
  try {
    const { connectedAccountId, productName = 'Demo item', amount = 2000 } = req.body || {};
    const unitAmount = Number(amount);
    const fee = Number(PLATFORM_FEE_AMOUNT);

    if (!Number.isFinite(unitAmount) || unitAmount < 50) {
      return res.status(400).json({ error: 'amount must be at least 50 cents' });
    }
    if (connectedAccountId && fee >= unitAmount) {
      return res.status(400).json({
        error: 'PLATFORM_FEE_AMOUNT must be less than the charge amount',
      });
    }

    const sessionParams = {
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: unitAmount,
            product_data: { name: productName },
          },
        },
      ],
      success_url: `${DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${DOMAIN}/cancel.html`,
      // Tag flows for Dashboard comparison (API 2026-03-25.dahlia+)
      integration_identifier: `starter_checkout_${randomSuffix(8)}`,
    };

    if (connectedAccountId) {
      // Marketplace / destination charges: platform is MoR, fee via application_fee_amount.
      sessionParams.payment_intent_data = {
        application_fee_amount: fee,
        transfer_data: { destination: connectedAccountId },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * Connect: Accounts v2 marketplace defaults (express dashboard, platform fees/losses).
 * Switch to merchant + full dashboard + stripe fee/loss collectors for SaaS / direct charges.
 */
app.post('/api/connect/accounts', async (req, res) => {
  try {
    const { email, displayName = 'Demo seller', country = 'US' } = req.body || {};

    // Accounts v2 — do NOT use type: 'express' | 'custom' | 'standard'
    const account = await stripe.v2.core.accounts.create({
      contact_email: email || undefined,
      display_name: displayName,
      identity: {
        country,
      },
      dashboard: 'express',
      defaults: {
        responsibilities: {
          fees_collector: 'application',
          losses_collector: 'application',
        },
      },
      configuration: {
        recipient: {
          capabilities: {
            stripe_balance: {
              stripe_transfers: { requested: true },
            },
          },
        },
      },
    });

    res.json({
      id: account.id,
      dashboard: account.dashboard,
      readiness: summarizeRecipientReadiness(account),
      account,
    });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({
      error: err.message,
      hint:
        'If Accounts v2 is unavailable on this key, claim your sandbox for full permissions, or check Connect settings in the Dashboard.',
    });
  }
});

app.get('/api/connect/accounts/:id', async (req, res) => {
  try {
    const account = await stripe.v2.core.accounts.retrieve(req.params.id);
    res.json({
      id: account.id,
      readiness: summarizeRecipientReadiness(account),
      account,
    });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

/**
 * Treasury: v2 Financial Accounts via /v2/core/vault/financial_accounts.
 * Requires Treasury for platforms enablement (sales-gated in most regions).
 * Do not use legacy /v1/treasury/financial_accounts for new integrations.
 */
app.post('/api/treasury/financial-accounts', async (req, res) => {
  try {
    const { connectedAccountId, displayName = 'Operating account' } = req.body || {};
    if (!connectedAccountId) {
      return res.status(400).json({ error: 'connectedAccountId is required' });
    }

    // SDK may not yet expose vault.financialAccounts; use rawRequest for the v2 path.
    const financialAccount = await stripe.rawRequest(
      'POST',
      '/v2/core/vault/financial_accounts',
      {
        display_name: displayName,
      },
      {
        additionalHeaders: {
          'Stripe-Account': connectedAccountId,
        },
      }
    );

    res.json({ financialAccount });
  } catch (err) {
    console.error(err);
    res.status(err.statusCode || 500).json({
      error: err.message,
      hint:
        'Treasury for platforms is sales-gated. Contact Stripe sales and confirm v2 Financial Accounts access before relying on this endpoint.',
    });
  }
});

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(Number(PORT), () => {
  console.log(`Stripe starter listening on ${DOMAIN} (port ${PORT})`);
});

function summarizeRecipientReadiness(account) {
  const status =
    account?.configuration?.recipient?.capabilities?.stripe_balance?.stripe_transfers
      ?.status || 'unknown';
  return {
    stripeTransfers: status,
    readyForDestinationCharges: status === 'active',
  };
}

function randomSuffix(len) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let out = '';
  for (let i = 0; i < len; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}
