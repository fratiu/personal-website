const controller = new AbortController();
const { signal } = controller;
let typingTimeout = null;


const phrases = [
  "Hello World!",
  "My name is Filip Ratiu",
  "I like to code",
  "I like to solve business problems",
  "I like to reimagine the future"
];

const classTarget = document.getElementById('intro-screen');
const textTarget = document.getElementById('intro-text');
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let inTraits = false;
let delay = 100;
let completeTyping = false;


function showScreen(oldScreen, newScreen) {
  //console.log("just checking it's the right id: " + id);
  document.getElementById(oldScreen).style.display = 'none';
  document.getElementById(newScreen).style.display = 'block';
  //console.log("just checking it's the right id: " + id);
}

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new DOMException("Aborted", "AbortError"));
    const onAbort = () => { clearTimeout(id); reject(new DOMException("Aborted", "AbortError")); };
    const id = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal.addEventListener("abort", onAbort, { once: true });
    typingTimeout = id; // optional handle to clear immediately on skip
  });
}

function type(onComplete) {

  if (completeTyping) {
    classTarget.classList.add("done");
    onComplete();
    return;
  }

  const phrase = phrases[phraseIndex];

  // if (inTraits) {
  //   target.style.color = "#DC143C";
  // }

  if (isDeleting) {
    if (!inTraits) {
      textTarget.textContent = phrase.slice(0, --charIndex);
    } else {
      if (charIndex > "I like to ".length) {
        textTarget.textContent = phrase.slice(0, --charIndex);
      } else if (phraseIndex === phrases.length - 1) {
        textTarget.textContent = phrase.slice(0, --charIndex);
      }
    }
  } else {
    textTarget.textContent = phrase.slice(0, ++charIndex);
  }

  if (!isDeleting && charIndex === phrase.length) {
    delay = 1000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0 || isDeleting && inTraits && phraseIndex != phrases.length - 1 && charIndex <= "I like to ".length) {
    isDeleting = false;
    if (inTraits && phraseIndex != phrases.length - 1) {
      charIndex = "I like to ".length;
    }
    inTraits = false;
    if (phraseIndex != phrases.length - 1) {
      phraseIndex += 1;
    } else {
      completeTyping = true;
    }

    if (completeTyping) {
      delay = 20;
    } else {
      delay = 500;
    }
  } else {
    delay = isDeleting ? 30 : 70;
  }

  if (phraseIndex >= 2) {
    inTraits = true;
  }

  setTimeout(() => type(onComplete), delay);
}


document.getElementById('skip-btn').addEventListener("click", () => {
  controller.abort();
  if (typingTimeout) clearTimeout(typingTimeout);
  showScreen("intro-screen", "home-screen");
}, { once: true });



type(() => showScreen('intro-screen', 'home-screen'));
// showScreen('intro-screen', 'home-screen');

const user = "ratiu17filip", domain = "gmail.com";
const a = document.getElementById("email");
a.href = "mailto:" + user + "@" + domain;

