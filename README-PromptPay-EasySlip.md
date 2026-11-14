# CarrotOS PromptPay + EasySlip setup

This update keeps the existing CarrotOS pages and adds server-side PromptPay QR creation, EasySlip v2 image verification, duplicate-slip protection, and member daily free credits.

## Files to replace in the existing GitHub repository

- `server.js`
- `package.json`
- `carrotos-reviewer-studio.html`

Do not replace other files. Keep a backup/branch first.

## Render environment variables

Set these in Render → your existing Web Service → Environment:

- `DATABASE_URL`: existing PostgreSQL connection string (keep the current value)
- `OPENAI_API_KEY`: existing OpenAI key (keep the current value)
- `OPENAI_MODEL`: optional; keep the current model value if already configured
- `PROMPTPAY_ID`: PromptPay receiver identifier (Thai mobile number, national ID, or juristic ID in the format accepted by PromptPay QR)
- `EASYSLIP_API_KEY`: EasySlip Developer API key
- `APP_BASE_URL`: `https://carrotos-reviewer-studio.onrender.com`

Never put secrets in GitHub or in HTML. Add the receiver bank account in EasySlip Developer Portal and make sure it is available for `matchAccount` verification. This implementation deliberately rejects slips if EasySlip cannot match the receiving account, if the amount differs, or if the slip is duplicated.

## Install / deploy

Render should run `npm install` and then `npm start` from the updated package.json. The new dependencies are `promptpay-qr` and `qrcode`.

## Database changes

On first request, the server creates `member_daily_usage` and adds `trans_ref` to `credit_orders`. Existing members, purchased credits, and order rows are retained. No destructive migration is included.

## Important testing

1. Test on a separate low-value payment before announcing sales.
2. Verify a correct slip for each package.
3. Verify a wrong-amount slip is rejected.
4. Verify a duplicate slip is rejected.
5. Confirm credits are added exactly once and appear after refreshing the member modal.
6. Confirm daily free credits are consumed first, reset at Bangkok midnight, and purchased credits are used only after the 15 daily free uses.

EasySlip API requests consume the EasySlip plan quota. PromptPay QR creation itself uses the configured PromptPay receiver ID; it does not move money or verify payment.
