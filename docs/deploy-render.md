# Deploy a test instance on Render

This deployment uses a free static site for React, one free Docker web service
for Django HTTP/WebSockets, and free PostgreSQL. The repository's local SQLite
and Docker Compose workflows still work. Render builds the existing backend
Dockerfile; it does not run the Compose stack. React is built as a static site
so it does not consume a second free web service's running hours.

## Before you start

- Put your copy of the repository on GitHub (or another Git provider Render supports).
- Create a Render account and connect that repository.
- Commit and push the deployment files when you are ready. Uncommitted local files
  are not visible to Render.
- Use a temporary deployment branch while testing. After verifying local and
  hosted behavior, merge into `main` and select `main` as the deployment branch.

No Redis service is required for this configuration. `render-start.sh` runs exactly
one Daphne process, allowing Channels and room presence to share in-memory state.
Do not add workers or instances without configuring `REDIS_URL` first.

## Create the services

1. In Render, choose **New > Blueprint**, connect the repository, and select the
   branch containing these changes. Use the root `render.yaml`.
2. Review the resources: `group-call-api` and `group-call-db` must use **Free**;
   `group-call-web` is a static site. API and database use the same region.
3. Render prompts for two environment variables. If the final service URLs are
   not yet known, use `https://example.com` temporarily for both:
   - API service: `FRONTEND_URL`
   - Static site: `VITE_API_BASE_URL`
4. Apply the Blueprint. The placeholders let the builds finish, but the app
   cannot communicate correctly until you replace them in the next step.

The Blueprint generates Django and TURN secrets and connects the internal
PostgreSQL URL automatically. Keep these secrets in Render, not in Git.
The existing backend Dockerfile selects Python 3.13 and installs Python
dependencies. Render overrides its default command with `render-start.sh`, which
collects static assets, applies migrations, then starts Daphne on Render's assigned
port. Migration failure stops startup. Docker Compose keeps its existing commands.

## Connect the public URLs

Copy the actual public URLs from the two service dashboards. Render may add a
suffix to service hostnames, so do not infer URLs from service names.

| Service | Variable | Example value |
|---|---|---|
| API | `FRONTEND_URL` | `https://group-call-web-xxxx.onrender.com` |
| Static site | `VITE_API_BASE_URL` | `https://group-call-api-xxxx.onrender.com` |

Use HTTPS origins with **no trailing slash**, path, or `/api` suffix.
Save the API setting and redeploy it. Save the frontend setting and **rebuild and
deploy** the static site: Vite embeds this value at build time.

`FRONTEND_URL` controls CORS and password-reset links. The frontend derives its
secure WebSocket URL from `VITE_API_BASE_URL`. The Blueprint includes the SPA
rewrite so invite links and page refreshes work. Django automatically accepts
`RENDER_EXTERNAL_HOSTNAME`; add custom API domains through the comma-separated
`ALLOWED_HOSTS` variable if needed.

Open `https://YOUR-API.onrender.com/api/ping/` and wait for `{"status":"ok"}`
before opening the frontend for the first test. Cold starts can take about a minute.

## Test the deployment

- Register two accounts in separate browser profiles or on separate devices.
- Log in, update a profile, create public/private rooms, and open an invite link.
- Refresh a nested frontend URL to verify the SPA rewrite.
- Allow camera/microphone access, join the same room, and test video, audio,
  mute controls, chat, leaving, and rejoining.
- Try two different networks, such as home Wi-Fi and mobile data.
- Redeploy the API and confirm accounts/rooms persist in PostgreSQL. Active
  sockets and in-memory presence can be lost during restarts; rejoin the call.
- Test password reset using the link in the API logs while using console email.
  Treat reset links as secrets. This tests the flow, not email delivery.

## TURN for reliable calls

Initially `TURN_URLS` is empty. The frontend uses its existing public STUN fallback,
so direct peer-to-peer calls may work, but restrictive networks can prevent them.

Render web services cannot expose the UDP and relay port range used by the
repository's coturn container. Run coturn on a suitable external host, or use a
managed TURN provider. For a service supporting coturn-style shared-secret
credentials:

1. Set the API's `TURN_URLS` to the provider's comma-separated TURN URLs.
2. Replace the generated `TURN_SECRET` with the shared secret configured on that
   TURN service, and redeploy the API.
3. Retest across networks. For a definitive relay test, temporarily set
   `iceTransportPolicy: "relay"` in the frontend's `RTCPeerConnection` options,
   rebuild, and verify calls; remove that test setting afterward.

`backend/main/turn.py` generates time-limited HMAC-SHA1 credentials. Providers
requiring an API call or static username/password need an integration change;
their API keys are not interchangeable with `TURN_SECRET`. Provider pricing and
free relay allowances are separate from Render.

## Email delivery

The default Django console email backend prints password-reset emails to the API
logs. For real delivery, integrate an email provider's HTTPS API/backend and set
its credentials plus a verified `DEFAULT_FROM_EMAIL`. Setting the sender address
alone does not enable delivery. Render free web services block common SMTP ports
25, 465, and 587.

## Free-tier limits

- Free API services sleep after 15 minutes without inbound traffic. Peer-to-peer
  video traffic does not reach Django, so even a quiet call can be affected.
- Free web services share 750 running hours per workspace per month.
- Local files are ephemeral. PostgreSQL stores accounts and rooms; SQLite on
  Render would lose data across restarts, redeploys, or idle shutdowns.
- Free Render PostgreSQL expires after 30 days. Export test data before expiry
  or choose longer-term database hosting for continued use.
- Restarts clear the in-memory channel layer/cache. This is a small test
  deployment, not a reliable always-on calling service.
- Build minutes and outbound bandwidth also have limits. Review your workspace
  usage and billing settings, plus any external TURN/email costs.

## Continue running locally

Follow the root README as before. Leave `DATABASE_URL` unset for SQLite and use
localhost URLs in `.env`. Render environment variables do not modify your local
environment. Docker Compose still provides local coturn and, in production mode,
Redis for its multiple backend workers. Do not copy Render's `RENDER=true`
environment flag into local configuration; it enables HTTPS proxy settings.

## References

- [Render Blueprints](https://render.com/docs/infrastructure-as-code)
- [Blueprint specification](https://render.com/docs/blueprint-spec)
- [Django deployment](https://render.com/docs/deploy-django)
- [Free-tier limits](https://render.com/docs/free)
- [WebSocket networking](https://render.com/docs/websocket)
- [Static-site rewrites](https://render.com/docs/redirects-rewrites)
