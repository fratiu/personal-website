export function showScreen(oldId, newId) {
  const ids = ["lock-screen", "home-screen", "video-screen"];

  // Hide every screen
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = "none";
  });

  // Show the requested target
  const next = document.getElementById(newId);
  if (next) next.style.display = "block";

  window.scrollTo({ top: 0, behavior: "instant" });
}
