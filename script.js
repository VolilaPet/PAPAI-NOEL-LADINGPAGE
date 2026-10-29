const video = document.querySelector('#demo-video');
const playButton = document.querySelector('.demo-play');
if (video && playButton) {
  playButton.hidden = false;
  playButton.addEventListener('click', async () => {
    try { video.dispatchEvent(new Event("prepare-media")); await video.play(); } catch { playButton.hidden = false; }
  });
  video.addEventListener('play', () => { playButton.hidden = true; });
  video.addEventListener('pause', () => { playButton.hidden = false; });
  video.addEventListener('ended', () => { playButton.hidden = false; });
}
const track = document.querySelector('.in-use-track');
if (track) {
  const controls = document.querySelector('.in-use-controls');
  const previous = document.querySelector('.in-use-prev');
  const next = document.querySelector('.in-use-next');
  const count = document.querySelector('.in-use-count');
  const cards = [...track.children];
  const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    controls.hidden = max < 2;
    previous.disabled = track.scrollLeft < 2;
    next.disabled = track.scrollLeft >= max - 2;
    const current = next.disabled ? cards.length : Math.min(cards.length, Math.round(track.scrollLeft / step()) + 1);
    count.textContent = `${current} / ${cards.length}`;
  };
  const move = direction => track.scrollBy({left:direction*step(),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  track.addEventListener('scroll', update, {passive:true});
  new ResizeObserver(update).observe(track);
  update();
}
const faqButtons = [...document.querySelectorAll('.faq-question')];
function setFaqState(button, expanded) {
  button.setAttribute('aria-expanded', String(expanded));
  button.closest('.faq-card').classList.toggle('is-open', expanded);
  const panel = document.getElementById(button.getAttribute('aria-controls'));
  panel.setAttribute('aria-hidden', String(!expanded));
  panel.inert = !expanded;
}
faqButtons.forEach(button => {
  button.addEventListener('click', () => {
    const opening = button.getAttribute('aria-expanded') !== 'true';
    faqButtons.forEach(other => setFaqState(other, other === button && opening));
  });
});
const kitInputs = [...document.querySelectorAll('input[name="natal-kit"]')];
const kitBuy = document.querySelector('.kit-buy');
if (kitBuy) {
  const checkoutForKit = () => {
    const selected = kitInputs.find(input => input.checked);
    const raw = window.KITS_CHECKOUT?.[selected?.value];
    try { const url = new URL(raw); return url.protocol === 'https:' ? url.href : null; } catch { return null; }
  };
  const updateKitCheckout = () => {
    const available = Boolean(checkoutForKit());
    kitBuy.disabled = !available;

  };
  kitInputs.forEach(input => input.addEventListener('change', updateKitCheckout));
  kitBuy.addEventListener('click', () => { const url = checkoutForKit(); if (url) window.location.assign(url); });
  updateKitCheckout();
}

const offerShortcut = document.querySelector('.hero .cta[data-target]');
if (offerShortcut) {
  offerShortcut.addEventListener('click', () => {
    const section = document.querySelector(offerShortcut.dataset.target);
    section?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  });
}
