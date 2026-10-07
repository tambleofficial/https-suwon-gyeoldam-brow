const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '닫기' : '메뉴';
    nav.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      toggle.click(); toggle.focus();
    }
  });
}
for (const collection of document.querySelectorAll('[data-carousel]')) {
  const track = collection.querySelector('.carousel-track');
  const prev = collection.querySelector('[data-prev]');
  const next = collection.querySelector('[data-next]');
  if (!track || !prev || !next) continue;
  const update = () => {
    prev.disabled = track.scrollLeft < 4;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  };
  prev.addEventListener('click', () => track.scrollBy({left: -track.clientWidth * .8, behavior: 'smooth'}));
  next.addEventListener('click', () => track.scrollBy({left: track.clientWidth * .8, behavior: 'smooth'}));
  track.addEventListener('scroll', update, {passive: true});
  window.addEventListener('resize', update);
  update();
}
