import crypto from 'node:crypto';
import { next } from '@vercel/functions';

function sessionValue(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function parseCookies(header) {
  const values = {};
  String(header || '').split(';').forEach((part) => {
    const [key, ...rest] = part.trim().split('=');
    if (!key) return;
    values[key] = rest.join('=');
  });
  return values;
}

function redirectToAccess(request) {
  const url = new URL('/admin-access.html', request.url);
  return Response.redirect(url, 302);
}

export const config = {
  matcher: ['/admin.html', '/docs/google-setup.md']
};

export default function middleware(request) {
  const expectedPassword = process.env.ADMIN_ACCESS_PASSWORD;
  if (!expectedPassword) {
    return new Response('ADMIN_ACCESS_PASSWORD is not configured in Vercel.', { status: 500 });
  }

  const cookies = parseCookies(request.headers.get('cookie'));
  const activeSession = cookies.arsenic_admin_session;
  const expectedSession = sessionValue(expectedPassword);

  if (activeSession !== expectedSession) {
    return redirectToAccess(request);
  }

  return next();
}
