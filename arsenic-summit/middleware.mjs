import { next } from '@vercel/functions';

const REALM = 'Arsenic Summit Admin Access';

function unauthorized() {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store'
    }
  });
}

function misconfigured() {
  return new Response('Admin protection is not configured. Set ADMIN_ACCESS_USERNAME and ADMIN_ACCESS_PASSWORD in Vercel.', {
    status: 500,
    headers: {
      'Cache-Control': 'no-store'
    }
  });
}

function decodeBasicAuth(header) {
  if (!header || !header.startsWith('Basic ')) return null;

  try {
    const encoded = header.slice(6).trim();
    const decoded = atob(encoded);
    const separator = decoded.indexOf(':');
    if (separator === -1) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1)
    };
  } catch {
    return null;
  }
}

export const config = {
  matcher: ['/admin.html', '/docs/google-setup.md']
};

export default function middleware(request) {
  const expectedUser = process.env.ADMIN_ACCESS_USERNAME;
  const expectedPass = process.env.ADMIN_ACCESS_PASSWORD;

  if (!expectedUser || !expectedPass) {
    return misconfigured();
  }

  const credentials = decodeBasicAuth(request.headers.get('authorization'));
  if (!credentials) {
    return unauthorized();
  }

  if (credentials.username !== expectedUser || credentials.password !== expectedPass) {
    return unauthorized();
  }

  return next();
}
