# Boundary — Simple Live Cricket Website

A small mobile-friendly live cricket scores website powered by SportsAPI and served by a Cloudflare Worker.

## Files
- `public/index.html` — website UI
- `src/index.js` — secure API proxy (keeps your API key out of browser code)
- `wrangler.jsonc` — Cloudflare Worker + static assets configuration

## 1. Get an API key
1. Open https://sportsapi.app/sports/cricket
2. Choose **Get a free API key** and create an account.
3. Copy your API key from the dashboard.

The provider currently documents a free plan with 1,000 requests/day and live score access. Check the provider's current limits and terms before publishing.

## 2. Add the API key to Cloudflare
In Cloudflare Dashboard:
1. Open **Workers & Pages**.
2. Select the `boundary-cricket-live` Worker after deploying.
3. Open **Settings → Variables and Secrets**.
4. Add a secret named `SPORTSAPI_KEY`.
5. Paste your API key as the value and save.
6. Redeploy if Cloudflare asks you to.

Do not paste the API key into `index.html` or commit it to GitHub.

## 3. Deploy
This project uses Wrangler's static assets binding. From the project root, deploy with:
```bash
npx wrangler deploy
```
For GitHub-connected deployment, connect the repository and make sure the build/deploy command is `npx wrangler deploy`. Cloudflare should detect `wrangler.jsonc`.

## 4. How updates work
- Browser asks `/api/live` every 2 minutes.
- Worker caches the provider response at the edge for 90 seconds.
- API key stays on the server side.
- Live score availability and update speed depend on provider coverage and its data feed. This is a live-score board, not ball-by-ball commentary.

## Notes
- This first version shows in-progress matches only.
- Some cricket score fields may be absent or formatted differently for certain competitions. If a provider response uses a different score structure, the score display may need a small mapping adjustment.
- Provider: https://sportsapi.app/sports/cricket
- Live scores endpoint docs: https://sportsapi.app/docs/livescores/list
