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