// ===============================================
// PVS YEP '26 - Main Interactive Scripts
// ===============================================

// 1. Splash Screen & Lock Management
const splashScreen = document.getElementById('splash-screen');
const enterBtn = document.getElementById('enter-btn');
const body = document.body;

if (enterBtn && splashScreen) {
  enterBtn.addEventListener('click', () => {
    splashScreen.classList.add('hidden');
    body.classList.remove('locked');
    
    // Start ambient festive audio
    startFestiveAudio();
  });
}

// 2. Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.querySelector('.nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
    }
  });
}

// 3. Countdown Timer to Dec 9, 2026 at 1:00 PM (Assembly)
function updateCountdown() {
  const targetDate = new Date('December 9, 2026 13:00:00').getTime();
  const now = new Date().getTime();
  const distance = targetDate - now;

  const daysElem = document.getElementById('days');
  const hoursElem = document.getElementById('hours');
  const minutesElem = document.getElementById('minutes');
  const secondsElem = document.getElementById('seconds');

  if (distance < 0) {
    if (daysElem) daysElem.innerText = '00';
    if (hoursElem) hoursElem.innerText = '00';
    if (minutesElem) minutesElem.innerText = '00';
    if (secondsElem) secondsElem.innerText = '00';
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  if (daysElem) daysElem.innerText = String(days).padStart(2, '0');
  if (hoursElem) hoursElem.innerText = String(hours).padStart(2, '0');
  if (minutesElem) minutesElem.innerText = String(minutes).padStart(2, '0');
  if (secondsElem) secondsElem.innerText = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// 4. Lightbox for Photo Gallery
const galleryImages = [
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
  'images/table-setting.jpg',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
];

let currentLightboxIndex = 0;
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCounter = document.getElementById('lightbox-counter');

function openLightbox(index) {
  currentLightboxIndex = index;
  updateLightboxView();
  if (lightboxModal) lightboxModal.classList.add('active');
}

function updateLightboxView() {
  if (lightboxImg) lightboxImg.src = galleryImages[currentLightboxIndex];
  if (lightboxCounter) lightboxCounter.innerText = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
}

function nextLightbox(e) {
  if (e) e.stopPropagation();
  currentLightboxIndex = (currentLightboxIndex + 1) % galleryImages.length;
  updateLightboxView();
}

function prevLightbox(e) {
  if (e) e.stopPropagation();
  currentLightboxIndex = (currentLightboxIndex - 1 + galleryImages.length) % galleryImages.length;
  updateLightboxView();
}

function closeLightbox(e) {
  if (e.target === lightboxModal) {
    lightboxModal.classList.remove('active');
  }
}

function closeLightboxDirect() {
  if (lightboxModal) {
    lightboxModal.classList.remove('active');
  }
}

document.addEventListener('keydown', (e) => {
  if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightboxDirect();
  if (e.key === 'ArrowRight') nextLightbox();
  if (e.key === 'ArrowLeft') prevLightbox();
});

// 5. Ambient Festive Audio (Web Audio API Synthesizer)
let audioCtx = null;
let isAudioPlaying = false;
let audioInterval = null;
const audioBtn = document.getElementById('audio-toggle-btn');

function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playFestiveNote(freq, time, duration = 0.8) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, time);

  // Soft attack and decay chime envelope
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.08, time + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(time);
  osc.stop(time + duration);
}

// Gentle festive chord arpeggios (C major / G major / A minor / F major)
const melodyNotes = [
  523.25, 659.25, 783.99, 1046.50, // C5, E5, G5, C6
  587.33, 739.99, 880.00, 1174.66, // D5, F#5, A5, D6
  440.00, 523.25, 659.25, 880.00,  // A4, C5, E5, A5
  698.46, 880.00, 1046.50, 1318.51 // F5, A5, C6, E6
];

let noteStep = 0;
function playNextArpeggioStep() {
  if (!isAudioPlaying || !audioCtx) return;
  const now = audioCtx.currentTime;
  const freq = melodyNotes[noteStep % melodyNotes.length];
  playFestiveNote(freq, now, 1.2);
  noteStep++;
}

function startFestiveAudio() {
  initAudio();
  if (isAudioPlaying) return;
  isAudioPlaying = true;
  if (audioBtn) audioBtn.classList.add('playing');
  audioInterval = setInterval(playNextArpeggioStep, 600);
}

function stopFestiveAudio() {
  isAudioPlaying = false;
  if (audioInterval) clearInterval(audioInterval);
  if (audioBtn) audioBtn.classList.remove('playing');
}

if (audioBtn) {
  audioBtn.addEventListener('click', () => {
    if (isAudioPlaying) {
      stopFestiveAudio();
    } else {
      startFestiveAudio();
    }
  });
}
