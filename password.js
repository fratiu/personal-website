// import { showScreen } from './script.js';

async function checkPassword(pw) {
  const res = await fetch('/api/check-password', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ password: pw }),
    credentials: 'include'
  });
  if (!res.ok) return false;
  const data = await res.json();
  return !!data.ok;
}

// document.addEventListener('DOMContentLoaded', () => {
//   const btn = document.getElementById('unlock-btn');
//   const input = document.getElementById('password');

//   // Optional: auto-show if cookie from earlier session exists (simple check)
//   if (document.cookie.includes('wlp4_access=1')) {
//     showScreen('home-screen', 'video-screen');
//   }

//   btn.addEventListener('click', async () => {
//     const ok = await checkPassword(input.value);
//     if (ok) {
//       showScreen('home-screen', 'video-screen');
//     } else {
//       alert('Incorrect password.');
//     }
//   });
// });
