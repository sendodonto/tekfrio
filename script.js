/* =========================================================================
   CONFIGURACAO: o unico lugar para mexer nos contatos.
   whatsapp:    um numero por unidade (so digitos, 55 + DDD + numero), ou uma
                string unica se a empresa passar a usar um numero so.
                Fonte: Linktree oficial, linktr.ee/tekfriooficial.
   agendamento: link completo (https://...). O perfil diz "Agende pelo link".
   Sem nenhum numero valido, os botoes abrem o Direct do Instagram.
   ========================================================================= */
const CONFIG = {
  whatsapp: {
    'rio-grande': '5553999458966',
    'sao-jose-do-norte': '5553981454087',
    torres: '5551982206823',
  },
  agendamento: 'https://linktr.ee/tekfriooficial',
  instagram: 'tekfriooficial',
};

const MESSAGES = {
  geral: 'Olá! Conheci a TekFrio pelo site e gostaria de solicitar um orçamento.',
  climatizacao: 'Olá! Vim pelo site e gostaria de consultar um serviço de climatização.',
  refrigeracao: 'Olá! Vim pelo site e gostaria de solicitar um orçamento de refrigeração.',
  instalacao: 'Olá! Vim pelo site e gostaria de um orçamento de instalação.',
  manutencao: 'Olá! Vim pelo site e gostaria de consultar manutenção ou higienização.',
  falar: 'Olá! Vim pelo site e gostaria de falar com a equipe da TekFrio.',
  'rio-grande': 'Olá! Vim pelo site e gostaria de consultar o atendimento em Rio Grande - RS.',
  'sao-jose-do-norte': 'Olá! Vim pelo site e gostaria de consultar o atendimento em São José do Norte - RS.',
  torres: 'Olá! Vim pelo site e gostaria de consultar o atendimento em Torres - RS.',
  duvida: 'Olá! Vim pelo site e tenho uma dúvida sobre os serviços.',
};

