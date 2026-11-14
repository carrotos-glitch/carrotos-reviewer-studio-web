# CarrotOS Reviewer Studio

Thai AI review-content studio with image-aware briefs, an OpenAI Responses API backend, member accounts, server-side credits, and PromptPay checkout support.

## Deploy to Render

Create a Render **Web Service** from this repository. Use `npm install` as the build command and `npm start` as the start command. The included `render.yaml` documents the service settings.

Set these values in the Render Environment page:

- `NODE_ENV` = `production`
- `OPENAI_API_KEY` = a newly created OpenAI API key (keep it in Render, never in this repository)
- `OPENAI_MODEL` = `gpt-6-luna`
- `DATABASE_URL` = a persistent PostgreSQL connection URL
- `STRIPE_SECRET_KEY` = Stripe secret API key (keep only in Render)
- `STRIPE_WEBHOOK_SECRET` = signing secret for `https://carrotos-reviewer-studio.onrender.com/api/stripe/webhook`
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` = OAuth web client credentials (keep secret only in Render)
- `APP_SESSION_SECRET` = a long random secret for protecting guest quota identifiers
- `APP_BASE_URL` = `https://carrotos-reviewer-studio.onrender.com`

Create a Stripe webhook for `checkout.session.completed` and `checkout.session.async_payment_succeeded`, then copy its signing secret to Render. Credits are added only after a valid Stripe webhook confirms a paid THB Checkout Session. Configure Stripe Checkout with PromptPay enabled. Packages: 20 credits for THB 15, 100 for THB 59, and 300 for THB 145. Guests receive up to 15 free generations per day. Never commit payment or OpenAI secrets to GitHub.

For Google sign-in, create an OAuth client with application type **Web application** and add `https://carrotos-reviewer-studio.onrender.com/auth/google/callback` as an authorized redirect URI. Set its client ID and client secret in Render. Google OAuth uses the server-side authorization-code flow and checks the returned state value. See [Google's web-server OAuth guide](https://developers.google.com/identity/protocols/oauth2/web-server).

The PostgreSQL database stores member accounts, password hashes, sessions, credit balances, order history, and guest daily usage. Do not use an ephemeral database for production. OpenAI usage from the site is charged to the API account associated with the server key.

Render's free service may sleep during inactivity. See [Render's deployment guide](https://render.com/docs/your-first-deploy) for service setup and environment variables.
