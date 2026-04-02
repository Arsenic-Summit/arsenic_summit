import crypto from 'node:crypto';

function sessionValue(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const form = await request.formData();
  const password = String(form.get('password') || '');
  const expectedPassword = process.env.ADMIN_ACCESS_PASSWORD;

  if (!expectedPassword) {
    return new Response('ADMIN_ACCESS_PASSWORD is not configured in Vercel.', { status: 500 });
  }

  if (password !== expectedPassword) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/admin-access.html?error=1',
        'Cache-Control': 'no-store'
      }
    });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/admin.html',
      'Set-Cookie': `arsenic_admin_session=${sessionValue(expectedPassword)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800`,
      'Cache-Control': 'no-store'
    }
  });
}
