/* Simulação identificada; não representa vendas reais e não usa armazenamento. */
(() => {
  const names = ['Maria', 'João', 'Ana', 'Carlos', 'Fernanda', 'Pedro', 'Juliana', 'Rafael', 'Camila', 'Bruno'];
  const toast = document.createElement('aside');
  toast.className = 'sale-toast';
  toast.hidden = true;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.setAttribute('aria-atomic', 'true');
  toast.innerHTML = '<span class="sale-toast-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m12 2-5 6h3l-5 6h4l-5 6h16l-5-6h4l-5-6h3zM12 20v3"/></svg></span><span class="sale-toast-copy"><span class="sale-toast-simulation">Simulação</span><strong></strong><span class="sale-toast-status">✅ Compra confirmada</span></span>';
  document.body.append(toast);
  const title = toast.querySelector('strong');
  const protectedElements = [...document.querySelectorAll('.hero .cta, .kit-buy, .kit-option')];
  let showing = false, timer, hideTimer, removeTimer;
  const overlaps = () => {
    const area = {left:12, right:12 + Math.min(280, innerWidth - 24), top:innerHeight - 122, bottom:innerHeight - 12};
    return protectedElements.some(element => {
      const rect = element.getBoundingClientRect();
      return rect.width && rect.height && rect.left < area.right + 8 && rect.right > area.left - 8 && rect.top < area.bottom + 8 && rect.bottom > area.top - 8;
    });
  };
  const dismiss = (immediate = false) => {
    clearTimeout(hideTimer); clearTimeout(removeTimer);
    toast.classList.remove('is-visible'); showing = false;
    if (immediate) toast.hidden = true;
    else removeTimer = setTimeout(() => { toast.hidden = true; }, 180);
  };
  const schedule = delay => { clearTimeout(timer); timer = setTimeout(showNext, delay); };
  function showNext() {
    if (document.hidden || overlaps()) { schedule(1500); return; }
    const name = names[Math.floor(Math.random() * names.length)];
    const quantity = 1 + Math.floor(Math.random() * 3);
    title.textContent = `${name} comprou ${quantity === 1 ? '1 Papai Noel' : `${quantity} Papais Noéis`}`;
    clearTimeout(removeTimer); toast.hidden = false;
    void toast.offsetWidth;
    toast.classList.add('is-visible'); showing = true;
    hideTimer = setTimeout(() => dismiss(), 2820);
    schedule(30000 + Math.floor(Math.random() * 15001));
  }
  const protect = () => { if (showing && (document.hidden || overlaps())) dismiss(true); };
  window.addEventListener('scroll', protect, {passive:true});
  window.addEventListener('resize', protect, {passive:true});
  document.addEventListener('visibilitychange', protect);
  window.addEventListener('pagehide', () => { clearTimeout(timer); dismiss(true); });
  window.addEventListener('pageshow', event => { if (event.persisted) schedule(5000); });
  schedule(5000);
})();
