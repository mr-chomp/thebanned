function toggleBio(el) {
  const grid = document.querySelector('.membres-grid');
  const membres = Array.from(grid.querySelectorAll('.membre'));
  const isOpen = el.classList.contains('open');

  // Supprime le panneau bio existant
  const existingPanel = grid.querySelector('.membre-bio-panel');
  if (existingPanel) existingPanel.remove();

  // Réinitialise tout : classes, order, et affichage
  membres.forEach(m => {
    m.classList.remove('open');
    m.style.order = '';
    m.style.display = '';
  });
  grid.classList.remove('bio-open');

  if (isOpen) return; // Deuxième clic = ferme

  // Marque le membre ouvert
  el.classList.add('open');
  grid.classList.add('bio-open');

  // Récupère le contenu de la bio
  const bioContent = el.querySelector('.membre-bio').innerHTML;
  const name = el.querySelector('h2').textContent;

  // Crée le panneau bio
  const panel = document.createElement('div');
  panel.className = 'membre-bio-panel';
  panel.innerHTML = '<h2>' + name + '</h2>' + bioContent;

  // Le membre actif passe en order:0, le panneau en order:1
  el.style.order = '0';
  panel.style.order = '1';

  // Cache les autres membres directement en JS
  membres.forEach(m => {
    if (m !== el) {
      m.style.display = 'none';
    }
  });

  grid.appendChild(panel);
}

function setAccordionHeight(details) {
  details.style.maxHeight = details.scrollHeight + 'px';
}

function toggleSong(button) {
  const song = button.closest('.song');
  const details = song.querySelector('.song-details');
  const isOpen = song.classList.contains('open');

  document.querySelectorAll('.song.open').forEach(openSong => {
    const openDetails = openSong.querySelector('.song-details');
    openSong.classList.remove('open');
    openSong.querySelector('.song-header').setAttribute('aria-expanded', 'false');
    openDetails.style.maxHeight = '0px';
  });

  if (!isOpen) {
    song.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
    setAccordionHeight(details);
  }
}

function togglePhotoEvent(el) {
  const grid = el.closest('.photo-events-grid');
  const events = Array.from(grid.querySelectorAll('.photo-event'));
  const isOpen = el.classList.contains('open');

  const existingPanel = grid.querySelector('.photo-event-panel');
  if (existingPanel) existingPanel.remove();

  events.forEach(event => {
    event.classList.remove('open');
    event.style.order = '';
    event.style.display = '';
  });
  grid.classList.remove('photo-event-open');

  if (isOpen) return;

  el.classList.add('open');
  grid.classList.add('photo-event-open');

  const galleryContent = el.querySelector('.photo-event-gallery').innerHTML;
  const name = el.querySelector('h2').textContent;

  const panel = document.createElement('div');
  panel.className = 'photo-event-panel';
  panel.innerHTML = '<h2>' + name + '</h2>' + galleryContent;

  el.style.order = '0';
  panel.style.order = '1';

  events.forEach(event => {
    if (event !== el) {
      event.style.display = 'none';
    }
  });

  grid.appendChild(panel);
}

function openLightbox(src, alt) {
  const lightbox = document.getElementById('lightbox');
  const image = lightbox.querySelector('.lightbox-image');
  image.src = src;
  image.alt = alt || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  const image = lightbox.querySelector('.lightbox-image');
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  image.removeAttribute('src');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  const img = e.target.closest('.photos-grid .photo-item:not(.photo-item--video) img');
  if (!img) return;
  e.stopPropagation();
  openLightbox(img.src, img.alt);
});

document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-close')) {
    closeLightbox();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

function initHeaderVideo() {
  const video = document.querySelector('.header-video');
  if (!video) return;

  video.muted = true;

  const tryPlay = () => {
    const playAttempt = video.play();
    if (playAttempt !== undefined) {
      playAttempt.catch(() => {});
    }
  };

  if (video.readyState >= 2) {
    tryPlay();
  } else {
    video.addEventListener('loadeddata', tryPlay, { once: true });
  }
}

initHeaderVideo();

window.addEventListener('resize', () => {
  document.querySelectorAll('.song.open .song-details').forEach(details => {
    setAccordionHeight(details);
  });
});