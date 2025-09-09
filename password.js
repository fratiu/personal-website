import { showScreen } from './lib/showScreen.js';

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

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('unlock-btn');
  const input = document.getElementById('password');

  // Optional: auto-show if cookie from earlier session exists (simple check)
  if (document.cookie.includes('wlp4_access=1')) {
    showScreen('home-screen', 'video-screen');
  }

  btn.addEventListener('click', async () => {
    const ok = await checkPassword(input.value);
    if (ok) {
      showScreen('home-screen', 'video-screen');
    } else {
      alert('Incorrect password.');
    }
  });
});


async function fetchSignedVideoUrl() {
  const res = await fetch('/api/video-url', { credentials: 'include' });
  if (!res.ok) throw new Error('failed to get signed URL');
  const data = await res.json();
  if (!data.ok || !data.url) throw new Error('no URL returned');
  return data.url;
}

async function loadPrivateVideo() {
  const url = await fetchSignedVideoUrl();
  const vid = document.getElementById('wlp4Video');
  vid.src = url;
  vid.load();            // ready to play
}

async function onUnlockSuccess() {
  await loadPrivateVideo();
  showScreen('home-screen', 'video-screen');
}

document.addEventListener('DOMContentLoaded', async () => {
  if (localStorage.getItem('wlp4_access') === '1') {
    // showScreen('locked','protected');
    try { await loadPrivateVideo(); } catch (e) { console.error(e); }
  }
});

