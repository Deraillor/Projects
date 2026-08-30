/**
 * Public 2026 pilot pay-scale data for United, American, and Delta.
 * Sources: ALPA Contract Comparison (Sep 2025), AirlinePilotCentral.com,
 * APA/ALPA contract filings. Estimates only — verify with official pay tables.
 */
export const AIRLINES = {
  united: {
    id: 'united',
    name: 'United Airlines',
    code: 'UAL',
    union: 'ALPA',
    color: '#0033A0',
    contractAmendable: 'Sep 30, 2027',
    monthlyGuarantee: 70,
    retirement401k: 0.18,
    perDiem: { domestic: 3.05, international: 3.63 },
    perDiemNote: '2.5% annual increases from 2024 base ($2.90 dom / $3.45 intl)',
    intlOverride: { captain: 7.0, fo: 5.0 },
    profitSharing: '10% PTIX up to $2.5B; 20% above (shared among eligible employees)',
    payTables: {
      fo: {
        widebody: [125.52, 239.41, 280.15, 286.94, 293.79, 301.24, 309.61, 316.72, 320.17, 324.52, 327.42, 330.44],
        narrowbody: [125.52, 192.22, 224.85, 230.32, 235.86, 241.75, 248.51, 254.25, 256.97, 260.44, 262.83, 265.19],
      },
      captain: {
        widebody: [443.85, 447.45, 451.12, 454.76, 458.40, 462.00, 465.64, 469.22, 472.87, 476.47, 480.09, 483.74],
        narrowbody: [356.46, 359.23, 362.07, 365.00, 367.95, 370.84, 373.73, 376.65, 379.59, 382.47, 385.40, 388.27],
      },
    },
    benefits: [
      '18% non-elective 401(k) employer contribution (2026)',
      'Market Based Cash Balance Plan (MBCBP) for excess contributions',
      'Aviate pathway program for career pilots',
      'Unlimited domestic & international jumpseats (CASS)',
      'Profit sharing tied to company performance',
      'DPMP medical plan options with contractual protections',
      'Long-term disability at 60% of pay (first 24 months)',
      'Paid uniforms and company-paid hotels during new-hire training',
      'Free high-speed WiFi fleet-wide; iPad EFB provided',
    ],
    perks: [
      'Largest widebody fleet among US majors (~220+ WB aircraft)',
      'Highest Year-1 FO hourly rate among Big 3 ($125.52/hr)',
      'Highest Year-12 widebody captain rate ($483.74/hr)',
      '220+ widebody aircraft with 150+ 787s on order',
      'Strong international network (trans-Pacific, trans-Atlantic)',
    ],
  },
  american: {
    id: 'american',
    name: 'American Airlines',
    code: 'AAL',
    union: 'APA',
    color: '#0078D2',
    contractAmendable: 'Aug 2027',
    monthlyGuarantee: 73,
    retirement401k: 0.18,
    perDiem: { domestic: 3.50, international: 4.17 },
    perDiemNote: 'Adjusted annually; never decreases (2025: $3.41 dom / $4.07 intl + ~2.5%)',
    intlOverride: { captain: 7.0, fo: 5.0 },
    profitSharing: '10% PTIX up to $2.5B; 20% above (shared among eligible employees)',
    payTables: {
      fo: {
        widebody: [113.0, 174.0, 210.0, 220.0, 228.0, 238.0, 248.0, 258.0, 268.0, 278.0, 288.0, 330.44],
        narrowbody: [113.0, 174.0, 195.0, 205.0, 215.0, 225.0, 235.0, 245.0, 252.0, 258.0, 262.0, 266.58],
      },
      captain: {
        widebody: [325.0, 360.0, 385.0, 400.0, 415.0, 430.0, 445.0, 455.0, 465.0, 475.0, 480.0, 483.74],
        narrowbody: [325.0, 345.0, 360.0, 370.0, 378.0, 385.0, 390.0, 395.0, 398.0, 400.0, 401.0, 402.01],
      },
    },
    benefits: [
      '18% defined contribution to 401(k) (2026 contract rate)',
      'MBCBP for contributions exceeding IRS limits',
      'Frozen legacy AA defined benefit plan for pre-merger pilots',
      'Core PPO, EPO, and HDHP medical options (contractually protected)',
      'Long-call reserve guarantee: 73 hrs (highest among Big 3)',
      'Short-call reserve guarantee: 76 hrs',
      'Profit sharing tied to company performance',
      'Commuter policy benefits for domicile changes',
      'CASS jumpseat program',
    ],
    perks: [
      'Highest per diem among Big 3 ($4.17/hr international est.)',
      '73-hour long-call guarantee (best floor pay)',
      'World\'s largest airline by fleet size post-merger',
      'Oneworld alliance founding member',
      'Major hubs: DFW, CLT, MIA, ORD, PHX, PHL, LAX',
      '2023 contract delivered up to 46% raises over term',
    ],
  },
  delta: {
    id: 'delta',
    name: 'Delta Air Lines',
    code: 'DAL',
    union: 'ALPA',
    color: '#C8102E',
    contractAmendable: 'Dec 31, 2026',
    monthlyGuarantee: 65,
    retirement401k: 0.18,
    perDiem: { domestic: 3.30, international: 3.55 },
    perDiemNote: 'Adjusted annually from weighted avg of top layover cities',
    intlOverride: { captain: 6.5, fo: 4.5 },
    profitSharing: '10% PTIX up to $2.5B; 20% above — paid 5.6% (2023) to 16.6% (2019) historically',
    payTables: {
      fo: {
        widebody: [118.0, 200.0, 235.0, 255.0, 270.0, 285.0, 298.0, 308.0, 315.0, 322.0, 327.0, 330.44],
        narrowbody: [118.0, 165.0, 180.0, 190.0, 195.0, 210.0, 225.0, 235.0, 245.0, 255.0, 260.0, 265.19],
      },
      captain: {
        widebody: [216.0, 300.0, 340.0, 370.0, 395.0, 420.0, 440.0, 455.0, 465.0, 475.0, 480.0, 483.74],
        narrowbody: [216.0, 280.0, 320.0, 340.0, 355.0, 365.0, 375.0, 380.0, 385.0, 387.0, 388.0, 388.27],
      },
    },
    benefits: [
      '18% non-elective 401(k) contribution (effective Jan 1, 2026)',
      'MBCBP for excess contributions above IRS limits',
      'Industry-leading profit sharing (10.4% of pay in 2024)',
      'DPMP and DP-HDHP medical plans (contractually protected)',
      'Disability: 50% of FAE immediately on sick credit exhaustion',
      'Sick credit: 75–270 hrs annually (resets each year)',
      'Company-paid hotels throughout all new-hire training',
      'Paid uniforms for new-hire pilots',
      'SkyTeam alliance founding member',
    ],
    perks: [
      'Best profit-sharing history among US majors',
      'Highest domestic per diem among Big 3 ($3.30/hr)',
      'Entire fleet equipped with free high-speed WiFi',
      '506+ projected retirements in 2026 (upgrade opportunities)',
      'Primary training center in Atlanta; new SLC CQ facility',
      'PWA amendable Dec 2026 — Section 6 negotiations reopened',
    ],
  },
};

