/* Contact : formulaire Netlify Forms (envoi sans rechargement) + coordonnées depuis data/club.json */
(function () {
  'use strict';
  const { $, loadJSON } = window.CPM;

  loadJSON('club').then((c) => {
    if (c.telephone) {
      const box = $('#info-tel'), a = $('#tel-link');
      a.textContent = c.telephone;
      a.href = 'tel:' + c.telephone.replace(/[^\d+]/g, '');
      box.hidden = false;
    }
    const n = $('#contact-nom');
    if (n && c.contact && c.contact.nom) n.textContent = c.contact.nom + (c.contact.role ? ', ' + c.contact.role.toLowerCase() : '');
  }).catch(() => {});

  const form = $('#contact-form');
  const status = $('#form-status');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const btn = $('button[type="submit"]', form);
    btn.disabled = true;
    status.className = 'form__status';
    status.textContent = 'Envoi en cours…';
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString()
    }).then((r) => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      form.reset();
      status.className = 'form__status ok';
      status.textContent = 'Merci ! Votre message a bien été envoyé. Nous vous répondons dès que possible.';
    }).catch(() => {
      status.className = 'form__status err';
      status.textContent = 'L’envoi n’a pas abouti. Écrivez-nous directement par e-mail (adresse ci-contre).';
    }).finally(() => { btn.disabled = false; });
  });
})();
