/* Mídias inferiores só são conectadas à rede perto da área visível. */
(() => {
  const hero = document.querySelector('.scene img');
  const media = [...document.querySelectorAll('video[data-poster]')];
  const prepare = video => {
    if (video.dataset.prepared) return;
    video.dataset.prepared = 'true';
    video.poster = video.dataset.poster;
    for (const source of video.querySelectorAll('source[data-src]')) source.src = source.dataset.src;
    video.preload = video.classList.contains('loop-video') ? 'auto' : 'metadata';
    video.load();
    if (video.classList.contains('loop-video')) {
      video.muted = true;
      video.play().catch(() => { /* Poster continua visível se o navegador bloquear autoplay. */ });
    }
  };
  media.forEach(video => video.addEventListener('prepare-media', () => prepare(video)));
  const start = () => {
    const offer = document.querySelector('.christmas-offer');
    const loadOffer = () => offer?.style.setProperty('--offer-scene', 'url("assets/oferta-cenario-v2.webp")');
    if (!('IntersectionObserver' in window)) { media.forEach(prepare); loadOffer(); return; }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) { prepare(entry.target); observer.unobserve(entry.target); }
    }, {rootMargin:'150px 100px'});
    media.forEach(video => observer.observe(video));
    const backgrounds = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { loadOffer(); backgrounds.disconnect(); }
    }, {rootMargin:'600px'});
    if (offer) backgrounds.observe(offer);
  };
  if (!hero || hero.complete) start();
  else { hero.addEventListener('load', start, {once:true}); hero.addEventListener('error', start, {once:true}); }
})();
