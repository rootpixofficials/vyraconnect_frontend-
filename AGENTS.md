<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Environment & Deployment Architecture (STRICT SEPARATION)

### 1. LIVE ENVIRONMENT (Production)
- **Git Remote Name**: `origin`
- **GitHub Repository**: `https://github.com/rootpixofficials/vyraconnect_frontend-`
- **Cloudways Host**: `178.128.241.178:22` (User: `master_zqpqahqrbk`)
- **Cloudways App Directory**: `/home/1650272.cloudwaysapps.com/ewccqhxqex/public_html/frontend`
- **PM2 Service**: `vyra-frontend` (Port: 3001)
- **Live Domains**: `https://vyraconnect.in` & `https://www.vyraconnect.in`
- **Deployment Script**: `node backend/deploy_live.mjs`
- **STRICT RULE**: NEVER push or deploy to LIVE unless the user has tested, verified, and explicitly instructed: `"push to live"` / `"deploy to live"`.

---

### 2. TEST ENVIRONMENT (Staging / Testing)
- **Git Remote Name**: `test`
- **GitHub Repository**: `https://github.com/rootpixofficials/vyraconnect_frontend_test`
- **Cloudways Host**: `178.128.241.178:22` (User: `master_zqpqahqrbk`)
- **Cloudways App Directory**: `/home/1650272.cloudwaysapps.com/mypvwemywb/public_html/frontend`
- **PM2 Service**: `vyra-frontend-test` (Port: 3002)
- **Test URL**: `https://phpstack-1650272-6724559.cloudwaysapps.com`
- **Deployment Script**: `node backend/deploy_test.mjs`
- **STRICT RULE**: When working on test tasks or when the user says "do in test" / "push to test", push ONLY to `test` remote and deploy to the test application.

---

### 3. SHARED BACKEND (Single Source of Truth)
- Both LIVE and TEST frontends connect to the SAME backend API:
  - **Cloudways App Directory**: `/home/1650272.cloudwaysapps.com/mhenvbbpem/public_html/backend`
  - **PM2 Service**: `vyra-api` (Port: 5000)
  - **API URL**: `https://api.vyraconnect.in`
  - **Database**: Shared remote MySQL database on Cloudways server.

---

### 4. WORKFLOW & RULES
1. **Never merge or mix the test and live repositories directly.**
2. When asked to "test" or "do in test":
   - Push code to `test` remote: `git push test <branch>`
   - Deploy to the test application using `node backend/deploy_test.mjs`
   - Provide the test URL: `https://phpstack-1650272-6724559.cloudwaysapps.com`
3. ONLY when the user explicitly reviews, confirms, and instructs to "push to live":
   - Push code to `origin` remote: `git push origin main`
   - Deploy to the live application using `node backend/deploy_live.mjs`
   - Provide the live URL: `https://vyraconnect.in`

