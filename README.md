# Meloshare website

Static HTML/CSS/JavaScript prototype. Pages: index.html and auth.html.

## Activate account signup
1. In Supabase SQL Editor, run schema.sql.
2. In Supabase Project Settings / API Keys, copy the project URL and PUBLIC publishable/anon key into config.js. Never use a secret or service_role key.
3. Under Supabase Authentication > URL Configuration, set https://melloshare.netlify.app as Site URL and allow https://melloshare.netlify.app/auth.html as a redirect URL.
4. Connect this GitHub repository to Netlify and deploy the root folder (no build command required).
5. Test registration, email confirmation and login.

## Important limitations
- Music upload is browser-session-only; no permanent audio storage.
- Advertising and earnings are illustrative only, not billable or payable.
- Stripe Connect payouts are not implemented.
- Password reset email is initiated but the new-password form is not implemented.
- Before launch, add moderation, legal policies, production email delivery, secure payment endpoints, and testing.
