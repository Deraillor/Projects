import {
  AIRLINES,
  FLEET_LABELS,
  SEAT_LABELS,
  ANNUAL_RANGES_2026,
  calculatePay,
} from './data.js';

const fmt = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);

const fmtHourly = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);

function getInputs() {
  return {
    airline: document.getElementById('airline').value,
    seat: document.getElementById('seat').value,
    year: parseInt(document.getElementById('year').value, 10),
    fleet: document.getElementById('fleet').value,
    monthlyHours: parseInt(document.getElementById('monthlyHours').value, 10),
    perDiemDom: parseInt(document.getElementById('perDiemDom').value, 10),
    perDiemIntl: parseInt(document.getElementById('perDiemIntl').value, 10),
  };
}

function renderAirlineCard(airlineKey, inputs, allPays) {
  const airline = AIRLINES[airlineKey];
  const pay = calculatePay(
    airline,
    inputs.seat,
    inputs.fleet,
    inputs.year,
    inputs.monthlyHours,
    inputs.perDiemDom,
    inputs.perDiemIntl
  );
  allPays[airlineKey] = pay;

  const isHighlight = inputs.airline === airlineKey;
  const range = ANNUAL_RANGES_2026[airlineKey][inputs.seat];
  const rangePct = Math.min(
    100,
    Math.max(0, ((pay.annualBase - range.min) / (range.max - range.min)) * 100)
  );

  const card = document.createElement('article');
  card.className = `airline-card${isHighlight ? ' highlight' : ''}`;
  card.innerHTML = `
    <div class="airline-card-header">
      <h2>
        <span class="airline-badge" style="background:${airline.color}">${airline.code}</span>
        ${airline.name}
      </h2>
    </div>
    <div class="airline-card-body">
      <div class="pay-hero">
        <div class="hourly">${fmtHourly(pay.hourly)} <span>/ hr</span></div>
        <div class="monthly">${fmt(pay.monthlyBase)}/mo base</div>
        <div class="annual">${fmt(pay.annualBase)}/yr at ${inputs.monthlyHours} hrs/mo</div>
      </div>
      <div class="stat-rows">
        <div class="stat-row">
          <span class="label">Monthly guarantee floor</span>
          <span class="value">${fmt(pay.guaranteePay)}/mo (${airline.monthlyGuarantee} hrs)</span>
        </div>
        <div class="stat-row">
          <span class="label">Per diem (est.)</span>
          <span class="value">${fmt(pay.monthlyPerDiem)}/mo · ${fmt(pay.annualPerDiem)}/yr</span>
        </div>
        <div class="stat-row">
          <span class="label">Intl override (est.)</span>
          <span class="value">${fmt(pay.monthlyIntlOverride)}/mo</span>
        </div>
        <div class="stat-row">
          <span class="label">401(k) employer (${(airline.retirement401k * 100).toFixed(0)}%)</span>
          <span class="value">${fmt(pay.annual401k)}/yr</span>
        </div>
        <div class="stat-row total">
          <span class="label">Est. total package</span>
          <span class="value">${fmt(pay.totalCompEstimate)}/yr</span>
        </div>
      </div>
      <div class="range-bar">
        <label>2026 ${SEAT_LABELS[inputs.seat]} annual range</label>
        <div class="range-track">
          <div class="range-fill" style="width:${rangePct}%"></div>
        </div>
        <div class="range-labels">
          <span>${fmt(range.min)}</span>
          <span>You: ${fmt(pay.annualBase)}</span>
          <span>${fmt(range.max)}</span>
        </div>
      </div>
    </div>
  `;
  return card;
}

function renderComparison() {
  const inputs = getInputs();
  const grid = document.getElementById('comparisonGrid');
  grid.innerHTML = '';
  const allPays = {};

  ['united', 'american', 'delta'].forEach((key) => {
    grid.appendChild(renderAirlineCard(key, inputs, allPays));
  });

  highlightBestValues(allPays);
  renderPayTable(inputs);
}

function highlightBestValues(allPays) {
  const keys = Object.keys(allPays);
  const best = {
    hourly: Math.max(...keys.map((k) => allPays[k].hourly)),
    annualBase: Math.max(...keys.map((k) => allPays[k].annualBase)),
    totalComp: Math.max(...keys.map((k) => allPays[k].totalCompEstimate)),
  };

  document.querySelectorAll('.airline-card').forEach((card, i) => {
    const key = ['united', 'american', 'delta'][i];
    const pay = allPays[key];
    const hero = card.querySelector('.pay-hero');
    if (pay.hourly === best.hourly) hero.querySelector('.hourly').classList.add('best');
    if (pay.annualBase === best.annualBase) hero.querySelector('.monthly').classList.add('best');
    if (pay.totalComp === best.totalComp) {
      card.querySelector('.stat-row.total .value').classList.add('best');
    }
  });
}

function renderPayTable(inputs) {
  const tbody = document.getElementById('payTableBody');
  tbody.innerHTML = '';

  for (let y = 1; y <= 12; y++) {
    const tr = document.createElement('tr');
    if (y === inputs.year) tr.classList.add('active-row');

    const rates = ['united', 'american', 'delta'].map((key) =>
      calculatePay(
        AIRLINES[key],
        inputs.seat,
        inputs.fleet,
        y,
        inputs.monthlyHours,
        inputs.perDiemDom,
        inputs.perDiemIntl
      )
    );

    const bestHourly = Math.max(...rates.map((r) => r.hourly));

    tr.innerHTML = `
      <td>Year ${y}</td>
      ${rates
        .map(
          (r, i) =>
            `<td class="${r.hourly === bestHourly ? 'best' : ''}">${fmtHourly(r.hourly)}</td>`
        )
        .join('')}
      ${rates.map((r) => `<td>${fmt(r.annualBase)}</td>`).join('')}
    `;
    tbody.appendChild(tr);
  }
}

function renderBenefits() {
  const section = document.getElementById('benefitsSection');
  section.innerHTML = '';

  Object.values(AIRLINES).forEach((airline) => {
    const card = document.createElement('div');
    card.className = 'benefits-card';
    card.innerHTML = `
      <h3>
        <span class="airline-badge" style="background:${airline.color}">${airline.code}</span>
        ${airline.name}
      </h3>
      <p style="font-size:0.85rem;color:var(--text-muted);margin:0 0 0.75rem">
        ${airline.union} · Contract amendable ${airline.contractAmendable}<br>
        Per diem: ${fmtHourly(airline.perDiem.domestic)} dom / ${fmtHourly(airline.perDiem.international)} intl
      </p>
      <h4>Benefits</h4>
      <ul>${airline.benefits.map((b) => `<li>${b}</li>`).join('')}</ul>
      <h4>Perks &amp; Highlights</h4>
      <ul>${airline.perks.map((p) => `<li>${p}</li>`).join('')}</ul>
    `;
    section.appendChild(card);
  });
}

function bindEvents() {
  const ids = [
    'airline',
    'seat',
    'year',
    'fleet',
    'monthlyHours',
    'perDiemDom',
    'perDiemIntl',
  ];

  ids.forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      if (id === 'monthlyHours') {
        document.getElementById('monthlyHoursVal').textContent = el.value;
      }
      if (id === 'perDiemDom') {
        document.getElementById('perDiemDomVal').textContent = el.value;
      }
      if (id === 'perDiemIntl') {
        document.getElementById('perDiemIntlVal').textContent = el.value;
      }
      renderComparison();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderBenefits();
  bindEvents();
  renderComparison();
});
