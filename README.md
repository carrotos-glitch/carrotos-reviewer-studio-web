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
- `APP_SESSION_SECRET` = a long random secret for protecting guest quota identifiers
- `APP_BASE_URL` = `https://carrotos-reviewer-studio.onrender.com`

Create a Stripe webhook for `checkout.session.completed` and `checkout.session.async_payment_succeeded`, then copy its signing secret to Render. Credits are added only after a valid Stripe webhook confirms a paid THB Checkout Session. Configure Stripe Checkout with PromptPay enabled. The packages are 20 credits for THB 10 and 100 credits for THB 39. Never commit payment or OpenAI secrets to GitHub.

The PostgreSQL database stores member accounts, password hashes, sessions, credit balances, order history, and guest daily usage. Do not use an ephemeral database for production. OpenAI usage from the site is charged to the API account associated with the server key.

Render's free service may sleep during inactivity. See [Render's deployment guide](https://render.com/docs/your-first-deploy) for service setup and environment variables.
