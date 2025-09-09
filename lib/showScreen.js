export function showScreen(oldScreen, newScreen) {
  //console.log("just checking it's the right id: " + id);
  document.getElementById(oldScreen).style.display = 'none';
  document.getElementById(newScreen).style.display = 'block';
  //console.log("just checking it's the right id: " + id);
}