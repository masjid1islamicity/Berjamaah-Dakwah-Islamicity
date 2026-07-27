---
name: Replit Auth mobile setup
description: Auth wiring for ABDI Expo app — pitfalls and decisions
---

## Rule
Do not use `format: uri` in openapi.yaml schemas. Orval generates `zod.url()` which does not exist in Zod v4 — causes typecheck failure.

**Why:** The workspace uses Zod v4 (catalog dependency). `zod.url()` is v3 API. Orval converts `format: uri` to `zod.url()`.

**How to apply:** For any URL-type fields, use `type: string` without `format: uri`. Add comments in the spec instead.

## Auth stack
- API server: Express + openid-client v6 + PostgreSQL sessions (drizzle sessionsTable + usersTable)
- Mobile: expo-auth-session ~7.0.10, expo-secure-store ~15.0.8, expo-crypto ~15.0.8
- expo-web-browser was already installed at ~15.0.10; scheme "abdicity" already in app.json
- Mobile AuthProvider lives at `artifacts/mobile/lib/auth.tsx`
- DB schema pushed: sessions + users tables created

## Profil screen
- Unauthenticated → shows `LoginGate` with Masuk/Daftar button
- Authenticated → shows real name/email from auth + local profile data + Keluar (logout) menu item