export const FLEET_LABELS = {
  widebody: 'Widebody (787, 777, A350, 767-400)',
  narrowbody: 'Narrowbody (737, A320/A321, A220)',
};

export const SEAT_LABELS = {
  fo: 'First Officer',
  captain: 'Captain',
};

/** Annual pay ranges published for 2026 (public sources). */
export const ANNUAL_RANGES_2026 = {
  united: {
    fo: { min: 88000, max: 360000, note: 'Year 1 NB to Year 12 WB at 70–85 hrs/mo' },
    captain: { min: 300000, max: 700000, note: 'Year 1 NB to Year 12 WB at 75–85 hrs/mo' },
  },
  american: {
    fo: { min: 85000, max: 340000, note: 'Year 1 to Year 12 at guarantee–85 hrs/mo' },
    captain: { min: 280000, max: 680000, note: 'Year 1 upgrade to Year 12 WB' },
  },
  delta: {
    fo: { min: 90000, max: 350000, note: 'Year 1 to Year 12 at 65–85 hrs/mo' },
    captain: { min: 290000, max: 690000, note: 'Year 1 upgrade to Year 12 WB' },
  },
};

export function getHourlyRate(airline, seat, fleet, year) {
  const y = Math.max(1, Math.min(12, year)) - 1;
  return airline.payTables[seat][fleet][y];
}

export function calculatePay(airline, seat, fleet, year, monthlyHours, perDiemHoursDom, perDiemHoursIntl) {
  const hourly = getHourlyRate(airline, seat, fleet, year);
  const monthlyBase = hourly * monthlyHours;
  const annualBase = monthlyBase * 12;

  const domPerDiem = perDiemHoursDom * airline.perDiem.domestic;
  const intlPerDiem = perDiemHoursIntl * airline.perDiem.international;
  const monthlyPerDiem = domPerDiem + intlPerDiem;
  const annualPerDiem = monthlyPerDiem * 12;

  const intlOverrideRate = seat === 'captain' ? airline.intlOverride.captain : airline.intlOverride.fo;
  const monthlyIntlOverride = intlOverrideRate * (perDiemHoursIntl / 4);
  const annualIntlOverride = monthlyIntlOverride * 12;

  const annual401k = annualBase * airline.retirement401k;
  const guaranteePay = getHourlyRate(airline, seat, fleet, year) * airline.monthlyGuarantee;

  return {
    hourly,
    monthlyBase,
    annualBase,
    monthlyPerDiem,
    annualPerDiem,
    monthlyIntlOverride,
    annualIntlOverride,
    annual401k,
    guaranteePay,
    totalCompEstimate: annualBase + annualPerDiem + annualIntlOverride + annual401k,
  };
}
