(function () {
  const avatar = document.querySelector('.avatar');
  const eyes = Array.from(document.querySelectorAll('.eye'));
  const pupils = Array.from(document.querySelectorAll('.pupil'));

  // Max pupil travel (inside eye) computed from sizes each frame
  function movePupil(eyeEl, pupilEl, mouseX, mouseY) {
    const rect = eyeEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Vector from eye center to mouse
    const dx = mouseX - cx;
    const dy = mouseY - cy;

    // Limit pupil movement to a radius inside the socket
    const pupilRadius = pupilEl.offsetWidth / 2;
    const eyeRadius = rect.width / 2;
    const maxTravel = Math.max(eyeRadius - pupilRadius - 4, 2); // 4px padding

    // Normalize & clamp
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const tx = ux * maxTravel;
    const ty = uy * maxTravel;

    // Move pupil (relative to its center)
    pupilEl.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
  }

  function onMove(e) {
    const x = e.clientX ?? (e.touches && e.touches[0].clientX);
    const y = e.clientY ?? (e.touches && e.touches[0].clientY);
    if (x == null || y == null) return;

    for (let i = 0; i < eyes.length; i++) {
      movePupil(eyes[i], pupils[i], x, y);
    }
  }

  // Mouse + touch support
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });

  // Keep pupils centered on resize
  window.addEventListener('resize', () => {
    for (let i = 0; i < pupils.length; i++) {
      pupils[i].style.transform = 'translate(-50%, -50%)';
    }
  });
})();
