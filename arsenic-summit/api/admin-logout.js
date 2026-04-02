export default async function handler() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/admin-access.html?logged_out=1',
      'Set-Cookie': 'arsenic_admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
      'Cache-Control': 'no-store'
    }
  });
}