(() => {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---------- Contato ----------
  // Botao de uma cidade vai direto ao WhatsApp dela. Os botoes gerais vao direto quando
  // ha um numero so; com varios, abrem a janela "Escolha sua cidade".
  const raw = typeof CONFIG.whatsapp === 'string'
    ? (CONFIG.whatsapp ? { geral: CONFIG.whatsapp } : {})
    : (CONFIG.whatsapp || {});
  const phones = {};
  Object.entries(raw).forEach(([unit, value]) => {
    const digits = String(value).replace(/\D/g, '');
    if (/^55\d{10,11}$/.test(digits)) phones[unit] = digits;
    else if (value) console.warn(`CONFIG.whatsapp.${unit} invalido: use so digitos, com 55 + DDD + numero.`);
  });
  const units = Object.keys(phones);
  const waUrl = (phone, key) => `https://wa.me/${phone}?text=${encodeURIComponent(MESSAGES[key] || MESSAGES.geral)}`;
  const pretty = (d) => { const local = d.slice(4); return `(${d.slice(2, 4)}) ${local.slice(0, -4)}-${local.slice(-4)}`; };

  const unitsBox = $('.units');
  const canPick = units.length > 1 && unitsBox && typeof unitsBox.showModal === 'function';
  const openUnits = (key) => {
    $$('.units__opt', unitsBox).forEach((opt) => {
      const phone = phones[opt.dataset.unit];
      opt.parentElement.hidden = !phone;
      if (phone) opt.href = waUrl(phone, key);
    });
    unitsBox.showModal();
  };

  $$('[data-wa]').forEach((a) => {
    const key = a.dataset.wa;
    if (phones[key]) a.href = waUrl(phones[key], key);
    else if (units.length === 1) a.href = waUrl(phones[units[0]], key);
    else if (canPick) a.addEventListener('click', (e) => { e.preventDefault(); openUnits(key); });
    else if (!units.length) a.href = `https://ig.me/m/${CONFIG.instagram}`;
    // varios numeros sem suporte a <dialog>: fica o href do HTML (Linktree oficial)
  });

  const channel = units.length ? 'WhatsApp' : 'Instagram';
  $$('[data-channel]').forEach((el) => { el.textContent = channel; });
  $$('[data-channel-icon]').forEach((use) => use.setAttribute('href', units.length ? '#i-brand-whatsapp' : '#i-brand-instagram'));
  $$('[data-wa-number]').forEach((el) => { const p = phones[el.dataset.waNumber]; el.textContent = p ? pretty(p) : ''; });
  $$('[data-wa-city]').forEach((el) => { el.hidden = !phones[el.dataset.waCity]; });

  if (unitsBox) {
    $('.units__close', unitsBox).addEventListener('click', () => unitsBox.close());
    unitsBox.addEventListener('click', (e) => { if (e.target === unitsBox) unitsBox.close(); });
    // a conversa abre em outra aba; a janela fecha logo depois
    $$('.units__opt', unitsBox).forEach((opt) => opt.addEventListener('click', () => setTimeout(() => unitsBox.close(), 150)));
  }

  // ---------- Agendamento: so aparece com um link https valido ----------
  const booking = /^https:\/\/\S+$/.test(CONFIG.agendamento) ? CONFIG.agendamento : '';
  if (booking) {
    $$('[data-booking]').forEach((a) => { a.href = booking; a.hidden = false; });
    $$('[data-booking-only]').forEach((el) => { el.hidden = false; });
  } else if (CONFIG.agendamento) {
    console.warn('CONFIG.agendamento invalido: use o link completo, comecando com https://');
  }

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // ---------- Rolagem: tudo por IntersectionObserver, sem listener de scroll ----------
  if (!('IntersectionObserver' in window)) {
    $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
    root.classList.add('is-past-hero');
  } else {
    const header = $('.header');
    new IntersectionObserver(([e]) => header.classList.toggle('is-scrolled', !e.isIntersecting))
      .observe($('.top-sentinel'));

    new IntersectionObserver(([e]) => {
      root.classList.toggle('is-past-hero', !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe($('.hero__actions'));

    const atCta = new Set();
    const ctaObs = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? atCta.add(e.target) : atCta.delete(e.target)));
      root.classList.toggle('is-at-cta', atCta.size > 0);
    });
    ctaObs.observe($('.cta'));
    ctaObs.observe($('.footer'));

    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        reveal.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal]').forEach((el) => reveal.observe(el));
  }

  // ---------- Menu do celular ----------
  const header = $('.header');
  const menuBtn = $('.menu-btn');
  const menu = $('#menu');
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    $('use', menuBtn).setAttribute('href', open ? '#i-x' : '#i-menu-2');
    header.classList.toggle('is-open', open);
    root.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
  });
  matchMedia('(min-width: 960px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  // ---------- Abas de servicos (desktop; no celular os paineis ficam empilhados) ----------
  const tabs = $$('.svc__tab');
  const select = (tab, focus) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $(`#${t.getAttribute('aria-controls')}`).classList.toggle('is-active', on);
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (step) { e.preventDefault(); select(tabs[(i + step + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
    });
  });

  // ---------- Galeria ampliada ----------
  const box = $('.lightbox');
  const items = $$('.g__btn');
  if (!box || !items.length || typeof box.showModal !== 'function') return;

  const img = $('.lightbox__img', box);
  const cap = $('.lightbox__cap', box);
  let index = 0;
  const show = (i) => {
    index = (i + items.length) % items.length;
    const item = items[index];
    img.src = item.dataset.full;
    img.alt = $('img', item).alt;
    cap.textContent = `${item.dataset.caption}  ·  ${index + 1} de ${items.length}`;
  };

  items.forEach((item, i) => item.addEventListener('click', () => { show(i); box.showModal(); }));
  $('.lightbox__close', box).addEventListener('click', () => box.close());
  $('.lightbox__prev', box).addEventListener('click', () => show(index - 1));
  $('.lightbox__next', box).addEventListener('click', () => show(index + 1));
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
  let startX = null;
  box.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  box.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 48) show(index + (dx < 0 ? 1 : -1));
  });
})();
