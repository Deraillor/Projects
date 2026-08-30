# Projects

## Airline Pay Comparator

Local web tool to compare 2026 pilot pay across **United**, **American**, and **Delta**.

### Run locally

```bash
cd airline-pay-comparator
python3 -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### View on iPad (GitHub Pages)

Once GitHub Pages is enabled for this repo, open in Safari:

**https://deraillor.github.io/Projects/**

One-time setup (repo owner):

1. GitHub → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. Merge the pay comparator branch to `master` (or run the deploy workflow from the feature branch)

Then bookmark that URL on your iPad.

### Features

- Enter airline, seat (FO/Captain), year of service, and fleet type
- Side-by-side monthly/annual base pay, per diem estimate, and total package
- Full 12-year pay scale table with best-rate highlighting
- Employee benefits and perks for each carrier
- No login required — runs entirely in the browser
