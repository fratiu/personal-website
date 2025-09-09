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



async function fetchSignedVideoUrl() {
  const res = await fetch('/api/video-url', { credentials: 'include' });
  if (!res.ok) throw new Error('failed to get signed URL');
  const data = await res.json();
  if (!data.ok || !data.url) throw new Error('no URL returned');
  return data.url;
}

async function onUnlockSuccess() {
  await loadPrivateVideo();
  showScreen('home-screen', 'video-screen');
}

async function loadPrivateVideo() {
  const url = await fetchSignedVideoUrl();
  const vid = document.getElementById('wlp4Video');
  vid.src = url;
  vid.load();            // ready to play
}


document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('unlock-btn');
  const input = document.getElementById('password');

  // If the server already set the access cookie in a prior session, auto-load
  if (document.cookie.includes('wlp4_access=1')) {
    // best-effort load; if it fails they'll still see home-screen
    loadPrivateVideo().then(() => {
      showScreen('home-screen', 'video-screen');
    }).catch(console.error);
  }

  btn?.addEventListener('click', async () => {
    try {
      const ok = await checkPassword(input.value);
      if (!ok) return alert('Incorrect password.');
      // cookie will be set by /api/check-password response
      await onUnlockSuccess();
    } catch (e) {
      console.error(e);
      alert('Sorry—something went wrong unlocking the video.');
    }
  });
});
