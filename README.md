# CarrotOS Reviewer Studio

Thai AI review-content studio with image-aware briefs, an OpenAI Responses API backend, and an access-code gate for invited users.

## Deploy to Render

Create a Render **Web Service** from this repository. Use `npm install` as the build command and `npm start` as the start command. The included `render.yaml` documents the service settings.

Set these values in the Render Environment page:

- `NODE_ENV` = `production`
- `OPENAI_API_KEY` = a newly created OpenAI API key (keep it in Render, never in this repository)
- `APP_ACCESS_CODE` = a private access code to share only with invited users
- `OPENAI_MODEL` = `gpt-6-luna`

Deploy, then share the Render URL and access code with your invited users. OpenAI usage from the site is charged to the API account associated with the server key. The API key setup page is disabled in hosted mode; the key is read only from the server environment.

Render's free service may sleep during inactivity. See [Render's deployment guide](https://render.com/docs/your-first-deploy) for service setup and environment variables.
