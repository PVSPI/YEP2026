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

// 4. Lightbox & Live Google Drive Photo Gallery
const DRIVE_GALLERY_API = 'https://script.google.com/macros/s/AKfycbxa60pYU31eXDbaN6U0nCs1035p1vKNPY3LUcIx3k_AV0bLa3h8j4_2nxa4w6PKn85z/exec';

let galleryImages = [
  'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
  'images/table-setting.jpg',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'
];

async function syncDriveGallery() {
  const grid = document.getElementById('gallery-grid');
  const driveBtnText = document.getElementById('gallery-drive-btn-text');
  if (!grid || !DRIVE_GALLERY_API) return;

  try {
    const res = await fetch(DRIVE_GALLERY_API);
    if (!res.ok) return;
    const drivePhotos = await res.json();

    if (Array.isArray(drivePhotos) && drivePhotos.length > 0) {
      // Sort newest first
      drivePhotos.sort((a, b) => b.date - a.date);

      // Lightbox holds all uploaded photos from Drive
      galleryImages = drivePhotos.map(p => p.url);

      // Display the latest 6 photos on the page grid
      const latest6 = drivePhotos.slice(0, 6);
      grid.innerHTML = latest6.map((photo, idx) => `
        <div class="gallery-item" onclick="openLightbox(${idx})">
          <img src="${photo.url}" alt="${photo.name || 'Party memory'}" loading="lazy" />
          <div class="gallery-overlay"><span>View Photo</span></div>
        </div>
      `).join('');

      // Update Drive button with total count
      if (driveBtnText) {
        driveBtnText.innerText = `View All Photos in Google Drive (${drivePhotos.length} Total)`;
      }
    }
  } catch (err) {
    console.warn('Drive gallery sync note:', err);
  }
}

syncDriveGallery();

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
  if (lightboxModal && lightboxModal.classList.contains('active')) {
    if (e.key === 'Escape') closeLightboxDirect();
    if (e.key === 'ArrowRight') nextLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
  }
  if (rsvpModal && rsvpModal.classList.contains('active')) {
    if (e.key === 'Escape') closeRSVPModalDirect();
  }
});

// 5. RSVP Submission & Confirmation Modal (Direct to Google Forms)
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfmKKZ812h6MMr8fze-PDZvgBRPmGuFJJytEv9M2k3FRaBvdQ/formResponse';
const rsvpModal = document.getElementById('rsvp-modal');
const modalSummary = document.getElementById('modal-summary');

async function handleRSVPSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('rsvp-form');
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

  const name = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const attendance = document.getElementById('attendance') ? document.getElementById('attendance').value : 'Attending';
  const companions = document.getElementById('companions') ? document.getElementById('companions').value : '0 - Just me (Solo)';
  const dietary = document.getElementById('dietary').value.trim();
  const message = document.getElementById('message').value.trim();

  // Visual loading state
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Submitting RSVP...</span> <span class="btn-icon">⏳</span>';
  }

  // Construct payload mapped directly to Google Form entry IDs
  const formData = new URLSearchParams();
  formData.append('entry.1029872924', name);
  formData.append('entry.286667382', email);
  formData.append('entry.1205459523', companions);
  formData.append('entry.942247098', 'I confirm I will bring ₱500 Unisex Exchange Gift');
  formData.append('entry.562072044', dietary || 'None');
  formData.append('entry.193264800', message || 'None');

  try {
    await fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
  } catch (err) {
    console.warn('Google Form submission note:', err);
  }

  // Restore button state
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHtml;
  }

  // Populate confirmation card
  if (modalSummary) {
    modalSummary.innerHTML = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Contact:</strong> ${email}</p>
      <p><strong>Attendance:</strong> ${attendance}</p>
      <p><strong>Companions:</strong> ${companions}</p>
      <p><strong>Dress Code:</strong> "Tambay" Attire</p>
      <p><strong>Exchange Gift:</strong> ₱500 Unisex Confirmed</p>
      ${dietary ? `<p><strong>Dietary Note:</strong> ${dietary}</p>` : ''}
      ${message ? `<p><strong>Note / Song Request:</strong> ${message}</p>` : ''}
    `;
  }

  if (rsvpModal) {
    rsvpModal.classList.add('active');
  }

  form.reset();
}

function closeRSVPModal(e) {
  if (e.target === rsvpModal) {
    rsvpModal.classList.remove('active');
  }
}

function closeRSVPModalDirect() {
  if (rsvpModal) {
    rsvpModal.classList.remove('active');
  }
}

// 6. Ambient BGM: "Here Comes the Sun" (Instrumental, No Vocals @ 0.8x Speed)
let bgAudio = null;
let isAudioPlaying = false;
const audioBtn = document.getElementById('audio-toggle-btn');

function initAudio() {
  if (!bgAudio) {
    bgAudio = new Audio('audio/here-comes-the-sun-instrumental.mp3');
    bgAudio.loop = true;
    bgAudio.volume = 0.5;
    bgAudio.playbackRate = 0.8;
  }
}

function startFestiveAudio() {
  initAudio();
  if (bgAudio) {
    bgAudio.playbackRate = 0.8;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isAudioPlaying = true;
          bgAudio.playbackRate = 0.8;
          if (audioBtn) audioBtn.classList.add('playing');
        })
        .catch((err) => {
          console.warn('Audio play prevented by browser policy:', err);
          isAudioPlaying = false;
          if (audioBtn) audioBtn.classList.remove('playing');
        });
    }
  }
}

function stopFestiveAudio() {
  if (bgAudio) {
    bgAudio.pause();
  }
  isAudioPlaying = false;
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
