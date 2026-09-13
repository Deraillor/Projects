async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || res.statusText);
    err.details = data;
    throw err;
  }
  return data;
}

function show(el, data, isError = false) {
  el.hidden = false;
  el.classList.toggle('error', isError);
  el.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

document.getElementById('account-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const out = document.getElementById('account-out');
  const form = new FormData(event.currentTarget);
  try {
    const data = await postJson('/api/connect/accounts', {
      displayName: form.get('displayName'),
      email: form.get('email') || undefined,
    });
    show(out, data);
    if (data.id) {
      document.getElementById('connected-account-id').value = data.id;
      document.getElementById('treasury-account-id').value = data.id;
    }
  } catch (err) {
    show(out, err.details || { error: err.message }, true);
  }
});

document.getElementById('checkout-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const out = document.getElementById('checkout-out');
  const form = new FormData(event.currentTarget);
  try {
    const data = await postJson('/api/checkout', {
      productName: form.get('productName'),
      amount: Number(form.get('amount')),
      connectedAccountId: form.get('connectedAccountId') || undefined,
    });
    show(out, data);
    if (data.url) {
      window.location = data.url;
    }
  } catch (err) {
    show(out, err.details || { error: err.message }, true);
  }
});

document.getElementById('treasury-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const out = document.getElementById('treasury-out');
  const form = new FormData(event.currentTarget);
  try {
    const data = await postJson('/api/treasury/financial-accounts', {
      connectedAccountId: form.get('connectedAccountId'),
    });
    show(out, data);
  } catch (err) {
    show(out, err.details || { error: err.message }, true);
  }
});
