import bcrypt from 'bcryptjs';

export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: '{"ok":false}' };

  const { password } = JSON.parse(event.body || '{}');
  const hash = process.env.PASSWORD_HASH || '';

  const ok = typeof password === 'string' && hash && await bcrypt.compare(password, hash);
  return ok
    ? {
        statusCode: 200,
        headers: {
          'Set-Cookie': 'wlp4_access=1; Max-Age=3600; Path=/; HttpOnly; SameSite=Lax; Secure',
          'Content-Type': 'application/json'
        },
        body: '{"ok":true}'
      }
    : { statusCode: 401, body: '{"ok":false}' };
}



// // check if plain test password functionality works
// export async function handler(event) {
//   if (event.httpMethod !== 'POST') return { statusCode: 405, body: '{"ok":false}' };
//   const { password } = JSON.parse(event.body || '{}');
//   const secret = process.env.PASSWORD_PLAIN || '';
//   const ok = typeof password === 'string' && password === secret;
//   return ok
//     ? { statusCode: 200, body: '{"ok":true}' }
//     : { statusCode: 401, body: '{"ok":false}' };
// }
